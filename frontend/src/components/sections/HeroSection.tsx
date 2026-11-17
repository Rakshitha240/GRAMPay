import { ButtonLink, buttonStyles } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import {
  ArrowRightIcon,
  CheckIcon,
  NetworkIcon,
  ShieldCheckIcon,
  SignalOffIcon,
  SparkIcon,
} from '../ui/icons'

const qrPattern = [
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
  1,
]

function HeroPreview() {
  return (
    <Card className="relative mx-auto w-full max-w-[380px] overflow-hidden rounded-[2rem] border-brand-100 p-5 sm:p-6">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

      <div className="relative flex items-center justify-between gap-3">
        <Logo />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[0.65rem] font-semibold text-amber-700">
          <SignalOffIcon className="h-3 w-3" />
          Offline mode
        </span>
      </div>

      <div className="relative mt-7 rounded-2xl bg-brand-600 p-5 text-white shadow-[0_18px_36px_-22px_rgba(18,134,74,0.95)]">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-100">
          Demo balance
        </p>
        <p className="mt-1 text-3xl font-bold">₹ 2,450</p>
        <p className="mt-1 text-xs text-brand-100">Illustrative only</p>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/90 px-4 py-3">
        <div>
          <p className="text-xs font-medium text-ink-500">Pending sync</p>
          <p className="mt-0.5 text-sm font-semibold text-ink-900">2 records</p>
        </div>
        <div
          className="grid grid-cols-5 gap-1"
          aria-hidden="true"
        >
          {qrPattern.map((filled, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-[2px] ${
                filled ? 'bg-brand-700' : 'bg-brand-100'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-xs font-medium text-brand-700">
        <ShieldCheckIcon className="h-4 w-4 shrink-0" />
        Records verified when you reconnect
      </div>
    </Card>
  )
}

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white"
    >
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        aria-hidden="true"
      />

      <Container className="relative grid gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        <div className="animate-fade-up">
          <span className="eyebrow">
            <SparkIcon className="h-3.5 w-3.5" />
            Offline-first payments
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Pay anywhere,
            <br />
            <span className="text-brand-600">
              even without a network.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
            GRAMPay lets customers and merchants exchange payment records when
            the internet is unreliable, then sync and verify them when a
            connection returns.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/register">
              Create your account
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <a
              href="#how-it-works"
              className={buttonStyles({ variant: 'secondary' })}
            >
              See how it works
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700">
            {['Works offline', 'Simple QR exchange', 'Prototype project'].map(
              (item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <HeroPreview />

          <div className="animate-float absolute -left-4 top-8 hidden rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-soft lg:block">
            <p className="text-xs font-semibold text-ink-900">
              No signal? No problem.
            </p>
            <p className="mt-0.5 text-[0.7rem] text-ink-500">
              Records are stored safely
            </p>
          </div>

          <div className="animate-float absolute -bottom-5 -right-2 hidden items-center gap-2 rounded-2xl border border-brand-100 bg-white/95 px-4 py-3 shadow-soft [animation-delay:1.4s] lg:inline-flex">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <NetworkIcon className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold text-ink-900">
              Village Mesh Relay
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
