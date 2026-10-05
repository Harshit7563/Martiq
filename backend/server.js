const express = require('express')
const cors = require('cors')
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()

const { getCategories, getProducts } = require('./db')
const { createSignupOtp, verifySignupOtp, normalizeEmail } = require('./otp')
const { sendOtpEmail } = require('./emailjs')

const app = express()

const PORT = Number(process.env.PORT || 8080)
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim()
const EMAILJS_CONFIGURED = Boolean(
  (process.env.EMAILJS_PUBLIC_KEY || '').trim() &&
    (process.env.EMAILJS_TEMPLATE_ID || '').trim(),
)

const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGIN ||
  'http://localhost:5173,https://martiq.in,https://www.martiq.in'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
      return cb(new Error(`CORS blocked for origin: ${origin}`))
    },
  }),
)
app.use(express.json())

app.get('/health', (_req, res) =>
  res.json({
    ok: true,
    googleAuth: Boolean(GOOGLE_CLIENT_ID),
    db: true,
    emailOtp: EMAILJS_CONFIGURED,
  }),
)

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await getCategories()
    res.json({ categories })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('categories failed:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'Failed to load categories' })
  }
})

app.get('/api/products', async (_req, res) => {
  try {
    const products = await getProducts()
    res.json({ products, total: products.length })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('products failed:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'Failed to load products' })
  }
})

/** India pincode → city/state (Postal PIN Code API), MarkMart-style address autofill. */
app.get('/api/pincode/:pin', async (req, res) => {
  const pin = String(req.params.pin || '').replace(/\D/g, '')
  if (!/^[1-9]\d{5}$/.test(pin)) {
    return res.status(400).json({ error: 'Enter a valid 6-digit pincode.' })
  }
  try {
    const upstream = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      headers: { Accept: 'application/json' },
    })
    const data = await upstream.json()
    const block = Array.isArray(data) ? data[0] : null
    const offices = block?.PostOffice
    if (block?.Status !== 'Success' || !Array.isArray(offices) || !offices.length) {
      return res.status(404).json({ error: 'Pincode not found. Please check and try again.' })
    }
    const po = offices[0]
    return res.json({
      pincode: pin,
      city: po.Block || po.District || po.Name || '',
      district: po.District || '',
      state: po.State || '',
      area: po.Name || '',
      country: po.Country || 'India',
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('pincode lookup failed:', err instanceof Error ? err.message : err)
    return res.status(502).json({ error: 'Pincode service unavailable. Try again.' })
  }
})

/**
 * Signup step 1: send email OTP via EmailJS.
 */
app.post('/api/auth/signup/send-otp', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim()
    const email = normalizeEmail(req.body?.email)
    if (!name) return res.status(400).json({ error: 'Please enter your name.' })
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Enter a valid email address.' })
    }

    const { otp, timeLabel } = createSignupOtp(email, name)

    try {
      await sendOtpEmail({
        toEmail: email,
        name,
        passcode: otp,
        time: timeLabel,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP email'
      // eslint-disable-next-line no-console
      console.error('EmailJS OTP send failed:', message)
      // eslint-disable-next-line no-console
      console.log(`[dev] Signup OTP for ${email}: ${otp} (valid till ${timeLabel})`)
      return res.status(502).json({
        error: message,
        // Local fallback so signup can still be tested before EmailJS template is ready
        devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
      })
    }

    // eslint-disable-next-line no-console
    console.log(`Signup OTP emailed to ${email} (expires ${timeLabel})`)
    return res.json({
      ok: true,
      email,
      expiresInMinutes: 15,
      message: 'OTP sent to your email.',
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('send-otp failed:', err instanceof Error ? err.message : err)
    return res.status(500).json({ error: 'Could not send verification email.' })
  }
})

/**
 * Signup step 2: verify OTP before creating the account on the client.
 */
app.post('/api/auth/signup/verify-otp', (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const otp = String(req.body?.otp || '').trim()
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: 'Enter the 6-digit OTP.' })
  }

  const result = verifySignupOtp(email, otp)
  if (!result.ok) return res.status(400).json({ error: result.error })

  return res.json({
    ok: true,
    email: result.email,
    name: result.name,
    emailVerified: true,
  })
})

/**
 * Real Google Sign-In: verify ID token from Google Identity Services,
 * then return the authenticated user profile.
 */
app.post('/api/auth/google', async (req, res) => {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        error: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID in backend/.env',
      })
    }

    const credential = req.body?.credential
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ error: 'Missing Google credential' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload?.email) {
      return res.status(401).json({ error: 'Invalid Google token' })
    }

    return res.json({
      user: {
        id: payload.sub,
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        picture: payload.picture || null,
        emailVerified: Boolean(payload.email_verified),
        provider: 'google',
      },
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Google auth failed:', err instanceof Error ? err.message : err)
    return res.status(401).json({ error: 'Google sign-in verification failed' })
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`)
  // eslint-disable-next-line no-console
  console.log(
    GOOGLE_CLIENT_ID
      ? 'Google OAuth: enabled'
      : 'Google OAuth: disabled (set GOOGLE_CLIENT_ID in backend/.env)',
  )
  // eslint-disable-next-line no-console
  console.log(
    EMAILJS_CONFIGURED
      ? 'Email OTP: enabled (EmailJS)'
      : 'Email OTP: waiting for EMAILJS_TEMPLATE_ID in backend/.env',
  )
})
