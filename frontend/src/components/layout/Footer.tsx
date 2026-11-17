import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

const productLinks = [
  { label: 'About GRAMPay', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
]

const accountLinks = [
  { label: 'Log in', to: '/login' },
  { label: 'Create account', to: '/register' },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo to="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              An offline-first payment prototype designed to make digital
              financial services usable where connectivity is unreliable.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Account</h3>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-500 transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GRAMPay. Prototype project.</p>
          <p>No live payments or bank transfers are processed.</p>
        </div>
      </Container>
    </footer>
  )
}
