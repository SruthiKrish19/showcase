import { useSyncExternalStore } from 'react'

/** Below Tailwind's `sm` breakpoint — the phone layout. */
export const MOBILE = '(max-width: 639px)'

/** Live result of a CSS media query; re-renders when it flips. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', onChange)
      return () => m.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
