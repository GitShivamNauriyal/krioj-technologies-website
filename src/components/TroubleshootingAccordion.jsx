import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const issues = [
  {
    question: 'No beep sound from the receiver tag',
    answer: 'Recharge the receiver tag using the provided USB Type-C cable with a standard 5V charger. Once charged, test again by moving closer to the transmitter to ensure you are within range.',
    icon: '🔇',
  },
  {
    question: 'Short range or weak signal',
    answer: 'Recharge the receiver tag fully. Remove any metal objects, thick walls, or large furniture between the transmitter and receiver. RF interference from other 433 MHz devices may also reduce range.',
    icon: '📡',
  },
  {
    question: 'Receiver tag not charging',
    answer: 'Check the USB Type-C cable for damage and try a different cable. Test with another 5V USB charger. Ensure the cable is properly inserted into the Type-C port on the receiver tag. Do NOT use fast chargers above 5V.',
    icon: '🔌',
  },
]

export default function TroubleshootingAccordion() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section id="troubleshooting" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Troubleshooting
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Common issues and how to resolve them.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {issues.map((issue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full px-6 py-5 flex items-center gap-4 cursor-pointer text-left"
              >
                <span className="text-2xl shrink-0">{issue.icon}</span>
                <span className="font-semibold text-text-primary flex-1">
                  {issue.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pl-16">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {issue.answer}
                      </p>
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
