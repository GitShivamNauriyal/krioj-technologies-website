import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureGrid from './components/FeatureGrid'
import HowToUse from './components/HowToUse'
import InteractiveSimulator from './components/InteractiveSimulator'
import AccessibilityAudioPlayer from './components/AccessibilityAudioPlayer'
import SpecsTable from './components/SpecsTable'
import TroubleshootingAccordion from './components/TroubleshootingAccordion'
import SafetyGuide from './components/SafetyGuide'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowToUse />
      <InteractiveSimulator />
      <AccessibilityAudioPlayer />
      <SpecsTable />
      <TroubleshootingAccordion />
      <SafetyGuide />
      <Footer />
    </div>
  )
}
