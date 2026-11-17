import { useId } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type LogoProps = {
  className?: string
  showWordmark?: boolean
  to?: string
}

export function Logo({
  className,
  showWordmark = true,
  to,
}: LogoProps) {
  const gradientId = useId().replace(/:/g, '')

  const content = (
    <>
      <svg
        className="h-9 w-9 shrink-0"
        viewBox="0 0 48 48"
        role="img"
        aria-label="GRAMPay logo"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="6"
            y1="4"
            x2="42"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#22c55e" />
            <stop offset="1" stopColor="#0f6b3a" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
        <circle cx="36" cy="12" r="3.2" fill="#bbf7d0" />
        <text
          x="23"
          y="32"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="23"
          fontWeight="800"
          fill="#ffffff"
        >
          G
        </text>
      </svg>

      {showWordmark && (
        <span className="text-[1.15rem] font-extrabold tracking-tight">
          GRAM<span className="text-brand-600">Pay</span>
        </span>
      )}
    </>
  )

  const classes = cn('inline-flex items-center gap-2.5', className)

  if (to) {
    return (
      <Link to={to} aria-label="GRAMPay home" className={classes}>
        {content}
      </Link>
    )
  }

  return <span className={classes}>{content}</span>
}
