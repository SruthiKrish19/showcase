import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Aurora } from './ambient/Aurora'
import { Grain } from './ambient/Grain'
import { Spotlight } from './ambient/Spotlight'
import { ScrollProgress } from './ambient/ScrollProgress'
import { Nav } from './Nav'
import { Footer } from './Footer'

/** Resets scroll on route change, but honours in-page #anchors. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

export function RootLayout() {
  // The pitch deck and demo are full-screen and carry their own way back,
  // so the site menu, footer and scroll bar would only sit on top of them.
  const { pathname } = useLocation()
  const immersive = pathname.startsWith('/pitch/')

  return (
    <>
      <Aurora />
      <Spotlight />
      <Grain />
      {!immersive && <ScrollProgress />}
      <ScrollManager />
      {!immersive && <Nav />}
      <main className="relative">
        <Outlet />
      </main>
      {!immersive && <Footer />}
    </>
  )
}
