import type { ComponentType } from 'react'
import { SitesDemo } from './SitesDemo'
import { ArMenuDemo } from './ArMenuDemo'
import { LmsDemo } from './LmsDemo'
import { FormFillDemo } from './FormFillDemo'
import { EcommerceDemo } from './EcommerceDemo'

export type DemoKey = 'sites' | 'ar-menu' | 'lms' | 'form-fill' | 'ecommerce'

const REGISTRY: Record<DemoKey, ComponentType> = {
  sites: SitesDemo,
  'ar-menu': ArMenuDemo,
  lms: LmsDemo,
  'form-fill': FormFillDemo,
  ecommerce: EcommerceDemo,
}

/** Phone-shaped demos need a narrower stage than the browser ones. */
export const isPhoneDemo = (key: DemoKey) => key === 'ar-menu'

export function Demo({ demo }: { demo: DemoKey }) {
  const Component = REGISTRY[demo]
  return <Component />
}
