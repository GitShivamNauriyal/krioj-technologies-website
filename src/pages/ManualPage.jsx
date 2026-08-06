import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import QRCodeStyling from 'qr-code-styling'

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
  const [showQrModal, setShowQrModal] = useState(false)

  const audioRef = useRef(null)
  const qrRef = useRef(null)
  const qrCodeInstance = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const lastTapTime = useRef(0)

  const targetUrl = 'https://krioj.vercel.app/manual'

  // Stop audio helper
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setAudioProgress(0)
  }, [])

  // Play audio helper
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

  // Play current slide audio
  const speakCurrentSlide = useCallback(() => {
    if (showQrModal) return
    const page = pagesData[currentPage]
    const src = page.audio || page.introAudio
    if (src) {
      playAudio(src)
    }
  }, [currentPage, playAudio, showQrModal])

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
    if (isManualOpen || showQrModal) return
    let target = newIndex
    if (target > 3) target = 0
    if (target < 0) target = 3
    setCurrentPage(target)
  }, [isManualOpen, showQrModal])

  useEffect(() => {
    if (!isManualOpen && hasInteracted && !showQrModal) {
      speakCurrentSlide()
    }
  }, [currentPage, isManualOpen, hasInteracted, speakCurrentSlide, showQrModal])

  // QR Code initialization inside modal
  useEffect(() => {
    if (showQrModal && qrRef.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 240,
        height: 240,
        type: 'svg',
        data: targetUrl,
        image: '/logo-icon.svg',
        margin: 6,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'H',
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.22,
          margin: 2,
          crossOrigin: 'anonymous',
        },
        dotsOptions: {
          color: '#0f172a',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          color: '#1976D2',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#1565c0',
          type: 'dot',
        },
      })
      qrRef.current.innerHTML = ''
      qrCodeInstance.current.append(qrRef.current)
    }
  }, [showQrModal])

  const downloadQrSvg = () => {
    qrCodeInstance.current?.download({
      extension: 'svg',
      name: 'tarang-manual-qr-30x30mm',
    })
  }

  const downloadQrPng = () => {
    qrCodeInstance.current?.download({
      extension: 'png',
      name: 'tarang-manual-qr-30x30mm-hd',
    })
  }

  // Double click / double tap detection
  const handleDoubleAction = useCallback(() => {
    if (showQrModal) return
    if (isManualOpen) {
      closeManual()
    } else {
      if (currentPage > 0) {
        openManual()
      }
    }
  }, [isManualOpen, closeManual, currentPage, openManual, showQrModal])

  const handlePointerDown = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
      speakCurrentSlide()
    }
  }

  const handleDoubleClick = () => {
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

    if (Math.abs(distance) > 50 && !isManualOpen && !showQrModal) {
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
        if (!isManualOpen && !showQrModal) navigateSlide(currentPage + 1)
      } else if (e.key === 'ArrowLeft') {
        if (!isManualOpen && !showQrModal) navigateSlide(currentPage - 1)
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (showQrModal) setShowQrModal(false)
        else if (isManualOpen) closeManual()
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (!isManualOpen && currentPage > 0 && !showQrModal) {
          openManual()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isManualOpen, navigateSlide, closeManual, openManual, hasInteracted, showQrModal])

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
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between select-none touch-none overflow-hidden relative"
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
        className="p-4 sm:p-6 flex items-center justify-between z-20"
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
          className="px-4 py-2 bg-white hover:bg-brand-50 text-brand-600 font-semibold rounded-xl border border-brand-200 text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>←</span>
          <span>Showcase Site</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 bg-brand-50 rounded-full border border-brand-100">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
          <span className="text-xs text-brand-700 font-semibold uppercase tracking-wider">
            Accessible Voice Mode
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <AnimatePresence mode="wait">
          {!isManualOpen ? (
            /* SLIDER VIEWS (Page 0 to 3) */
            <motion.div
              key={`slide-${currentPage}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl bg-white/90 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center shadow-xl backdrop-blur-xl relative"
            >
              {currentPage === 0 ? (
                <div>
                  <h1 className="text-5xl sm:text-7xl font-black text-brand-600 tracking-wider mb-2">
                    {page.title}
                  </h1>
                  <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-8">
                    {page.subtitle}
                  </h2>
                  <p className="text-lg sm:text-2xl text-slate-600 whitespace-pre-line leading-relaxed font-medium">
                    {page.instruction}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs uppercase font-bold tracking-widest mb-6">
                    Language Selection
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-8">
                    {page.title}
                  </h1>
                  <div className="p-6 bg-brand-50/80 rounded-2xl border border-brand-200/70 mb-8 shadow-inner">
                    <p className="text-lg sm:text-2xl text-brand-900 whitespace-pre-line font-semibold leading-relaxed">
                      {page.instruction}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openManual()
                    }}
                    className="w-full py-4 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-bold text-xl rounded-2xl shadow-elevated transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>🔊</span>
                    <span>Listen Manual ({page.title})</span>
                  </button>
                </div>
              )}

              {!hasInteracted && (
                <div className="mt-6 text-xs text-brand-600 font-semibold animate-bounce">
                  👆 Tap anywhere to activate audio narration
                </div>
              )}
            </motion.div>
          ) : (
            /* MANUAL DETAIL VIEW */
            <motion.div
              key="manual-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white/95 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl max-h-[75vh] flex flex-col justify-between"
            >
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-brand-600 text-center mb-6 border-b border-slate-200 pb-4">
                  {page.manualTitle}
                </h1>

                <div className="text-slate-800 text-base sm:text-xl font-medium leading-relaxed whitespace-pre-line overflow-y-auto max-h-[40vh] pr-2 scrollbar-thin">
                  {page.manualText}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-4">
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full transition-all duration-100"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playAudio(page.manualAudio)
                    }}
                    className="py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-elevated flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>🔊</span>
                    <span>Replay Audio</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeManual()
                    }}
                    className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Download Modal */}
        <AnimatePresence>
          {showQrModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-1">Sticker QR Code</h3>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 font-semibold hover:underline block mb-4 break-all"
                >
                  {targetUrl}
                </a>

                <div className="w-full flex justify-center items-center mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-200 w-full max-w-[260px] flex items-center justify-center mx-auto overflow-hidden">
                    <div
                      ref={qrRef}
                      className="w-full aspect-square flex items-center justify-center overflow-hidden mx-auto [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:block"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={downloadQrSvg}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-elevated flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>📥</span>
                    <span>Download SVG (Lossless Print)</span>
                  </button>
                  <button
                    onClick={downloadQrPng}
                    className="w-full py-3 bg-white hover:bg-brand-50 text-brand-600 font-bold rounded-xl text-sm border border-brand-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>🖼️</span>
                    <span>Download Ultra-HD PNG</span>
                  </button>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="w-full py-2.5 bg-transparent hover:bg-slate-100 text-slate-500 font-medium rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Controls & Download QR Code Button */}
      <footer
        className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {!isManualOpen ? (
          <>
            <div className="flex items-center gap-3">
              {pagesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateSlide(idx)
                  }}
                  className={`h-3 rounded-full transition-all cursor-pointer ${
                    currentPage === idx
                      ? 'w-8 bg-brand-500'
                      : 'w-3 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowQrModal(true)
                  stopAudio()
                }}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-elevated flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>📱</span>
                <span>Download Sticker QR</span>
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Double tap or click anywhere to exit manual audio
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowQrModal(true)
                stopAudio()
              }}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-elevated flex items-center gap-2 cursor-pointer shrink-0 transition-all"
            >
              <span>📱</span>
              <span>Download Sticker QR</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}
