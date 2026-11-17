import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { ShieldCheckIcon } from '../ui/icons'

const steps = [
  {
    title: 'Merchant shows a QR',
    description: 'The customer scans the merchant code, even with no signal.',
  },
  {
    title: 'Amount is confirmed',
    description: 'A unique payment record is created and stored on the device.',
  },
  {
    title: 'Record is exchanged',
    description: 'Bluetooth, QR receipts or relay devices carry the record.',
  },
  {
    title: 'Sync and verify',
    description: 'The backend checks and updates the record when online.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-space bg-white">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Four simple steps, online or off."
          description="The experience stays familiar. The difference is what happens when the connection drops."
        />

        <div className="relative mt-14 grid gap-9 md:grid-cols-4 md:gap-6">
          <div
            className="absolute left-6 right-6 top-5 hidden h-px bg-line md:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-base font-bold text-white shadow-[0_12px_24px_-14px_rgba(18,134,74,0.95)]">
                {index + 1}
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl items-start gap-3 rounded-3xl border border-brand-100 bg-brand-50 p-5 text-sm leading-relaxed text-ink-700">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <p>
            An offline record is not an immediate bank transfer. It stays
            pending until it is verified and settled. GRAMPay is a prototype,
            not a live payment service.
          </p>
        </div>
      </Container>
    </section>
  )
}
