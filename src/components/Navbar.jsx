import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'specs', label: 'Specs' },
  { id: 'troubleshooting', label: 'Help' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isManualRoute = location.pathname === '/manual'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id) => {
    setMobileOpen(false)
    if (isManualRoute) {
      navigate('/', { replace: false })
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isManualRoute ? 'glass shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
          >
            <img src="/logo-icon.svg" alt="Krioj Logo" className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-brand-600 leading-none">
                TARANG
              </span>
              <span className="text-[9px] font-semibold text-text-muted tracking-wider">
                BY KRIOJ
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          {!isManualRoute ? (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/manual"
                className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-elevated transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🔊</span>
                <span>Voice Manual</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>←</span>
                <span>Back to Showcase</span>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle (Showcase only) */}
          {!isManualRoute && (
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
          )}
        </div>
      </motion.nav>

      {/* Mobile drop-down menu */}
      <AnimatePresence>
        {mobileOpen && !isManualRoute && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass shadow-lg md:hidden"
          >
            <div className="flex flex-col py-3 px-4 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/manual"
                onClick={() => setMobileOpen(false)}
                className="mt-2 w-full py-3 text-center text-sm font-semibold text-white bg-brand-500 rounded-xl shadow-elevated"
              >
                🔊 Open Voice Manual
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
