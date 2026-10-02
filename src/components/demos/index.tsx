import { useRef, type ComponentType } from 'react'
import { useInView } from 'framer-motion'
import { SitesDemo } from './SitesDemo'
import { ArMenuDemo } from './ArMenuDemo'
import { LmsDemo } from './LmsDemo'
import { FormFillDemo } from './FormFillDemo'
import { EcommerceDemo } from './EcommerceDemo'
import { Menu3DDemo } from './Menu3DDemo'

export type DemoKey =
  | 'sites'
  | 'ar-menu'
  | 'menu-3d'
  | 'lms'
  | 'form-fill'
  | 'ecommerce'

const REGISTRY: Record<DemoKey, ComponentType> = {
  sites: SitesDemo,
  'ar-menu': ArMenuDemo,
  'menu-3d': Menu3DDemo,
  lms: LmsDemo,
  'form-fill': FormFillDemo,
  ecommerce: EcommerceDemo,
}

/** Phone-shaped demos need a narrower stage than the browser ones. */
export const isPhoneDemo = (key: DemoKey) =>
  key === 'ar-menu' || key === 'menu-3d'

/**
 * Mounts a demo once it is near the viewport, so a page with several of them
 * (the mobile work list) does not spin up every timer and WebGL context at
 * load. Aspect ratio is reserved so nothing shifts when it appears.
 */
export function Demo({ demo }: { demo: DemoKey }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '300px 0px' })
  const Component = REGISTRY[demo]
  const phone = isPhoneDemo(demo)

  return (
    <div ref={ref} style={{ aspectRatio: phone ? '312 / 632' : '760 / 560' }}>
      {inView ? <Component /> : null}
    </div>
  )
}
