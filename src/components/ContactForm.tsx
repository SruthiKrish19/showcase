import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { CONTACT_ACCESS_KEY, CONTACT_EMAIL, CONTACT_ENDPOINT } from '../content/contact'
import type { Accent } from '../content/types'
import { accent } from '../lib/accent'
import { cn } from '../lib/cn'

export type Interest = { key: string; note: string }

type Props = {
  accent: Accent
  /** Opens the email subject, e.g. "Ciniops enquiry". */
  subject: string
  /** The "choose any" cards; at least one has to be picked. */
  interests: readonly Interest[]
  interestsLabel: string
  /** A required pick-list of roles. Without it, role is an optional text box. */
  roles?: readonly string[]
  companyLabel: string
  notesLabel: string
  notesPlaceholder: string
  /** Sent with the enquiry after the visitor's own answers. */
  extra?: Record<string, string>
  /** Shown under the thank-you, e.g. a way back. */
  done?: ReactNode
}

/**
 * `slow`: still waiting after a few seconds. `unsure`: the service was
 * reached but timed out or broke before answering — the relay may still
 * have delivered, so we don't call it a failure.
 */
type Status = 'idle' | 'sending' | 'slow' | 'sent' | 'unsure' | 'error'

/** Give up waiting after this long. */
const TIMEOUT_MS = 30_000

/**
 * Who they are, what they're after — any mix of the interest cards — and a
 * note. Sent through Web3Forms to the inbox set up in content/contact.ts.
 */
export function ContactForm({
  accent: accentKey,
  subject,
  interests: options,
  interestsLabel,
  roles,
  companyLabel,
  notesLabel,
  notesPlaceholder,
  extra,
  done,
}: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [role, setRole] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [interestError, setInterestError] = useState(false)
  const [sentTo, setSentTo] = useState({ name: '', email: '' })
  const a = accent(accentKey)

  const toggle = (key: string) => {
    setInterestError(false)
    setInterests((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!interests.length) {
      setInterestError(true)
      return
    }
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const name = get('name')
    const finalRole = roles ? (role === 'Other' ? get('roleOther') || 'Other' : role) : get('role') || '—'
    setStatus('sending')
    const slow = setTimeout(() => setStatus((s) => (s === 'sending' ? 'slow' : s)), 5000)
    const abort = new AbortController()
    const give = setTimeout(() => abort.abort(), TIMEOUT_MS)
    try {
      // Plain form data with no custom headers: no CORS preflight round trip.
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        signal: abort.signal,
        body: toFormData({
          access_key: CONTACT_ACCESS_KEY,
          name,
          email: get('email'),
          phone: get('phone') || '—',
          role: finalRole,
          company: get('company') || '—',
          involvement: interests.join(', '),
          notes: get('notes') || '—',
          ...extra,
          subject: `${subject} · ${name} · ${interests.join(' + ')}`,
          // Honeypot: a hidden box people never tick; Web3Forms rejects it if bots do
          ...(f.get('botcheck') ? { botcheck: 'on' } : {}),
        }),
      })
      const data = (await res.json().catch(() => null)) as { success?: string | boolean } | null
      if (data && String(data.success) === 'true') {
        setSentTo({ name: name.split(' ')[0], email: get('email') })
        setStatus('sent')
      } else if (data) {
        setStatus('error') // the relay answered and said no
      } else {
        setStatus('unsure') // gateway timeout or an unreadable reply: it may still arrive
      }
    } catch {
      // Timed out or the connection dropped after sending — not a clear failure
      setStatus(navigator.onLine ? 'unsure' : 'error')
    } finally {
      clearTimeout(slow)
      clearTimeout(give)
    }
  }

  return (
    <div className="panel rounded-3xl p-5 sm:p-8">
      {status === 'sent' ? (
        <div className="py-6 text-center sm:py-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#22c55e]">
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Thank you{sentTo.name ? `, ${sentTo.name}` : ''}.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            Your note is with us. We'll reply to <span className="text-ink">{sentTo.email}</span> soon.
          </p>
          {done}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Honeypot: hidden from people, ticked by bots, rejected by Web3Forms */}
          <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" aria-hidden />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required>
              <input name="name" required autoComplete="name" className={INPUT} placeholder="Your name" />
            </Field>
            <Field label="Email" required>
              <input name="email" type="email" required autoComplete="email" className={INPUT} placeholder="you@company.com" />
            </Field>
            <Field label="Phone or WhatsApp">
              <input name="phone" type="tel" autoComplete="tel" className={INPUT} placeholder="+91" />
            </Field>
            {roles ? (
              <Field label="Your role" required>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={cn(INPUT, 'appearance-none [color-scheme:dark]', !role && 'text-faint')}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-elevated text-ink">
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field label="Your role">
                <input name="role" autoComplete="organization-title" className={INPUT} placeholder="e.g. Founder, Producer" />
              </Field>
            )}
          </div>

          {roles && role === 'Other' && (
            <Field label="Tell us your role" required>
              <input name="roleOther" required className={INPUT} placeholder="e.g. Casting director" />
            </Field>
          )}

          <Field label={companyLabel}>
            <input name="company" autoComplete="organization" className={INPUT} placeholder="Optional" />
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">
              {interestsLabel} <span className="text-faint">Choose any</span>
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {options.map(({ key, note }) => {
                const on = interests.includes(key)
                return (
                  <label
                    key={key}
                    className={cn(
                      'relative flex cursor-pointer flex-col rounded-2xl border p-3.5 transition-colors',
                      on ? a.border : 'border-white/10 hover:border-white/25',
                    )}
                    style={on ? { backgroundColor: `${a.hex}14` } : undefined}
                  >
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(key)} />
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-ink">
                      {key}
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                          on ? 'border-transparent text-bg' : 'border-white/25',
                        )}
                        style={on ? { backgroundColor: a.hex } : undefined}
                      >
                        {on && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="mt-1 text-xs leading-snug text-muted">{note}</span>
                  </label>
                )
              })}
            </div>
            {interestError && <p className="mt-2 text-xs text-rose">Pick at least one so we know how to help.</p>}
          </fieldset>

          <Field label={notesLabel}>
            <textarea
              name="notes"
              rows={4}
              className={cn(INPUT, 'resize-y leading-relaxed')}
              placeholder={notesPlaceholder}
            />
          </Field>

          {status === 'unsure' && (
            <p className="rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-ink">
              This is taking longer than usual. Your message has most likely reached us — if you don't hear back,
              write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          )}

          {status === 'error' && (
            <p className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-ink">
              We couldn't send that just now. Please try again, or email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className={cn('text-xs', status === 'slow' ? 'text-ink' : 'text-faint')} aria-live="polite">
              {status === 'slow'
                ? 'Still sending — please keep this page open.'
                : "We'll only use your details to reply to you."}
            </p>
            <button
              type="submit"
              disabled={status === 'sending' || status === 'slow'}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-bg transition-colors hover:bg-white disabled:opacity-60"
            >
              {status === 'sending' || status === 'slow' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending
                </>
              ) : (
                <>
                  Send <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <p className="border-t border-white/8 pt-5 text-center text-sm text-muted">
            Or write to us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={cn('font-medium underline-offset-4 hover:underline', a.text)}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </form>
      )}
    </div>
  )
}

const INPUT =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-ink placeholder:text-faint outline-none transition-colors focus:border-white/30 focus:bg-white/[0.05]'

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-rose">*</span>}
      </span>
      {children}
    </label>
  )
}

const toFormData = (fields: Record<string, string>) => {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  return fd
}
