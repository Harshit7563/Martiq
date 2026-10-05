const crypto = require('crypto')

/** @type {Map<string, { otpHash: string, expiresAt: number, name: string, attempts: number }>} */
const pending = new Map()

const OTP_TTL_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex')
}

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000))
}

function formatExpiry(date = new Date(Date.now() + OTP_TTL_MS)) {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function createSignupOtp(email, name) {
  const e = normalizeEmail(email)
  const otp = generateOtp()
  const expiresAt = Date.now() + OTP_TTL_MS
  pending.set(e, {
    otpHash: hashOtp(otp),
    expiresAt,
    name: String(name || '').trim(),
    attempts: 0,
  })
  return {
    email: e,
    otp,
    expiresAt,
    timeLabel: formatExpiry(new Date(expiresAt)),
  }
}

function verifySignupOtp(email, otp) {
  const e = normalizeEmail(email)
  const row = pending.get(e)
  if (!row) return { ok: false, error: 'No OTP found. Please request a new code.' }
  if (Date.now() > row.expiresAt) {
    pending.delete(e)
    return { ok: false, error: 'OTP expired. Please request a new code.' }
  }
  row.attempts += 1
  if (row.attempts > MAX_ATTEMPTS) {
    pending.delete(e)
    return { ok: false, error: 'Too many attempts. Please request a new code.' }
  }
  if (hashOtp(otp) !== row.otpHash) {
    return { ok: false, error: 'Incorrect OTP. Try again.' }
  }
  pending.delete(e)
  return { ok: true, name: row.name, email: e }
}

module.exports = {
  createSignupOtp,
  verifySignupOtp,
  normalizeEmail,
  OTP_TTL_MS,
}
