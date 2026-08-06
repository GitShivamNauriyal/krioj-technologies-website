import { motion } from 'motion/react'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Long Range',
    desc: 'Up to 30–50 meters in open areas, 15–30 meters indoors depending on walls and obstacles.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
    title: 'Loud Buzzer',
    desc: 'High-intensity buzzer ensures you can hear the tag even from a distance.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
    title: 'Bright LED',
    desc: 'High-brightness LED flashes to provide visual guidance alongside the buzzer.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
        <line x1="23" y1="13" x2="23" y2="11" />
        <path d="M11 10l-3 3 3 3" />
        <line x1="8" y1="13" x2="16" y2="13" />
      </svg>
    ),
    title: 'Rechargeable',
    desc: 'Built-in Lithium Polymer battery with USB Type-C charging. No disposable batteries needed.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: 'Compact & Light',
    desc: 'Small enough to attach to keys, wallets, bags, or any everyday item.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'One-Button Use',
    desc: 'Simple operation — just press one button to find your item. No apps or pairing required.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Low Power',
    desc: 'Efficient 433 MHz RF technology consumes minimal power for extended battery life.',
  },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Why Choose TARANG
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Designed for simplicity, reliability, and accessibility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
