import { useState } from 'react'
import { motion } from 'motion/react'

export default function InteractiveSimulator() {
  const [activeTag, setActiveTag] = useState(null)

  const handlePress = (tag) => setActiveTag(tag)
  const handleRelease = () => setActiveTag(null)

  return (
    <section id="simulator" className="py-20 bg-slate-50 select-none">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 select-none"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Try the Remote Simulator
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Press and hold Button A or Button B to simulate activating Tag 1 or Tag 2.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto select-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Tag 1 */}
            <div className="flex flex-col items-center order-2 md:order-1 select-none">
              <div className="relative">
                <motion.div
                  animate={activeTag === 1 ? {
                    boxShadow: [
                      '0 0 0 0 rgba(25, 118, 210, 0.4)',
                      '0 0 0 24px rgba(25, 118, 210, 0)',
                    ],
                  } : {}}
                  transition={activeTag === 1 ? { duration: 0.8, repeat: Infinity } : {}}
                  className="w-36 h-36 rounded-3xl glass-card p-2 flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <img src="/images/receiver-tag.png" alt="Receiver Tag 1" className="w-20 h-20 object-contain mb-1 pointer-events-none select-none" />

                  {/* LED overlay */}
                  <motion.div
                    animate={activeTag === 1 ? {
                      backgroundColor: ['#1976D2', '#64b5f6', '#1976D2'],
                      boxShadow: ['0 0 10px #1976D2', '0 0 24px #64b5f6', '0 0 10px #1976D2'],
                    } : { backgroundColor: '#cbd5e1' }}
                    transition={activeTag === 1 ? { duration: 0.4, repeat: Infinity } : {}}
                    className="w-3.5 h-3.5 rounded-full absolute top-3 right-3"
                  />
                  <span className="text-xs font-bold text-text-primary select-none">TAG 1 (Keys)</span>
                </motion.div>

                {activeTag === 1 && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute inset-0 rounded-3xl border-2 border-brand-400 pointer-events-none"
                      />
                    ))}
                  </>
                )}
              </div>

              <motion.div
                animate={activeTag === 1 ? { opacity: [1, 0.5, 1], scale: [1, 1.05, 1] } : { opacity: 0.4 }}
                transition={activeTag === 1 ? { duration: 0.3, repeat: Infinity } : {}}
                className="mt-4 text-sm font-bold text-brand-600 bg-brand-50 px-4 py-1 rounded-full border border-brand-200 select-none"
              >
                {activeTag === 1 ? '🔊 BEEPING & FLASHING' : 'Idle'}
              </motion.div>
            </div>

            {/* Transmitter Controls */}
            <div className="flex flex-col items-center order-1 md:order-2 select-none">
              <div className="glass-card rounded-3xl p-6 w-52 text-center shadow-xl select-none">
                <img src="/images/transmitter.png" alt="RF Transmitter Remote" className="w-24 h-24 object-contain mx-auto mb-3 pointer-events-none select-none" />
                <span className="text-xs font-bold text-text-muted tracking-wider uppercase block mb-4 select-none">
                  RF Remote
                </span>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onPointerDown={() => handlePress(1)}
                    onPointerUp={handleRelease}
                    onPointerLeave={handleRelease}
                    onContextMenu={(e) => e.preventDefault()}
                    whileTap={{ scale: 0.94 }}
                    className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all cursor-pointer select-none ${
                      activeTag === 1
                        ? 'bg-brand-500 text-white shadow-elevated scale-102'
                        : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                    }`}
                  >
                    PRESS BUTTON A
                  </motion.button>

                  <motion.button
                    onPointerDown={() => handlePress(2)}
                    onPointerUp={handleRelease}
                    onPointerLeave={handleRelease}
                    onContextMenu={(e) => e.preventDefault()}
                    whileTap={{ scale: 0.94 }}
                    className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all cursor-pointer select-none ${
                      activeTag === 2
                        ? 'bg-brand-500 text-white shadow-elevated scale-102'
                        : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                    }`}
                  >
                    PRESS BUTTON B
                  </motion.button>
                </div>

                <div className="text-center mt-3">
                  <span className="text-[10px] text-text-muted select-none">Press &amp; Hold to locate</span>
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
                      '0 0 0 24px rgba(25, 118, 210, 0)',
                    ],
                  } : {}}
                  transition={activeTag === 2 ? { duration: 0.8, repeat: Infinity } : {}}
                  className="w-36 h-36 rounded-3xl glass-card p-2 flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <img src="/images/receiver-tag.png" alt="Receiver Tag 2" className="w-20 h-20 object-contain mb-1" />

                  <motion.div
                    animate={activeTag === 2 ? {
                      backgroundColor: ['#1976D2', '#64b5f6', '#1976D2'],
                      boxShadow: ['0 0 10px #1976D2', '0 0 24px #64b5f6', '0 0 10px #1976D2'],
                    } : { backgroundColor: '#cbd5e1' }}
                    transition={activeTag === 2 ? { duration: 0.4, repeat: Infinity } : {}}
                    className="w-3.5 h-3.5 rounded-full absolute top-3 right-3"
                  />
                  <span className="text-xs font-bold text-text-primary">TAG 2 (Wallet)</span>
                </motion.div>

                {activeTag === 2 && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute inset-0 rounded-3xl border-2 border-brand-400 pointer-events-none"
                      />
                    ))}
                  </>
                )}
              </div>

              <motion.div
                animate={activeTag === 2 ? { opacity: [1, 0.5, 1], scale: [1, 1.05, 1] } : { opacity: 0.4 }}
                transition={activeTag === 2 ? { duration: 0.3, repeat: Infinity } : {}}
                className="mt-4 text-sm font-bold text-brand-600 bg-brand-50 px-4 py-1 rounded-full border border-brand-200"
              >
                {activeTag === 2 ? '🔊 BEEPING & FLASHING' : 'Idle'}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
