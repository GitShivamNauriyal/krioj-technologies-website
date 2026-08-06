import { motion } from 'motion/react'

const doItems = [
  { icon: '✅', text: 'Use only a standard 5V USB charger' },
  { icon: '✅', text: 'Store between 0°C to 45°C away from moisture' },
  { icon: '✅', text: 'Clean with a soft dry cloth only' },
  { icon: '✅', text: 'Recharge as required and switch off when idle' },
  { icon: '✅', text: 'Keep in a dry, cool environment' },
]

const dontItems = [
  { icon: '❌', text: 'Do NOT use fast chargers above 5V' },
  { icon: '❌', text: 'Do NOT immerse in water' },
  { icon: '❌', text: 'Do NOT expose to temperatures above 60°C' },
  { icon: '❌', text: 'Do NOT disassemble the device' },
  { icon: '❌', text: 'Do NOT use alcohol, petrol, thinner, or chemical cleaners' },
  { icon: '❌', text: 'Keep away from fire' },
  { icon: '❌', text: 'Keep away from children under 3 years' },
]

export default function SafetyGuide() {
  return (
    <section id="safety" className="py-20 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Safety
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Safety &amp; Care Guide
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Do's */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border-2 border-green-200 bg-green-50/50 p-6"
          >
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">
                ✓
              </span>
              Do&apos;s
            </h3>
            <ul className="space-y-3">
              {doItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-start gap-3 text-sm text-green-800"
                >
                  <span className="shrink-0 mt-0.5">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Don'ts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-6"
          >
            <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">
                ✗
              </span>
              Don&apos;ts
            </h3>
            <ul className="space-y-3">
              {dontItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-start gap-3 text-sm text-red-800"
                >
                  <span className="shrink-0 mt-0.5">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Critical warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-8 rounded-2xl border-2 border-amber-300 bg-amber-50/50 p-5"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div>
              <h4 className="font-bold text-amber-800 mb-1">Critical Charging Warning</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                Use only a standard 5V USB charger. Do NOT use fast chargers or chargers above 5V. Using incompatible chargers may damage the battery and void your warranty.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
