import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SplitText } from './SplitText'

type Props = {
  index: string
  title: string
  highlight?: string[]
  children?: ReactNode
}

export function SectionHeading({ index, title, highlight, children }: Props) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal>
        <div className="mb-5 flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.2em] text-faint">
            {index}
          </span>
          <div className="hairline flex-1" />
        </div>
      </Reveal>

      <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        <SplitText text={title} highlight={highlight} />
      </h2>

      {children && (
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-balance-safe text-base leading-relaxed text-muted">
            {children}
          </p>
        </Reveal>
      )}
    </div>
  )
}
