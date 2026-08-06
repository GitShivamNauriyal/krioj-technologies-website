import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-50 rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-6">
                <img src="/logo-icon.svg" alt="Logo" className="w-4 h-4" />
                Krioj Technologies
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400 bg-clip-text text-transparent">
                Find Everything.
              </span>
              <br />
              <span className="text-text-primary">Lose Nothing.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-text-secondary max-w-lg mx-auto lg:mx-0"
            >
              TARANG RF Tags use 433 MHz wireless technology to help you
              instantly locate your belongings — keys, wallet, remote, and more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/manual"
                className="px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-xl shadow-elevated hover:bg-brand-600 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔊</span>
                <span>Accessible Voice Manual</span>
              </Link>
              <button
                onClick={() => handleScroll('features')}
                className="px-8 py-3.5 bg-white text-brand-600 font-semibold rounded-xl border border-brand-200 hover:bg-brand-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                View Features
              </button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {[
                { value: '433', unit: 'MHz', label: 'RF Frequency' },
                { value: '50', unit: 'm', label: 'Max Range' },
                { value: 'USB-C', unit: '', label: 'Charging' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-brand-500">
                    {stat.value}
                    <span className="text-base font-medium text-brand-400">
                      {stat.unit}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative glass-card rounded-3xl p-4 max-w-md shadow-2xl">
              <img
                src="/images/hero-product.png"
                alt="TARANG RF Tag Set"
                className="w-full h-auto rounded-2xl object-cover"
              />
              <div className="mt-3 text-center">
                <span className="text-xs font-semibold text-text-secondary">
                  TARANG™ RF Tags Package Set
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
