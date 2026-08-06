import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { motion } from 'motion/react'

export default function ManualQRCodeGenerator() {
  const qrRef = useRef(null)
  const qrCode = useRef(null)

  const targetUrl = 'https://krioj.vercel.app/manual'

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'svg',
      data: targetUrl,
      image: '/logo-icon.svg',
      margin: 8,
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

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)
    }
  }, [])

  const downloadSvg = () => {
    qrCode.current?.download({
      extension: 'svg',
      name: 'tarang-manual-qr-30x30mm',
    })
  }

  const downloadPng = () => {
    qrCode.current?.download({
      extension: 'png',
      name: 'tarang-manual-qr-30x30mm-hd',
    })
  }

  return (
    <section id="qr-section" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Print-Ready QR Batch
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Official Sticker QR Code
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Dynamic QR code for 30×30 mm glossy stickers. Scans directly to the accessible manual.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto glass-card rounded-3xl p-5 sm:p-10 text-center shadow-xl border border-slate-200 flex flex-col items-center justify-center"
        >
          {/* Print Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold mb-6">
            <span>🏷️</span>
            <span>Formatted for 30×30 mm Physical Stickers</span>
          </div>

          {/* Centered QR Container */}
          <div className="w-full flex justify-center items-center mb-6">
            <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-inner border border-slate-200 w-full max-w-[280px] sm:max-w-[332px] flex items-center justify-center mx-auto overflow-hidden">
              <div
                ref={qrRef}
                className="w-full aspect-square flex items-center justify-center overflow-hidden mx-auto [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:block"
              />
            </div>
          </div>

          {/* Target URL */}
          <div className="w-full bg-slate-100 rounded-xl p-3 mb-6 text-center">
            <span className="text-xs text-text-muted block mb-0.5">Target Web Address:</span>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-brand-600 hover:underline break-all"
            >
              {targetUrl}
            </a>
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={downloadSvg}
              className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-elevated transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📥</span>
              <span>Download Print SVG</span>
            </button>

            <button
              onClick={downloadPng}
              className="w-full py-3.5 px-4 bg-white hover:bg-brand-50 active:scale-98 text-brand-600 font-bold text-sm rounded-xl border border-brand-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🖼️</span>
              <span>Download Ultra-HD PNG</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
