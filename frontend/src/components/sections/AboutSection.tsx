import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import {
  CheckIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  SignalOffIcon,
} from '../ui/icons'

const principles = [
  {
    icon: SignalOffIcon,
    title: 'Connectivity is optional',
    description: 'Create and exchange records without waiting for a network.',
  },
  {
    icon: DatabaseIcon,
    title: 'Store before you sync',
    description: 'Keep pending records locally until verification is possible.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verify on the server',
    description: 'Confirm records centrally once connectivity is restored.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="section-space bg-white">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="About GRAMPay"
            title={
              <>
                Built for the{' '}
                <span className="text-brand-600">last mile</span> of digital
                payments.
              </>
            }
            description="Millions of people live with unreliable internet access. GRAMPay explores how a payment record can still move between devices, then be checked securely when the network comes back."
          />

          <ul className="mt-8 space-y-4">
            {[
              'Designed for customers and small merchants.',
              'Uses QR codes and nearby device exchange.',
              'Keeps a clear record of pending synchronization.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="text-sm leading-relaxed text-ink-700 sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Card className="relative overflow-hidden bg-surface p-7 sm:p-9">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <span className="eyebrow">Design principles</span>
            <div className="mt-7 space-y-4">
              {principles.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-line bg-white/90 p-4"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900 sm:text-base">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Container>
    </section>
  )
}
