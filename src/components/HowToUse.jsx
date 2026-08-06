import { motion } from 'motion/react'

const steps = [
  {
    step: 1,
    title: 'Attach the Receiver Tag',
    desc: 'Clip or attach the receiver tag to your belongings — keys, wallet, bag, remote, or any valuable item.',
    visual: 'TAG',
  },
  {
    step: 2,
    title: 'Press the Button',
    desc: 'Press Button A on the transmitter to find Tag 1, or Button B to find Tag 2.',
    visual: 'A / B',
  },
  {
    step: 3,
    title: 'Follow the Sound',
    desc: 'The receiver tag will flash its LED and sound a loud buzzer. Follow the sound to locate your item.',
    visual: '🔊',
  },
  {
    step: 4,
    title: 'Release to Stop',
    desc: 'Once you\'ve found your item, release the button on the transmitter. The buzzer and LED will stop.',
    visual: '✓',
  },
]

export default function HowToUse() {
  return (
    <section id="how-to-use" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Quick Start
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            How to Use TARANG
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Four simple steps to never lose your belongings again.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6 mb-8 last:mb-0"
            >
              {/* Step number + line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {s.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-brand-200 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="glass-card rounded-2xl p-5 flex-1">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex w-14 h-14 rounded-xl bg-brand-50 items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-brand-500">
                      {s.visual}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                      {s.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
