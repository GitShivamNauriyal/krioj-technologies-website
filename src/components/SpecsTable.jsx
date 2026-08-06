import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const specCategories = [
  {
    title: 'RF Communication',
    specs: [
      { label: 'Operating Frequency', value: '433 MHz' },
      { label: 'Indoor Range', value: '15–30 meters (walls/obstacles dependent)' },
      { label: 'Open Area Range', value: '30–50 meters' },
      { label: 'Range Impact Factors', value: 'Walls, Metal objects, Furniture, RF interference' },
    ],
  },
  {
    title: 'Transmitter (Remote)',
    specs: [
      { label: 'Type', value: 'Handheld RF Transmitter' },
      { label: 'Button A', value: 'Activates Receiver Tag 1' },
      { label: 'Button B', value: 'Activates Receiver Tag 2' },
      { label: 'Battery', value: 'Replaceable battery (model may vary)' },
    ],
  },
  {
    title: 'Receiver Tags',
    specs: [
      { label: 'Battery', value: 'Rechargeable Lithium Polymer' },
      { label: 'Charging', value: 'USB Type-C, 5V standard charger' },
      { label: 'Alert Mechanisms', value: 'High-intensity buzzer + High-brightness LED' },
      { label: 'Charging LED (Red)', value: 'ON during charging' },
      { label: 'Charged LED (Blue)', value: 'ON when fully charged' },
    ],
  },
  {
    title: 'Package Contents',
    specs: [
      { label: 'Transmitter', value: '1 × RF Remote' },
      { label: 'Receiver Tags', value: '2 × RF Receiver Tags' },
      { label: 'Cable', value: 'USB Type-C Charging Cable' },
      { label: 'Documentation', value: 'User Manual' },
    ],
  },
]

export default function SpecsTable() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="specs" className="py-20 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Technical
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Specifications
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {specCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: catIdx * 0.08 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === catIdx ? -1 : catIdx)}
                className="w-full px-6 py-4 flex items-center justify-between cursor-pointer text-left"
              >
                <span className="font-semibold text-text-primary">{cat.title}</span>
                <motion.svg
                  animate={{ rotate: openIndex === catIdx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === catIdx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      {cat.specs.map((spec, specIdx) => (
                        <div
                          key={spec.label}
                          className={`flex justify-between py-3 text-sm ${
                            specIdx < cat.specs.length - 1 ? 'border-b border-slate-100' : ''
                          }`}
                        >
                          <span className="text-text-secondary font-medium">{spec.label}</span>
                          <span className="text-text-primary text-right max-w-[55%]">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
