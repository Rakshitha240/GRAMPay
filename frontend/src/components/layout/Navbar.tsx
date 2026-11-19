import { useState } from 'react'
import { Container } from '../ui/Container'
import { Button, ButtonLink } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { ArrowRightIcon, CloseIcon, MenuIcon } from '../ui/icons'
import { dashboardPathFor } from '../../lib/api'
import { useAuth } from '../../lib/auth'

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, token, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Logo to="/" />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-brand-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {token && user ? (
          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink to={dashboardPathFor(user.role)} variant="ghost" size="sm">
              Dashboard
            </ButtonLink>
            <Button variant="secondary" size="sm" onClick={() => void logout()}>
              Log out
            </Button>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink to="/login" variant="ghost" size="sm">
              Log in
            </ButtonLink>
            <ButtonLink to="/register" size="sm">
              Get started
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        )}

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-700 transition-colors hover:bg-brand-50 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-line bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {token && user ? (
                <>
                  <ButtonLink
                    to={dashboardPathFor(user.role)}
                    variant="secondary"
                    size="sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </ButtonLink>
                  <Button
                    size="sm"
                    onClick={() => {
                      setMenuOpen(false)
                      void logout()
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink to="/login" variant="secondary" size="sm">
                    Log in
                  </ButtonLink>
                  <ButtonLink
                    to="/register"
                    size="sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get started
                  </ButtonLink>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
