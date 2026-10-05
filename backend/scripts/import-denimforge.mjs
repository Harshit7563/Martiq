/**
 * Import complete The Denim Forge products into Martiq Postgres.
 * Removes incomplete / filler SKUs.
 */
import pg from 'pg'
import { randomUUID } from 'crypto'
import { generateProducts } from '../../../thedenimforge/server/src/db/products-data.js'
import { getProductImages } from '../../../thedenimforge/server/src/db/product-images.js'

const { Pool } = pg

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || 'harshit',
  password: process.env.PG_PASSWORD || '123456',
  database: process.env.PG_DATABASE || 'martiq',
})

function parseSizes(raw) {
  if (Array.isArray(raw)) return raw.map(String)
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }
  return []
}

function mapGender(category) {
  if (category === 'womens-jeans') return 'Women'
  if (category === 'kids-jeans') return 'Unisex'
  return 'Men'
}

function mapCategory(category) {
  return 'Jeans'
}

function isComplete(p) {
  if (!p?.name?.trim()) return false
  if (!p?.slug?.trim()) return false
  if (!Number.isFinite(p.retail) || p.retail < 399) return false
  if (!p.fabric?.trim()) return false
  if (!p.fit?.trim() || p.fit === 'Mixed') return false
  if (!p.wash?.trim() || p.wash === 'Mixed') return false

  const allowed = new Set(['mens-jeans', 'womens-jeans', 'kids-jeans', 'new-arrivals'])
  // Keep premium export denim; drop wholesale economy packs
  if (p.category === 'bulk-orders') {
    return p.retail >= 3999 && /export/i.test(p.name)
  }
  if (!allowed.has(p.category)) return false

  // Drop obvious filler / incomplete wholesale stubs
  const deny = [/starter economy/i, /basic wholesale/i, /entry level/i, /economy wholesale/i, /wholesale starter/i]
  if (deny.some((re) => re.test(p.name))) return false

  return true
}

async function ensureColumns(client) {
  await client.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS fit text NOT NULL DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS wash text NOT NULL DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS images_json text NOT NULL DEFAULT '[]';
  `)
}

async function main() {
  const all = generateProducts()
  const complete = all.filter(isComplete)

  console.log(`Generated ${all.length} Denim Forge products`)
  console.log(`Keeping ${complete.length} complete products (removed ${all.length - complete.length} incomplete/filler)`)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await ensureColumns(client)
    await client.query('DELETE FROM product_sizes')
    await client.query('DELETE FROM products')

    let inserted = 0
    for (let i = 0; i < complete.length; i++) {
      const p = complete[i]
      const id = randomUUID()
      const images = getProductImages(p, i).map((path) => path) // /images/products/...
      if (!images.length) {
        console.warn('skip no image', p.name)
        continue
      }

      const retail = Math.round(Number(p.retail))
      const mrp = Math.round(retail / 0.8 / 10) * 10 // ~20% off vs MRP
      const gender = mapGender(p.category)
      const category = mapCategory(p.category)
      const sizes = parseSizes(p.sizes)
      if (!sizes.length) {
        console.warn('skip no sizes', p.name)
        continue
      }

      const description =
        `Premium ${p.fit} fit denim jeans in ${p.wash}. ${p.fabric}. Authentic The Denim Forge style for Martiq.`
      const rating = 4.2 + ((i * 7) % 7) / 10
      const ratingCount = 40 + ((i * 17) % 420)

      await client.query(
        `INSERT INTO products (
          id, slug, name, gender, category, price_inr, discount_price_inr,
          rating, rating_count, image_url, is_new_arrival, is_best_seller,
          is_trending, is_offer, created_at, description, material, fit, wash, images_json
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),$15,$16,$17,$18,$19
        )`,
        [
          id,
          `df-${p.slug}`.slice(0, 180),
          p.name,
          gender,
          category,
          mrp,
          retail,
          Math.min(5, Number(rating.toFixed(1))),
          ratingCount,
          images[0],
          Boolean(p.is_new || p.category === 'new-arrivals'),
          Boolean(p.bestseller),
          Boolean(p.featured),
          mrp > retail,
          description,
          p.fabric,
          p.fit,
          p.wash,
          JSON.stringify(images),
        ],
      )

      for (const size of sizes) {
        await client.query(
          `INSERT INTO product_sizes (product_id, size, in_stock) VALUES ($1,$2,true)
           ON CONFLICT DO NOTHING`,
          [id, size],
        )
      }
      inserted += 1
    }

    await client.query('COMMIT')
    const { rows } = await client.query(`
      SELECT gender, count(*)::int AS n FROM products GROUP BY gender ORDER BY gender;
    `)
    console.log('Inserted', inserted)
    console.log('By gender:', rows)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
