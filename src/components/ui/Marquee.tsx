type Props = {
  items: string[]
  /** Seconds for one full loop. */
  speed?: number
}

/** Infinite horizontal ticker. Duplicated once so the loop is seamless. */
export function Marquee({ items, speed = 40 }: Props) {
  const row = [...items, ...items]

  return (
    <div
      className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      aria-hidden
    >
      <div
        className="flex w-max gap-3 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
