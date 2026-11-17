import type { ComponentType, SVGProps } from 'react'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import {
  BluetoothIcon,
  DatabaseIcon,
  MicIcon,
  NetworkIcon,
  QrCodeIcon,
  RefreshIcon,
} from '../ui/icons'

type Feature = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: QrCodeIcon,
    title: 'Offline QR payments',
    description:
      'Scan a merchant QR code and create a signed payment record without internet access.',
  },
  {
    icon: BluetoothIcon,
    title: 'Bluetooth exchange',
    description:
      'Pass records between nearby devices when a network is not available.',
  },
  {
    icon: NetworkIcon,
    title: 'Village Mesh Relay',
    description:
      'Let participating devices carry records toward a connected relay.',
  },
  {
    icon: DatabaseIcon,
    title: 'Local record storage',
    description:
      'Keep pending transactions on the device and track their sync state.',
  },
  {
    icon: RefreshIcon,
    title: 'Smart synchronization',
    description:
      'Send stored records to the backend for verification once online.',
  },
  {
    icon: MicIcon,
    title: 'Voice-ready design',
    description:
      'An interface planned for voice-assisted payments and future languages.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="section-space bg-surface">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Features"
          title="Everything needed to keep payments moving."
          description="A focused toolkit for creating, carrying and verifying payment records across unreliable connections."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
