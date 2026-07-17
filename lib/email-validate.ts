import dns from 'dns'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)
const resolve4 = promisify(dns.resolve4)

export type EmailReachability = {
  ok: boolean
  reason?: string
}

/**
 * Check that an email address is plausible for replies:
 * - valid format
 * - domain has MX records (or A as fallback)
 *
 * This cannot prove the mailbox exists (SMTP probe is unreliable and often blocked),
 * but it blocks fake domains and many throwaway patterns before we email the owner.
 */
export async function isEmailReachable(email: string): Promise<EmailReachability> {
  const trimmed = email.trim().toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, reason: 'invalid_format' }
  }

  if (trimmed.length > 200) {
    return { ok: false, reason: 'too_long' }
  }

  const domain = trimmed.split('@')[1]
  if (!domain || domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
    return { ok: false, reason: 'invalid_domain' }
  }

  // Block obvious fake TLDs / test domains
  if (
    domain.endsWith('.invalid') ||
    domain.endsWith('.localhost') ||
    domain === 'example.com' ||
    domain === 'test.com' ||
    domain === 'email.com'
  ) {
    return { ok: false, reason: 'blocked_domain' }
  }

  try {
    const mx = await resolveMx(domain)
    if (mx && mx.length > 0) {
      return { ok: true }
    }
  } catch {
    // fall through to A record
  }

  try {
    const a = await resolve4(domain)
    if (a && a.length > 0) {
      // Some small hosts only have A; accept cautiously
      return { ok: true }
    }
  } catch {
    // no MX and no A
  }

  return { ok: false, reason: 'no_mx' }
}
