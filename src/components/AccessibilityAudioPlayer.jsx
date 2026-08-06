import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const languages = [
  {
    code: 'en',
    name: 'English',
    introAudio: '/audio/Eng_1st.mp3',
    manualAudio: '/audio/Eng_2nd.mp3',
    manualTitle: 'Tarang Smart RF Tag User Manual',
    manualText: `Welcome to Tarang Smart RF Tag.\n\nThank you for choosing Tarang.\n\nAttach the receiver to your belongings.\n\nPress the corresponding button on the transmitter.\n\nThe receiver will flash and beep loudly.\n\nFollow the sound until you locate your item.\n\nThank you for choosing Tarang.`,
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    introAudio: '/audio/Hindi_1st.mp3',
    manualAudio: '/audio/Hindi_2nd.mp3',
    manualTitle: 'तरंग स्मार्ट आर एफ टैग उपयोगकर्ता पुस्तिका',
    manualText: `तरंग स्मार्ट आर एफ टैग में आपका स्वागत है।\n\nरिसीवर को अपने सामान से जोड़ें।\n\nट्रांसमीटर का संबंधित बटन दबाएँ।\n\nरिसीवर आवाज करेगा और एलईडी चमकेगी।\n\nधन्यवाद।`,
  },
  {
    code: 'pa',
    name: 'ਪੰਜਾਬੀ',
    introAudio: '/audio/shubh_tts_audio.mp3',
    manualAudio: '/audio/shubh_manual_audio.mp3',
    manualTitle: 'ਤਰੰਗ ਸਮਾਰਟ ਆਰ ਐਫ ਟੈਗ ਯੂਜ਼ਰ ਮੈਨੂਅਲ',
    manualText: `ਤਰੰਗ ਸਮਾਰਟ ਆਰ ਐਫ ਟੈਗ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।\n\nਰਿਸੀਵਰ ਨੂੰ ਆਪਣੇ ਸਮਾਨ ਨਾਲ ਜੋੜੋ।\n\nਟ੍ਰਾਂਸਮੀਟਰ ਦਾ ਬਟਨ ਦਬਾਓ।\n\nਰਿਸੀਵਰ ਆਵਾਜ਼ ਕਰੇਗਾ।\n\nਧੰਨਵਾਦ।`,
  },
]

export default function AccessibilityAudioPlayer() {
  const [selectedLang, setSelectedLang] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mode, setMode] = useState('intro') // 'intro' | 'manual'
  const [showManual, setShowManual] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)
  const progressInterval = useRef(null)

  const lang = languages[selectedLang]

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setProgress(0)
    if (progressInterval.current) clearInterval(progressInterval.current)
  }

  const playAudio = (src) => {
    stopAudio()
    const audio = audioRef.current
    audio.src = src
    audio.load()
    audio.play().catch(() => {})
    setIsPlaying(true)

    progressInterval.current = setInterval(() => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }, 100)
  }

  useEffect(() => {
    const audio = audioRef.current
    const onEnd = () => {
      setIsPlaying(false)
      setProgress(100)
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
    audio?.addEventListener('ended', onEnd)
    return () => {
      audio?.removeEventListener('ended', onEnd)
      stopAudio()
    }
  }, [])

  const handleLanguageSelect = (index) => {
    stopAudio()
    setSelectedLang(index)
    setShowManual(false)
    setMode('intro')
  }

  const handlePlay = () => {
    const src = mode === 'intro' ? lang.introAudio : lang.manualAudio
    playAudio(src)
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleOpenManual = () => {
    setShowManual(true)
    setMode('manual')
    playAudio(lang.manualAudio)
  }

  const handleBack = () => {
    stopAudio()
    setShowManual(false)
    setMode('intro')
  }

  return (
    <section id="audio-player" className="py-20 bg-white">
      <audio ref={audioRef} preload="none" />

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Accessibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Listen to the Manual
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Audio narration in multiple languages for visually impaired users.
            Select your language and listen.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showManual ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto"
            >
              {/* Language cards */}
              <div className="flex gap-3 justify-center mb-8">
                {languages.map((l, i) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageSelect(i)}
                    className={`px-6 py-4 rounded-2xl font-semibold text-lg transition-all cursor-pointer ${
                      selectedLang === i
                        ? 'bg-brand-500 text-white shadow-elevated scale-105'
                        : 'glass-card text-text-secondary hover:scale-102'
                    }`}
                    aria-label={`Select ${l.name}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 justify-center mb-6">
                <button
                  onClick={() => { setMode('intro'); stopAudio() }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    mode === 'intro'
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Quick Intro
                </button>
                <button
                  onClick={() => { setMode('manual'); stopAudio() }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    mode === 'manual'
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  Full Manual
                </button>
              </div>

              {/* Player controls */}
              <div className="glass-card rounded-2xl p-6">
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-brand-100 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Waveform animation */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-1 h-8 mb-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16 + Math.random() * 16, 4] }}
                        transition={{
                          duration: 0.4 + Math.random() * 0.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.05,
                        }}
                        className="w-1 bg-brand-400 rounded-full"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-elevated hover:bg-brand-600 active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <rect x="4" y="3" width="4" height="14" rx="1" />
                        <rect x="12" y="3" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <polygon points="5,3 17,10 5,17" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => playAudio(mode === 'intro' ? lang.introAudio : lang.manualAudio)}
                    className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center hover:bg-brand-200 transition-all cursor-pointer"
                    aria-label="Replay"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>
                </div>

                <p className="text-center text-sm text-text-muted mt-4">
                  {mode === 'intro' ? 'Quick Introduction' : 'Full Manual'} — {lang.name}
                </p>

                {/* Open full manual */}
                <button
                  onClick={handleOpenManual}
                  className="mt-6 w-full py-3 rounded-xl border border-brand-200 text-brand-600 font-medium hover:bg-brand-50 transition-all cursor-pointer"
                >
                  Read Full Manual with Audio
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-6">
                  {lang.manualTitle}
                </h3>

                <div className="text-text-secondary leading-relaxed whitespace-pre-line text-base mb-8">
                  {lang.manualText}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-brand-100 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Waveform */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-1 h-8 mb-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12 + Math.random() * 12, 4] }}
                        transition={{
                          duration: 0.4 + Math.random() * 0.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.05,
                        }}
                        className="w-1 bg-brand-400 rounded-full"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={isPlaying ? handlePause : () => playAudio(lang.manualAudio)}
                    className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-elevated hover:bg-brand-600 active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <rect x="4" y="3" width="4" height="14" rx="1" />
                        <rect x="12" y="3" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <polygon points="5,3 17,10 5,17" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => playAudio(lang.manualAudio)}
                    className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center hover:bg-brand-200 transition-all cursor-pointer"
                    aria-label="Replay"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleBack}
                  className="mt-6 w-full py-3 rounded-xl border border-brand-200 text-text-secondary font-medium hover:bg-brand-50 transition-all cursor-pointer"
                >
                  Back to Language Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
