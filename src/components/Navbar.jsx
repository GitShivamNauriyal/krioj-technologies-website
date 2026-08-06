import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'specs', label: 'Specs' },
  { id: 'troubleshooting', label: 'Help' },
  { id: 'audio-player', label: 'Manual' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Desktop top navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-between h-16">
          <button
            onClick={() => handleNav('hero')}
            className="text-xl font-bold tracking-widest text-brand-500 cursor-pointer"
          >
            TARANG
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-text-primary block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-text-primary block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-text-primary block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile slide menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass shadow-lg md:hidden"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="px-6 py-3 text-left text-sm font-medium text-text-secondary hover:text-brand-500 hover:bg-brand-50 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
