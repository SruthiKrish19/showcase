import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../lib/cn'
import { EASE } from '../lib/motion'

const LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Pitches', href: '/#pitches' },
  { label: 'About', href: '/#about' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
    >
      <nav
        className={cn(
          'flex w-full max-w-3xl items-center justify-between rounded-full px-2 py-2 transition-all duration-500',
          scrolled ? 'glass' : 'border border-transparent',
        )}
      >
        <Link
          to="/"
          aria-label="Home"
          className="flex items-center gap-2.5 rounded-full px-3 py-2 transition-opacity hover:opacity-80"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet to-cyan shadow-[0_0_12px_2px_rgba(124,92,255,0.6)]" />
          <span className="h-2.5 w-2.5 rounded-full border border-white/25" />
        </Link>

        <ul className="flex items-center gap-1">
          {LINKS.map((link) => (
            <li key={link.href}>
              {onHome ? (
                <a
                  href={link.href.replace('/', '')}
                  className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink sm:px-4"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink sm:px-4"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  )
}
