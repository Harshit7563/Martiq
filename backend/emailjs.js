async function sendOtpEmail({ toEmail, name, passcode, time }) {
  const publicKey = (process.env.EMAILJS_PUBLIC_KEY || '').trim()
  const privateKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim()
  const serviceId = (process.env.EMAILJS_SERVICE_ID || 'default_service').trim()
  const templateId = (process.env.EMAILJS_TEMPLATE_ID || '').trim()

  if (!publicKey) {
    throw new Error('EMAILJS_PUBLIC_KEY is not configured')
  }
  if (!templateId) {
    throw new Error(
      'EMAILJS_TEMPLATE_ID is missing. Create an EmailJS template with {{passcode}}, {{time}}, {{to_email}}, {{name}} and set EMAILJS_TEMPLATE_ID in backend/.env',
    )
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      passcode: String(passcode),
      time: String(time),
      to_email: String(toEmail),
      email: String(toEmail),
      name: String(name || 'there'),
      reply_to: String(toEmail),
    },
  }
  if (privateKey) payload.accessToken = privateKey

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `EmailJS failed with status ${res.status}`)
  }
  return { ok: true, response: text }
}

module.exports = { sendOtpEmail }
