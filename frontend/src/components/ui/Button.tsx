import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_10px_24px_-12px_rgba(18,134,74,0.9)] hover:bg-brand-700',
  secondary:
    'border border-line bg-white text-ink-900 hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm sm:text-[0.95rem]',
}

type StyleProps = {
  variant?: Variant
  size?: Size
  className?: string
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: StyleProps = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  )
}

type ButtonLinkProps = StyleProps & {
  to: string
  children: ReactNode
  'aria-label'?: string
  onClick?: () => void
}

export function ButtonLink({
  to,
  children,
  variant,
  size,
  className,
  'aria-label': ariaLabel,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      onClick={onClick}
      className={buttonStyles({ variant, size, className })}
    >
      {children}
    </Link>
  )
}
