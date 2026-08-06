import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureGrid from './components/FeatureGrid'
import HowToUse from './components/HowToUse'
import InteractiveSimulator from './components/InteractiveSimulator'
import SpecsTable from './components/SpecsTable'
import TroubleshootingAccordion from './components/TroubleshootingAccordion'
import SafetyGuide from './components/SafetyGuide'
import Footer from './components/Footer'
import ManualPage from './pages/ManualPage'

function ShowcasePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowToUse />
      <InteractiveSimulator />
      <SpecsTable />
      <TroubleshootingAccordion />
      <SafetyGuide />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ShowcasePage />} />
      <Route path="/manual" element={<ManualPage />} />
    </Routes>
  )
}
