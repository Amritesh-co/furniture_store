export function sanitizeString(value, max = 500) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function isValidEmail(email) {
  if (typeof email !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidPassword(password) {
  if (typeof password !== 'string') return false
  if (password.length < 6) return false
  return /[A-Za-z]/.test(password) && /\d/.test(password)
}
