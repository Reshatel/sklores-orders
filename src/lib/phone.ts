import { PHONE_ALLOWED_CHARS, PHONE_PATTERN } from '../config'

function toInternational(digits: string, hasPlus: boolean) {
  if (digits.length === 12 && digits.startsWith('380')) return `+${digits}`
  if (hasPlus) return null
  if (digits.length === 11 && digits.startsWith('80')) return `+3${digits}`
  if (digits.length === 10 && digits.startsWith('0')) return `+38${digits}`
  if (digits.length === 9 && !digits.startsWith('0')) return `+380${digits}`
  return null
}

export function normalizePhone(rawPhone: string) {
  const phone = rawPhone.trim()
  if (!PHONE_ALLOWED_CHARS.test(phone)) return null

  const digits = phone.replace(/\D/g, '')
  const international = toInternational(digits, phone.startsWith('+'))
  if (!international || !PHONE_PATTERN.test(international)) return null

  return international
}

export function formatPhone(phone: string) {
  if (!PHONE_PATTERN.test(phone)) return phone
  return `${phone.slice(0, 4)} ${phone.slice(4, 6)} ${phone.slice(6, 9)} ${phone.slice(9, 11)} ${phone.slice(11)}`
}
