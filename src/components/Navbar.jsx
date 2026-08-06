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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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

  const isGlassActive = scrolled || isManualRoute || mobileOpen

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          isGlassActive
            ? {
                backgroundColor: 'rgba(255, 255, 255, 0.70)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
              }
            : {
                backgroundColor: 'transparent',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
              }
        }
      >
        <div className="section-container flex items-center justify-between h-16 px-4 sm:px-6">
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
                  className="px-3 py-2 text-sm font-semibold text-text-secondary hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
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

          {/* Mobile menu toggle button */}
          {!isManualRoute && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 active:scale-95 flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Backdrop & Slide Menu */}
      <AnimatePresence>
        {mobileOpen && !isManualRoute && (
          <>
            {/* Dark blurred backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-md md:hidden"
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />

            {/* Slide Down Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-40 shadow-2xl md:hidden"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <div className="flex flex-col py-4 px-6 gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className="px-4 py-3 text-left text-base font-bold text-slate-800 hover:text-brand-600 hover:bg-brand-50/80 rounded-xl transition-all cursor-pointer flex items-center justify-between border-b border-slate-200/60 last:border-0"
                  >
                    <span>{link.label}</span>
                    <span className="text-slate-400 text-sm">→</span>
                  </button>
                ))}
                <Link
                  to="/manual"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 w-full py-3.5 text-center text-base font-bold text-white bg-brand-500 hover:bg-brand-600 active:scale-98 rounded-xl shadow-elevated flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔊</span>
                  <span>Accessible Voice Manual</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
