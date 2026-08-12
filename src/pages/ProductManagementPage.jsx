import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import QRCodeStyling from 'qr-code-styling'

// Convert a number (0 - 1295) into a 2-character alphanumeric string (0-9, A-Z)
const formatAlphanumeric = (num) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const base = chars.length // 36
  const first = chars[Math.floor(num / base) % base]
  const second = chars[num % base]
  return `${first}${second}`
}

export default function ProductManagementPage() {
  const today = new Date()
  const defaultYear = today.getFullYear().toString().slice(-2) // e.g. "26"
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0') // e.g. "08"
  const defaultDay = String(today.getDate()).padStart(2, '0') // e.g. "12"

  const [year, setYear] = useState(defaultYear)
  const [month, setMonth] = useState(defaultMonth)
  const [day, setDay] = useState(defaultDay)
  const [seqIndex, setSeqIndex] = useState(0) // starts from 0 ("00")
  const [customSerialSuffix, setCustomSerialSuffix] = useState('')
  const [batchCount, setBatchCount] = useState(1)
  const [manualUrl, setManualUrl] = useState('https://tarang.krioj.co.in/manual')
  const [showExportModal, setShowExportModal] = useState(false)

  const qrRef = useRef(null)
  const qrCodeInstance = useRef(null)
  const svgContainerRef = useRef(null)

  // Calculated 2-char Product ID sequence (e.g. "00", "01", "09", "0A")
  const formattedSeq = customSerialSuffix.trim().toUpperCase()
    ? customSerialSuffix.trim().toUpperCase().padStart(2, '0').slice(-2)
    : formatAlphanumeric(seqIndex)

  // Full Serial Number string: YYMMDD + Seq (e.g. "26081200")
  const currentSerialNo = `${year.padStart(2, '0').slice(-2)}${month.padStart(2, '0').slice(-2)}${day.padStart(2, '0').slice(-2)}${formattedSeq}`

  // Initialize live QR code instance
  useEffect(() => {
    if (qrRef.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 220,
        height: 220,
        type: 'svg',
        data: manualUrl,
        image: '/logo-icon.svg',
        margin: 4,
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
  }, [manualUrl])

  // Helper to generate a standalone SVG string of the full sticker (QR + Serial No)
  const getFullStickerSvgString = async (serialStr) => {
    // Generate QR SVG string
    const qrSvgRaw = await qrCodeInstance.current?.getRawData('svg')
    let qrSvgContent = ''
    if (qrSvgRaw) {
      const reader = new FileReader()
      qrSvgContent = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsText(qrSvgRaw)
      })
    }

    const cleanQr = qrSvgContent
      .replace(/<\?xml.*?\?>/gi, '')
      .replace(/<!DOCTYPE.*?>/gi, '')
      .trim()

    // Pure vector SVG (starting directly with <svg> tag for browser safety)
    const compositeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
  <rect width="300" height="360" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />
  
  <!-- Branding Header -->
  <text x="150" y="28" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#1976D2" text-anchor="middle" letter-spacing="2">TARANG</text>
  <text x="150" y="42" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="1">BY KRIOJ TECHNOLOGIES</text>
  
  <!-- Embedded QR Code Vector -->
  <g transform="translate(30, 48)">
    ${cleanQr}
  </g>
  
  <!-- Divider -->
  <line x1="30" y1="295" x2="270" y2="295" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 2" />

  <!-- Serial Number Box -->
  <rect x="25" y="306" width="250" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="150" y="323" font-family="Courier New, monospace" font-size="10" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="1">SERIAL NO.</text>
  <text x="150" y="338" font-family="Courier New, monospace" font-size="16" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="2">${serialStr}</text>
</svg>`

    return compositeSvg
  }

  // Trigger SVG Download (Blob URL with delayed revocation for Chrome/Brave Save As file prompt)
  const downloadStickerSvg = async (serialStr = currentSerialNo) => {
    const svgData = await getFullStickerSvgString(serialStr)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${serialStr}.svg`
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(url)
    }, 10000)
  }

  // Trigger High-Res PNG Download
  const downloadStickerPng = async (serialStr = currentSerialNo) => {
    const svgData = await getFullStickerSvgString(serialStr)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1440
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 1200, 1440)

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return
        const pngUrl = URL.createObjectURL(pngBlob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `${serialStr}.png`
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link)
          }
          URL.revokeObjectURL(pngUrl)
          URL.revokeObjectURL(url)
        }, 10000)
      }, 'image/png')
    }
    img.src = url
  }

  // Generate Batch SVGs (Download sequence)
  const handleBatchDownload = async () => {
    for (let i = 0; i < Math.min(batchCount, 50); i++) {
      const seqStr = formatAlphanumeric(seqIndex + i)
      const serialStr = `${year.padStart(2, '0').slice(-2)}${month.padStart(2, '0').slice(-2)}${day.padStart(2, '0').slice(-2)}${seqStr}`
      await downloadStickerSvg(serialStr)
      await new Promise((r) => setTimeout(r, 200)) // delay between downloads
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Internal Admin Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo-icon.svg" alt="Krioj Logo" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-black text-brand-600 tracking-wide leading-none">
              KRIOJ INTERNAL
            </h1>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Product Tag &amp; Serial Number Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full hidden sm:inline-block">
            🔒 Internal Use Only
          </span>
          <Link
            to="/"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-all"
          >
            Showcase Site →
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Serial No Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>🏷️</span>
              <span>Serial Tag Generator</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Generate print-ready 30x30 mm glossy sticker tags embedded with accessible manual QR code and structured product serial numbers (YYMMDD + Alphanumeric ID).
            </p>

            <div className="space-y-5">
              {/* Date Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Manufacturing Date (YY / MM / DD)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Year (2 digits)</span>
                    <input
                      type="text"
                      maxLength="2"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Month (01-12)</span>
                    <input
                      type="text"
                      maxLength="2"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Day (01-31)</span>
                    <input
                      type="text"
                      maxLength="2"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Alphanumeric Sequence Counter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Product ID Sequence (Base 36 Alphanumeric: 00 - ZZ)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSeqIndex(Math.max(0, seqIndex - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center bg-brand-50 border border-brand-200 rounded-xl py-2">
                    <span className="text-sm font-semibold text-slate-500 block text-[11px]">Numeric Index: #{seqIndex}</span>
                    <span className="text-lg font-black text-brand-600 tracking-widest">{formattedSeq}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSeqIndex(seqIndex + 1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Custom Suffix / Manual Suffix */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Override 2-Char Product ID (Optional)
                </label>
                <input
                  type="text"
                  maxLength="2"
                  placeholder="e.g. 0A or A1"
                  value={customSerialSuffix}
                  onChange={(e) => setCustomSerialSuffix(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Generated Serial No Result Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                    Full Formatted Serial Number
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-brand-300">
                    {currentSerialNo}
                  </span>
                </div>
                <span className="text-xs bg-brand-500/30 text-brand-300 border border-brand-400/40 px-3 py-1 rounded-lg font-mono">
                  8-DIGITS
                </span>
              </div>

              {/* Batch Export Options */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Batch Download Quantity (for shipping 100 items/mo)
                </label>
                <div className="flex items-center gap-3">
                  {[1, 10, 25, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBatchCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        batchCount === num
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {num} {num === 1 ? 'Tag' : 'Tags'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => downloadStickerSvg(currentSerialNo)}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-elevated flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>📥</span>
                  <span>Download Single SVG</span>
                </button>

                <button
                  type="button"
                  onClick={batchCount === 1 ? () => downloadStickerPng(currentSerialNo) : handleBatchDownload}
                  className="w-full py-3.5 bg-white hover:bg-brand-50 text-brand-600 font-bold rounded-xl text-sm border border-brand-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>🖼️</span>
                  <span>{batchCount > 1 ? `Export Batch (${batchCount} SVGs)` : 'Download PNG (HD)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Tag Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                30×30 mm Sticker Tag Preview
              </span>

              {/* Printable Physical Tag Card */}
              <div className="w-full max-w-[280px] bg-white rounded-2xl border-2 border-slate-200 p-4 mx-auto shadow-lg flex flex-col items-center relative overflow-hidden">
                {/* Branding */}
                <span className="text-xs font-black text-brand-600 tracking-widest leading-none">
                  TARANG
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-wider mb-2">
                  BY KRIOJ TECHNOLOGIES
                </span>

                {/* QR Code */}
                <div className="p-2 bg-white rounded-xl shadow-inner border border-slate-100 w-full aspect-square flex items-center justify-center mb-3">
                  <div
                    ref={qrRef}
                    className="w-full aspect-square flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full"
                  />
                </div>

                {/* Serial Number Box */}
                <div className="w-full py-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-0.5">
                    SERIAL NO.
                  </span>
                  <span className="text-sm font-black font-mono text-slate-900 tracking-widest">
                    {currentSerialNo}
                  </span>
                </div>
              </div>

              {/* Print Info */}
              <div className="mt-6 text-xs text-slate-500 space-y-1">
                <p>✓ High-DPI Vector Output (300+ DPI)</p>
                <p>✓ Scans directly to: <span className="text-brand-600 font-semibold">{manualUrl}</span></p>
                <p>✓ Encodes Mfg Date ({year}/{month}/{day}) + Product ID ({formattedSeq})</p>
              </div>

              <button
                type="button"
                onClick={() => downloadStickerSvg(currentSerialNo)}
                className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>🖨️</span>
                <span>Download Print-Ready Sticker SVG</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-4 text-center text-xs text-slate-400">
        Krioj Technologies Internal Asset Management © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
