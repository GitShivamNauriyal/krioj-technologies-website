import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'

const pagesData = [
  {
    id: 'welcome',
    title: 'TARANG',
    subtitle: 'Smart RF Tag',
    instruction: 'Swipe Left or Right / Press Left or Right Arrow Keys\n\nto choose your language',
    audio: '/audio/shubh_Welcome.mp3',
    langName: 'Welcome',
  },
  {
    id: 'en',
    title: 'English',
    instruction: 'Double Click or Double Tap Anywhere\n\nto listen to full manual',
    introAudio: '/audio/Eng_1st.mp3',
    manualAudio: '/audio/Eng_2nd.mp3',
    manualTitle: 'Tarang Smart RF Tag User Manual',
    manualText: `Welcome to Tarang Smart RF Tag.

Thank you for choosing Tarang.

Attach the receiver to your belongings.

Press the corresponding button on the transmitter.

The receiver will flash and beep loudly.

Follow the sound until you locate your item.

Thank you for choosing Tarang.

Double tap or press Escape to go back.`,
  },
  {
    id: 'hi',
    title: 'हिन्दी',
    instruction: 'स्क्रीन पर दो बार क्लिक या टैप करें\n\nउपयोगकर्ता पुस्तिका सुनने के लिए',
    introAudio: '/audio/Hindi_1st.mp3',
    manualAudio: '/audio/Hindi_2nd.mp3',
    manualTitle: 'तरंग स्मार्ट आर एफ टैग उपयोगकर्ता पुस्तिका',
    manualText: `तरंग स्मार्ट आर एफ टैग में आपका स्वागत है।

रिसीवर को अपने सामान से जोड़ें।

ट्रांसमीटर का संबंधित बटन दबाएँ।

रिसीवर आवाज करेगा और एलईडी चमकेगी।

आवाज का पीछा करें जब तक सामान न मिल जाए।

धन्यवाद।

पीछे जाने के लिए दो बार टैप करें या Escape दबाएँ।`,
  },
  {
    id: 'pa',
    title: 'ਪੰਜਾਬੀ',
    instruction: 'ਸਕ੍ਰੀਨ \'ਤੇ ਦੋ ਵਾਰ ਕਲਿੱਕ ਜਾਂ ਟੈਪ ਕਰੋ\n\nਯੂਜ਼ਰ ਮੈਨੂਅਲ ਸੁਣਨ ਲਈ',
    introAudio: '/audio/shubh_tts_audio.mp3',
    manualAudio: '/audio/shubh_manual_audio.mp3',
    manualTitle: 'ਤਰੰਗ ਸਮਾਰਟ ਆਰ ਐਫ ਟੈਗ ਯੂਜ਼ਰ ਮੈਨੂਅਲ',
    manualText: `ਤਰੰਗ ਸਮਾਰਟ ਆਰ ਐਫ ਟੈਗ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।

ਰਿਸੀਵਰ ਨੂੰ ਆਪਣੇ ਸਮਾਨ ਨਾਲ ਜੋੜੋ।

ਟ੍ਰਾਂਸਮੀਟਰ ਦਾ ਬਟਨ ਦਬਾਓ।

ਰਿਸੀਵਰ ਆਵਾਜ਼ ਕਰੇਗਾ।

ਧੰਨਵਾਦ।

ਵਾਪਸ ਜਾਣ ਲਈ ਸਕ੍ਰੀਨ 'ਤੇ ਦੋ ਵਾਰ ਟੈਪ ਕਰੋ।`,
  },
]

