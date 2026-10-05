const { Pool } = require('pg')

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgres://${encodeURIComponent(process.env.PG_USER || 'harshit')}:${encodeURIComponent(process.env.PG_PASSWORD || '123456')}@${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || '5432'}/${process.env.PG_DATABASE || 'martiq'}`,
})

const CATEGORY_MAP = {
  'T-Shirts': 'tees',
  Tops: 'tees',
  Oversized: 'tees',
  Shirts: 'shirts',
  Jeans: 'jeans',
  Accessories: 'accessories',
  Dresses: 'dresses',
  'Co-ords': 'coords',
}

const CATEGORY_LABELS = {
  tees: 'T-Shirts',
  shirts: 'Shirts',
  jeans: 'Jeans',
  accessories: 'Accessories',
  dresses: 'Dresses',
  coords: 'Co-ords',
  bottoms: 'Bottoms',
  active: 'Activewear',
  new: 'New Arrivals',
}

function mapCategory(raw) {
  return CATEGORY_MAP[raw] || String(raw || 'tees').toLowerCase().replace(/\s+/g, '-')
}

function mapBadge(row) {
  if (row.is_new_arrival) return 'new'
  if (row.is_best_seller) return 'bestseller'
  if (row.is_trending) return 'limited'
  return undefined
}

function parseImages(row) {
  if (row.images_json) {
    try {
      const parsed = JSON.parse(row.images_json)
      if (Array.isArray(parsed) && parsed.length) return parsed.map(String)
    } catch {
      /* ignore */
    }
  }
  return row.image_url ? [row.image_url] : []
}

/** Keep storefront branding Martiq-only. */
function brandSanitize(text) {
  return String(text || '')
    .replace(/the\s*denim\s*forge/gi, 'Martiq')
    .replace(/denim\s*forge/gi, 'Martiq')
    .replace(/denimforge/gi, 'Martiq')
    .replace(/\bDF-/g, 'MQ-')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function rowToProduct(row, sizes = []) {
  const mrp = Number(row.price_inr) || 0
  const price = Number(row.discount_price_inr) || mrp
  const gender = row.gender || 'Unisex'
  const gallery = parseImages(row)
  const wash = row.wash || ''
  const name = brandSanitize(row.name)
  let description = brandSanitize(
    row.description ||
      `Premium ${row.category || 'denim'} from Martiq — made for everyday comfort and a clean silhouette.`,
  )
  if (!/martiq/i.test(description)) {
    description = `${description} Shop only on Martiq.`
  }
  return {
    id: String(row.id),
    name,
    color: wash || gender,
    category: mapCategory(row.category),
    sku: brandSanitize(row.slug || String(row.id)),
    image: gallery[0] || row.image_url,
    gallery,
    price,
    mrp: mrp > price ? mrp : undefined,
    badge: mapBadge(row),
    description,
    material: row.material || 'Premium denim',
    fit: row.fit ? `${row.fit} fit` : 'Regular fit',
    care: 'Machine wash cold, inside out',
    gender,
    sizes,
    rating: row.rating != null ? Number(row.rating) : undefined,
    ratingCount: row.rating_count != null ? Number(row.rating_count) : undefined,
  }
}

async function getCategories() {
  const { rows } = await pool.query(
    `SELECT category, COUNT(*)::int AS count
     FROM products
     GROUP BY category
     ORDER BY category ASC`,
  )
  const fromDb = rows.map((r) => ({
    id: mapCategory(r.category),
    name: CATEGORY_LABELS[mapCategory(r.category)] || r.category,
    count: r.count,
  }))
  const byId = new Map()
  for (const c of fromDb) {
    const prev = byId.get(c.id)
    if (prev) prev.count += c.count
    else byId.set(c.id, { id: c.id, name: c.name, count: c.count })
  }
  return [{ id: 'new', name: 'New Arrivals' }, ...Array.from(byId.values())]
}

async function getProducts() {
  const { rows } = await pool.query(
    `SELECT p.*,
            COALESCE(
              (
                SELECT json_agg(ps.size ORDER BY ps.size)
                FROM product_sizes ps
                WHERE ps.product_id = p.id AND ps.in_stock = true
              ),
              '[]'::json
            ) AS sizes
     FROM products p
     ORDER BY p.created_at DESC`,
  )
  return rows.map((row) => {
    const sizes = Array.isArray(row.sizes) ? row.sizes : []
    return rowToProduct(row, sizes)
  })
}

module.exports = { pool, getCategories, getProducts }
