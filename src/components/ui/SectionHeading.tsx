import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SplitText } from './SplitText'

type Props = {
  index: string
  title: string
  highlight?: string[]
  children?: ReactNode
  /** Drop the trailing margin — for headings in their own grid column. */
  tight?: boolean
}

export function SectionHeading({
  index,
  title,
  highlight,
  children,
  tight,
}: Props) {
  return (
    <div className={tight ? undefined : 'mb-10 md:mb-16'}>
      <Reveal>
        <div className="mb-5 flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.2em] text-faint">
            {index}
          </span>
          <div className="hairline flex-1" />
        </div>
      </Reveal>

      <h2 className="font-display text-[clamp(1.75rem,7vw,3.75rem)] leading-[1.05] tracking-tight">
        <SplitText text={title} highlight={highlight} />
      </h2>

      {children && (
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-xl text-balance-safe text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-base">
            {children}
          </p>
        </Reveal>
      )}
    </div>
  )
}