export default function ManualPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isManualOpen, setIsManualOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)

  const audioRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const lastTapTime = useRef(0)
  const lastDoubleActionTimeRef = useRef(0)

  // Stop audio helper
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setAudioProgress(0)
  }, [])

  // Play audio helper - with robust promise error handling for mobile Safari/Chrome
  const playAudio = useCallback((src) => {
    stopAudio()
    if (!audioRef.current) return
    audioRef.current.src = src
    audioRef.current.load()
    const playPromise = audioRef.current.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log('Autoplay restriction or audio play error:', err)
          setIsPlaying(false)
        })
    }
  }, [stopAudio])

  // Play current slide audio (or manual audio if manual is open)
  const speakCurrentSlide = useCallback(() => {
    if (isManualOpen) {
      const page = pagesData[currentPage]
      if (page && page.manualAudio) {
        playAudio(page.manualAudio)
      }
      return
    }
    const page = pagesData[currentPage]
    const src = page.audio || page.introAudio
    if (src) {
      playAudio(src)
    }
  }, [currentPage, isManualOpen, playAudio])

  // Open manual view for current language
  const openManual = useCallback(() => {
    if (currentPage === 0) return
    const page = pagesData[currentPage]
    if (page.manualAudio) {
      setIsManualOpen(true)
      playAudio(page.manualAudio)
    }
  }, [currentPage, playAudio])

  // Close manual view
  const closeManual = useCallback(() => {
    setIsManualOpen(false)
    stopAudio()
    setTimeout(() => {
      speakCurrentSlide()
    }, 100)
  }, [speakCurrentSlide, stopAudio])

  // Handle slide change
  const navigateSlide = useCallback((newIndex) => {
    if (isManualOpen) return
    let target = newIndex
    if (target > 3) target = 0
    if (target < 0) target = 3
    setCurrentPage(target)
  }, [isManualOpen])

  // Auto-play when slide changes AFTER initial user interaction
  useEffect(() => {
    if (!isManualOpen && hasInteracted) {
      speakCurrentSlide()
    }
  }, [currentPage, isManualOpen, speakCurrentSlide])

  // Debounced Double Action (double tap / double click anywhere on screen)
  const handleDoubleAction = useCallback(() => {
    const now = Date.now()
    if (now - lastDoubleActionTimeRef.current < 450) {
      return // Ignore synthesized duplicate dblclick event on mobile
    }
    lastDoubleActionTimeRef.current = now

    if (isManualOpen) {
      closeManual()
    } else {
      if (currentPage > 0) {
        openManual()
      }
    }
  }, [isManualOpen, closeManual, currentPage, openManual])

  // Single user tap/click handler on whole screen
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
      speakCurrentSlide()
    } else if (!isPlaying) {
      speakCurrentSlide()
    }
  }

  const handlePointerDown = () => {
    handleUserInteraction()
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    handleDoubleAction()
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX
    const distance = touchEndX.current - touchStartX.current

    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime.current
    if (tapLength < 300 && tapLength > 0) {
      handleDoubleAction()
      return
    }
    lastTapTime.current = currentTime

    // Swipe left / right navigation (only when manual is not open)
    if (Math.abs(distance) > 40 && !isManualOpen) {
      if (distance < 0) {
        navigateSlide(currentPage + 1)
      } else {
        navigateSlide(currentPage - 1)
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasInteracted) setHasInteracted(true)

      if (e.key === 'ArrowRight') {
        if (!isManualOpen) navigateSlide(currentPage + 1)
      } else if (e.key === 'ArrowLeft') {
        if (!isManualOpen) navigateSlide(currentPage - 1)
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (isManualOpen) closeManual()
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (!isManualOpen && currentPage > 0) {
          openManual()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isManualOpen, navigateSlide, closeManual, openManual, hasInteracted])

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setAudioProgress(100)
  }

  const page = pagesData[currentPage]

  return (
    <div
      className="min-h-[105vh] bg-slate-50 text-slate-900 flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden w-full max-w-full box-border relative pb-12 cursor-pointer"
      onPointerDown={handlePointerDown}
      onClick={handleUserInteraction}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'manipulation' }}
      tabIndex={0}
      aria-label="Accessible Audio Voice Manual Viewport"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Decorative ambient background blur orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-100/60 rounded-full opacity-70 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-200/50 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="sr-only" aria-live="assertive">
        {isManualOpen
          ? `${page.manualTitle}. ${page.manualText}`
          : `Page ${currentPage + 1} of 4. ${page.title}. ${page.instruction}`}
      </div>

      {/* Top Header Bar */}
      <header
        className="px-3 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-2 z-20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        <Link
          to="/"
          onClick={(e) => e.stopPropagation()}
          className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-brand-50 text-brand-600 font-semibold rounded-xl border border-brand-200 text-xs sm:text-sm shadow-sm flex items-center gap-1 shrink-0 transition-all cursor-pointer"
        >
          <span>←</span>
          <span>Showcase</span>
        </Link>

        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 bg-brand-50 rounded-full border border-brand-100 shrink-0">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
          <span className="text-[11px] sm:text-xs text-brand-700 font-semibold uppercase tracking-wider">
            Voice Mode
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 py-8">
        <AnimatePresence mode="wait">
          {!isManualOpen ? (
            /* SLIDER VIEWS (Page 0 to 3) */
            <motion.div
              key={`slide-${currentPage}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-12 text-center shadow-xl backdrop-blur-xl relative"
            >
              {currentPage === 0 ? (
                <div>
                  <h1 className="text-4xl sm:text-7xl font-black text-brand-600 tracking-wider mb-2">
                    {page.title}
                  </h1>
                  <h2 className="text-xl sm:text-4xl font-bold text-slate-800 mb-6 sm:mb-8">
                    {page.subtitle}
                  </h2>
                  <p className="text-base sm:text-2xl text-slate-600 whitespace-pre-line leading-relaxed font-medium">
                    {page.instruction}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[11px] sm:text-xs uppercase font-bold tracking-widest mb-4 sm:mb-6">
                    Language Selection
                  </div>
                  <h1 className="text-4xl sm:text-7xl font-black text-slate-900 mb-6 sm:mb-8">
                    {page.title}
                  </h1>
                  <div className="p-4 sm:p-6 bg-brand-50/80 rounded-2xl border border-brand-200/70 mb-2 sm:mb-4 shadow-inner">
                    <p className="text-base sm:text-2xl text-brand-900 whitespace-pre-line font-semibold leading-relaxed">
                      {page.instruction}
                    </p>
                  </div>
                </div>
              )}

              {!hasInteracted && (
                <div className="mt-4 sm:mt-6 text-xs text-brand-600 font-semibold animate-bounce">
                  👆 Tap anywhere to activate audio narration
                </div>
              )}
            </motion.div>
          ) : (
            /* MANUAL DETAIL VIEW - Distraction-free for visually impaired users */
            <motion.div
              key="manual-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white/95 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl max-h-[75vh] flex flex-col justify-between"
            >
              <div>
                <h1 className="text-xl sm:text-4xl font-bold text-brand-600 text-center mb-4 sm:mb-6 border-b border-slate-200 pb-3 sm:pb-4">
                  {page.manualTitle}
                </h1>

                <div className="text-slate-800 text-sm sm:text-xl font-medium leading-relaxed whitespace-pre-line overflow-y-auto max-h-[40vh] sm:max-h-[45vh] pr-2 scrollbar-thin">
                  {page.manualText}
                </div>
              </div>

              {/* Progress bar only - Double tap anywhere on screen to exit */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 flex flex-col gap-2">
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full transition-all duration-100"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  Double tap anywhere on screen to exit manual
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation Dots - Ultra-clean layout */}
      <footer
        className="p-4 sm:p-6 flex items-center justify-center gap-4 z-20 mt-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {!isManualOpen && (
          <div className="flex items-center justify-center gap-3">
            {pagesData.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateSlide(idx)
                }}
                className={`h-3 rounded-full transition-all cursor-pointer ${
                  currentPage === idx
                    ? 'w-8 bg-brand-500 shadow-sm'
                    : 'w-3 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${p.langName}`}
              />
            ))}
          </div>
        )}
      </footer>
    </div>
  )
}
