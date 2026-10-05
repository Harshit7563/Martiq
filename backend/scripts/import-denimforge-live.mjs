/**
 * Import complete products from live thedenimforge.com into Martiq.
 */
import pg from 'pg'
import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'

const { Pool } = pg
const LIVE_ORIGIN = 'https://thedenimforge.com'
const SOURCE =
  process.argv[2] || '/tmp/df_live_products.json'

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || 'harshit',
  password: process.env.PG_PASSWORD || '123456',
  database: process.env.PG_DATABASE || 'martiq',
})

function absUrl(u) {
  if (!u) return null
  const s = String(u).trim()
  if (!s) return null
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) return `${LIVE_ORIGIN}${s}`
  return `${LIVE_ORIGIN}/${s}`
}

function asArray(v) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function mapGender(categorySlug) {
  if (categorySlug === 'womens-jeans') return 'Women'
  if (categorySlug === 'kids-jeans') return 'Unisex'
  return 'Men'
}

function brandSanitize(text) {
  return String(text || '')
    .replace(/the\s*denim\s*forge/gi, 'Martiq')
    .replace(/denim\s*forge/gi, 'Martiq')
    .replace(/denimforge/gi, 'Martiq')
    .replace(/\bDF-/g, 'MQ-')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function isComplete(p) {
  const name = String(p.name || '').trim()
  const price = Number(p.retail_price || 0)
  const images = asArray(p.images).map(absUrl).filter(Boolean)
  const sizes = asArray(p.sizes).map(String).filter(Boolean)
  const details =
    String(p.fabric || '').trim() ||
    String(p.fit || '').trim() ||
    String(p.wash || '').trim() ||
    String(p.description || '').trim()

  if (!name) return false
  if (!Number.isFinite(price) || price < 399) return false
  if (!images.length) return false
  if (!sizes.length) return false
  if (!details) return false
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
  const all = JSON.parse(readFileSync(SOURCE, 'utf8'))
  if (!Array.isArray(all)) throw new Error('Expected products array from live API')

  const complete = all.filter(isComplete)
  console.log(`Live products: ${all.length}`)
  console.log(`Complete kept: ${complete.length}`)
  console.log(`Removed incomplete: ${all.length - complete.length}`)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await ensureColumns(client)
    await client.query('DELETE FROM product_sizes')
    await client.query('DELETE FROM products')

    let inserted = 0
    const usedSlugs = new Set()

    for (let i = 0; i < complete.length; i++) {
      const p = complete[i]
      const retail = Math.round(Number(p.retail_price))
      const mrp = Math.max(retail + 50, Math.round(retail / 0.8 / 10) * 10)
      const images = asArray(p.images).map(absUrl).filter(Boolean)
      const sizes = asArray(p.sizes).map(String).filter(Boolean)
      const gender = mapGender(p.category_slug)
      let slug = `df-${String(p.slug || p.id).trim()}`.slice(0, 180)
      if (usedSlugs.has(slug)) slug = `${slug}-${String(i)}`
      usedSlugs.add(slug)

      const id = randomUUID()
      const wash = String(p.wash || '').trim()
      const fit = String(p.fit || '').trim()
      const fabric = String(p.fabric || 'Premium denim').trim()
      let description = brandSanitize(
        String(p.description || p.short_description || '').trim() ||
          `Premium ${fit || 'regular'} fit denim in ${wash || 'classic wash'}. Crafted for everyday wear by Martiq.`,
      )
      if (!/martiq/i.test(description)) description = `${description} Shop on Martiq.`

      await client.query(
        `INSERT INTO products (
          id, slug, name, gender, category, price_inr, discount_price_inr,
          rating, rating_count, image_url, is_new_arrival, is_best_seller,
          is_trending, is_offer, created_at, description, material, fit, wash, images_json
        ) VALUES (
          $1,$2,$3,$4,'Jeans',$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),$14,$15,$16,$17,$18
        )`,
        [
          id,
          slug,
          brandSanitize(String(p.name).trim()),
          gender,
          mrp,
          retail,
          Math.min(5, Number(p.rating || 4.4)),
          Number(p.review_count || 0),
          images[0],
          Boolean(p.is_new),
          Boolean(p.is_bestseller),
          Boolean(p.is_featured),
          mrp > retail,
          description,
          fabric,
          fit || 'Regular',
          wash,
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
    const { rows } = await client.query(
      `SELECT gender, count(*)::int AS n FROM products GROUP BY gender ORDER BY 1`,
    )
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
