import { useState } from 'react'
import { motion } from 'motion/react'

export default function InteractiveSimulator() {
  const [activeTag, setActiveTag] = useState(null)

  const handlePress = (tag) => setActiveTag(tag)
  const handleRelease = () => setActiveTag(null)

  return (
    <section id="simulator" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Try It Out
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Press and hold the buttons on the transmitter to see how the receiver tags respond.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Tag 1 */}
            <div className="flex flex-col items-center order-2 md:order-1">
              <div className="relative">
                <motion.div
                  animate={activeTag === 1 ? {
                    boxShadow: [
                      '0 0 0 0 rgba(25, 118, 210, 0.4)',
                      '0 0 0 20px rgba(25, 118, 210, 0)',
                    ],
                  } : {}}
                  transition={activeTag === 1 ? { duration: 0.8, repeat: Infinity } : {}}
                  className="w-28 h-28 rounded-2xl glass-card flex flex-col items-center justify-center"
                >
                  {/* LED */}
                  <motion.div
                    animate={activeTag === 1 ? {
                      backgroundColor: ['#1976D2', '#64b5f6', '#1976D2'],
                      boxShadow: ['0 0 8px #1976D2', '0 0 20px #64b5f6', '0 0 8px #1976D2'],
                    } : { backgroundColor: '#e2e8f0', boxShadow: '0 0 0 transparent' }}
                    transition={activeTag === 1 ? { duration: 0.5, repeat: Infinity } : {}}
                    className="w-4 h-4 rounded-full mb-3"
                  />
                  <span className="text-xs font-semibold text-text-secondary">TAG 1</span>
                  <span className="text-[10px] text-text-muted mt-1">Receiver</span>
                </motion.div>

                {/* Pulse rings */}
                {activeTag === 1 && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute inset-0 rounded-2xl border-2 border-brand-400"
                      />
                    ))}
                  </>
                )}
              </div>

              {/* Buzzer indicator */}
              <motion.div
                animate={activeTag === 1 ? { opacity: [1, 0.5, 1], scale: [1, 1.1, 1] } : { opacity: 0.3 }}
                transition={activeTag === 1 ? { duration: 0.3, repeat: Infinity } : {}}
                className="mt-3 text-sm font-medium text-brand-500"
              >
                {activeTag === 1 ? 'BEEPING' : 'Idle'}
              </motion.div>
            </div>

            {/* Transmitter */}
            <div className="flex flex-col items-center order-1 md:order-2">
              <div className="glass-card rounded-3xl p-6 w-40">
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold text-text-muted tracking-wider">TRANSMITTER</span>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.button
                    onPointerDown={() => handlePress(1)}
                    onPointerUp={handleRelease}
                    onPointerLeave={handleRelease}
                    whileTap={{ scale: 0.92 }}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      activeTag === 1
                        ? 'bg-brand-500 text-white shadow-elevated'
                        : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                    }`}
                  >
                    BUTTON A
                  </motion.button>

                  <motion.button
                    onPointerDown={() => handlePress(2)}
                    onPointerUp={handleRelease}
                    onPointerLeave={handleRelease}
                    whileTap={{ scale: 0.92 }}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      activeTag === 2
                        ? 'bg-brand-500 text-white shadow-elevated'
                        : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                    }`}
                  >
                    BUTTON B
                  </motion.button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-[10px] text-text-muted">Press & Hold</span>
                </div>
              </div>
            </div>

            {/* Tag 2 */}
            <div className="flex flex-col items-center order-3">
              <div className="relative">
                <motion.div
                  animate={activeTag === 2 ? {
                    boxShadow: [
                      '0 0 0 0 rgba(25, 118, 210, 0.4)',
                      '0 0 0 20px rgba(25, 118, 210, 0)',
                    ],
                  } : {}}
                  transition={activeTag === 2 ? { duration: 0.8, repeat: Infinity } : {}}
                  className="w-28 h-28 rounded-2xl glass-card flex flex-col items-center justify-center"
                >
                  <motion.div
                    animate={activeTag === 2 ? {
                      backgroundColor: ['#1976D2', '#64b5f6', '#1976D2'],
                      boxShadow: ['0 0 8px #1976D2', '0 0 20px #64b5f6', '0 0 8px #1976D2'],
                    } : { backgroundColor: '#e2e8f0', boxShadow: '0 0 0 transparent' }}
                    transition={activeTag === 2 ? { duration: 0.5, repeat: Infinity } : {}}
                    className="w-4 h-4 rounded-full mb-3"
                  />
                  <span className="text-xs font-semibold text-text-secondary">TAG 2</span>
                  <span className="text-[10px] text-text-muted mt-1">Receiver</span>
                </motion.div>

                {activeTag === 2 && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute inset-0 rounded-2xl border-2 border-brand-400"
                      />
                    ))}
                  </>
                )}
              </div>

              <motion.div
                animate={activeTag === 2 ? { opacity: [1, 0.5, 1], scale: [1, 1.1, 1] } : { opacity: 0.3 }}
                transition={activeTag === 2 ? { duration: 0.3, repeat: Infinity } : {}}
                className="mt-3 text-sm font-medium text-brand-500"
              >
                {activeTag === 2 ? 'BEEPING' : 'Idle'}
              </motion.div>
            </div>
          </div>

          <p className="text-center text-sm text-text-muted mt-8">
            In real use, pressing the transmitter button activates the corresponding receiver tag with a loud buzzer and flashing LED.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
