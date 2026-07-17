/**
 * Detect bot / spam contact submissions before emails are sent.
 * Patterns based on real spam hitting the site (random tokens + dotted Gmails).
 */

export type SpamCheckInput = {
  name: string
  email: string
  message?: string
  phone?: string
  /** Honeypot: must be empty if present */
  website?: string
  company?: string
}

export type SpamCheckResult = {
  spam: boolean
  reasons: string[]
}

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'throwaway.email',
  'yopmail.com',
  'sharklasers.com',
  'trashmail.com',
  'getnada.com',
  'maildrop.cc',
  'dispostable.com',
  'fakeinbox.com',
])

const SPAM_PHRASES = [
  /seo\s*(service|package|ranking)/i,
  /backlink/i,
  /increase your (traffic|ranking)/i,
  /cheap\s*(viagra|pills|meds)/i,
  /crypto\s*(invest|trading|airdrop)/i,
  /whatsapp\s*\+?\d{8,}/i,
  /点击/i,
  /加微信/i,
  /免费/i,
]

/** Random bot token: long alphanumeric, mixed case, no spaces (e.g. twympUDAWjlkiRpbECGPyZss) */
function isRandomToken(value: string): boolean {
  const t = value.trim()
  if (t.length < 12) return false
  if (/\s/.test(t)) return false
  if (!/^[a-zA-Z0-9._-]+$/.test(t)) return false

  const letters = t.replace(/[^a-zA-Z]/g, '')
  if (letters.length < 10) return false

  const hasLower = /[a-z]/.test(letters)
  const hasUpper = /[A-Z]/.test(letters)
  if (hasLower && hasUpper) return true

  // Long single-case alphanumeric blobs are also bot-like
  if (t.length >= 18 && /^[a-zA-Z0-9]+$/.test(t)) return true

  return false
}

function tooManyDotsInLocalPart(email: string): boolean {
  const local = email.split('@')[0] || ''
  const dots = (local.match(/\./g) || []).length
  // Allow up to 2 dots (e.g. first.last@, a.b.c@). 3+ is typical bot padding.
  // Spam example: s.am.sh.a.m1.38@gmail.com (5 dots)
  return dots > 2
}

function linkSpamScore(text: string): number {
  const urls = text.match(/https?:\/\/|www\./gi) || []
  return urls.length
}

export function checkSpam(input: SpamCheckInput): SpamCheckResult {
  const reasons: string[] = []
  const name = (input.name || '').trim()
  const email = (input.email || '').trim().toLowerCase()
  const message = (input.message || '').trim()
  const phone = (input.phone || '').trim()

  if (input.website?.trim() || input.company?.trim()) {
    reasons.push('honeypot')
  }

  if (isRandomToken(name)) {
    reasons.push('gibberish_name')
  }

  if (message && isRandomToken(message)) {
    reasons.push('gibberish_message')
  }

  // Name + message both single tokens with no real words
  if (
    name.length >= 10 &&
    message.length >= 10 &&
    !/\s/.test(name) &&
    !/\s/.test(message) &&
    /^[a-zA-Z0-9]+$/.test(name) &&
    /^[a-zA-Z0-9]+$/.test(message)
  ) {
    reasons.push('token_pair')
  }

  if (tooManyDotsInLocalPart(email)) {
    reasons.push('dotted_email')
  }

  const domain = email.split('@')[1] || ''
  if (DISPOSABLE_DOMAINS.has(domain)) {
    reasons.push('disposable_email')
  }

  const combined = `${name} ${message} ${phone}`
  for (const re of SPAM_PHRASES) {
    if (re.test(combined)) {
      reasons.push('spam_phrase')
      break
    }
  }

  if (linkSpamScore(message) >= 2) {
    reasons.push('link_spam')
  }

  // Message is only a short random code with no letters that look like words
  if (message.length > 0 && message.length < 8 && !/[aeiouáéíóú]/i.test(message)) {
    reasons.push('emptyish_message')
  }

  return {
    spam: reasons.length > 0,
    reasons: [...new Set(reasons)],
  }
}
