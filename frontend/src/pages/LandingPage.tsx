import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { AboutSection } from '../components/sections/AboutSection'
import { FeaturesSection } from '../components/sections/FeaturesSection'
import { HeroSection } from '../components/sections/HeroSection'
import { HowItWorksSection } from '../components/sections/HowItWorksSection'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
