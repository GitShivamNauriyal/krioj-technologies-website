import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import QRCodeStyling from 'qr-code-styling'
import JSZip from 'jszip'

export default function ProductManagementPage() {
  const today = new Date()
  const defaultYear = today.getFullYear().toString().slice(-2) // e.g. "26"
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0') // e.g. "08"

  const [year, setYear] = useState(defaultYear)
  const [month, setMonth] = useState(defaultMonth)
  const [lotNo, setLotNo] = useState(0) // Lot Number (00 to 99)
  const [deviceNo, setDeviceNo] = useState(0) // Device Number (00 to 99)
  const [deviceType, setDeviceType] = useState('T') // "T", "R1", or "R2"
  const [manualUrl, setManualUrl] = useState('https://tarang.krioj.co.in/manual')
  const [isExportingBatch, setIsExportingBatch] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0)

  const qrRef = useRef(null)
  const qrCodeInstance = useRef(null)

  // Strictly 2-digit format for Lot (00 - 99) and Device (00 - 99)
  const formattedLot = String(Math.min(99, Math.max(0, lotNo))).padStart(2, '0').slice(-2)
  const formattedDevice = String(Math.min(99, Math.max(0, deviceNo))).padStart(2, '0').slice(-2)

  // Serial Number Format with hyphens between all segments:
  // Transmitter (T): T-26-08-00-00 (9 alphanumeric chars: T + 8 digits)
  // Receivers (R1 / R2): R1-26-08-00-00 / R2-26-08-00-00 (10 alphanumeric chars: R1/R2 + 8 digits)
  const currentSerialNo = `${deviceType}-${year.padStart(2, '0').slice(-2)}-${month.padStart(2, '0').slice(-2)}-${formattedLot}-${formattedDevice}`

  // Alphanumeric digit count without hyphens (9 for T, 10 for R1/R2)
  const rawDigitCount = deviceType === 'T' ? 9 : 10

  // Initialize live QR code instance
  useEffect(() => {
    if (qrRef.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 240,
        height: 240,
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

  // Get raw clean QR code vector string ONCE
  const getCleanQrSvg = async () => {
    if (!qrCodeInstance.current) return ''
    try {
      const qrSvgRaw = await qrCodeInstance.current.getRawData('svg')
      if (!qrSvgRaw) return ''
      const text = await qrSvgRaw.text()
      return text
        .replace(/<\?xml.*?\?>/gi, '')
        .replace(/<!DOCTYPE.*?>/gi, '')
        .trim()
    } catch {
      return ''
    }
  }

  // Helper to generate a standalone SVG string of the full sticker (QR + Serial No + Help & Support)
  const getFullStickerSvgString = (serialStr, cleanQrSvg = '') => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="390" viewBox="0 0 300 390">
  <rect width="300" height="390" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />
  
  <!-- Branding Header -->
  <text x="150" y="28" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#1976D2" text-anchor="middle" letter-spacing="2">TARANG</text>
  <text x="150" y="42" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="1">BY KRIOJ TECHNOLOGIES</text>
  
  <!-- Embedded QR Code Vector -->
  <g transform="translate(30, 48)">
    ${cleanQrSvg}
  </g>
  
  <!-- Divider -->
  <line x1="25" y1="295" x2="275" y2="295" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 2" />

  <!-- Serial Number Box -->
  <rect x="25" y="306" width="250" height="42" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="150" y="322" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="middle" letter-spacing="1.5">SERIAL NO.</text>
  <text x="150" y="339" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="16" font-weight="700" fill="#0f172a" text-anchor="middle" letter-spacing="2">${serialStr}</text>

  <!-- Help & Support Footer -->
  <text x="150" y="362" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="8" font-weight="800" fill="#94a3b8" text-anchor="middle" letter-spacing="1.5">HELP &amp; SUPPORT</text>
  <text x="150" y="375" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="9.5" font-weight="700" fill="#1565c0" text-anchor="middle" letter-spacing="0.5">tarangsupport@krioj.co.in</text>
</svg>`
  }

  // Trigger single SVG Download (filename: krioj_<serial_no>.svg)
  const downloadStickerSvg = async (serialStr = currentSerialNo) => {
    const cleanQr = await getCleanQrSvg()
    const svgData = getFullStickerSvgString(serialStr, cleanQr)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `krioj_${serialStr}.svg`
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(url)
    }, 10000)
  }

  // Download complete 3-sticker set (T, R1, R2) for currently selected device number
  const downloadSingleSet = async () => {
    const yy = year.padStart(2, '0').slice(-2)
    const mm = month.padStart(2, '0').slice(-2)
    const lotStr = formattedLot
    const devStr = formattedDevice

    const tSerial = `T-${yy}-${mm}-${lotStr}-${devStr}`
    await downloadStickerSvg(tSerial)
    await new Promise((r) => setTimeout(r, 150))

    const r1Serial = `R1-${yy}-${mm}-${lotStr}-${devStr}`
    await downloadStickerSvg(r1Serial)
    await new Promise((r) => setTimeout(r, 150))

    const r2Serial = `R2-${yy}-${mm}-${lotStr}-${devStr}`
    await downloadStickerSvg(r2Serial)
  }

  // Batch Download all 100 sets (300 SVGs total: 100 T, 100 R1, 100 R2 for items 00 to 99) as a DYNAMIC SINGLE ZIP ARCHIVE!
  const handleBatchDownloadAll300Zip = async () => {
    setIsExportingBatch(true)
    setBatchProgress(0)

    const zip = new JSZip()
    const yy = year.padStart(2, '0').slice(-2)
    const mm = month.padStart(2, '0').slice(-2)
    const lotStr = formattedLot
    const cleanQr = await getCleanQrSvg()

    // Root folder name inside the ZIP (e.g. krioj_lot_05_2608_tags)
    const folderName = `krioj_lot_${lotStr}_${yy}${mm}_tags`
    const folder = zip.folder(folderName)

    for (let i = 0; i <= 99; i++) {
      const devStr = String(i).padStart(2, '0')

      // Dynamic Transmitter serial: e.g. T-26-08-05-00
      const tSerial = `T-${yy}-${mm}-${lotStr}-${devStr}`
      const tSvgData = getFullStickerSvgString(tSerial, cleanQr)
      folder.file(`krioj_${tSerial}.svg`, tSvgData)

      // Dynamic Receiver 1 serial: e.g. R1-26-08-05-00
      const r1Serial = `R1-${yy}-${mm}-${lotStr}-${devStr}`
      const r1SvgData = getFullStickerSvgString(r1Serial, cleanQr)
      folder.file(`krioj_${r1Serial}.svg`, r1SvgData)

      // Dynamic Receiver 2 serial: e.g. R2-26-08-05-00
      const r2Serial = `R2-${yy}-${mm}-${lotStr}-${devStr}`
      const r2SvgData = getFullStickerSvgString(r2Serial, cleanQr)
      folder.file(`krioj_${r2Serial}.svg`, r2SvgData)

      setBatchProgress(i + 1)
    }

    // Generate ZIP archive file in memory
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipUrl = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = zipUrl
    link.download = `krioj_lot_${lotStr}_${yy}${mm}_300_tags.zip`
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(zipUrl)
    }, 10000)

    setIsExportingBatch(false)

    // Auto-increment Lot Number (00 to 99) after exporting ZIP
    setLotNo((prevLot) => (prevLot + 1) % 100)
    setDeviceNo(0)
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
        {/* Left Column: Controls & Generators */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Single Item Generator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>🏷️</span>
              <span>Single Product Tag Generator</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Each product package ships with 1 Transmitter (T), 1 Receiver (R1), and 1 Receiver (R2). Lot and Device numbers range from 00 to 99.
            </p>

            <div className="space-y-5">
              {/* Device Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Device Type (Preview Tag)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeviceType('T')}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      deviceType === 'T'
                        ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    T (Transmitter) - 9 Digits
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceType('R1')}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      deviceType === 'R1'
                        ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    R1 (Receiver 1) - 10 Digits
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceType('R2')}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      deviceType === 'R2'
                        ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    R2 (Receiver 2) - 10 Digits
                  </button>
                </div>
              </div>

              {/* Date Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Manufacturing Date (YY / MM)
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                </div>
              </div>

              {/* Lot Number Input (00 - 99) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Lot Number (00 - 99)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLotNo((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={lotNo}
                    onChange={(e) => setLotNo(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="flex-1 text-center bg-brand-50 border border-brand-200 rounded-xl py-2 font-black text-lg text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setLotNo((prev) => Math.min(99, prev + 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Device Number Sequence (00 - 99) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Device Item Number (00 - 99)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDeviceNo((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={deviceNo}
                    onChange={(e) => setDeviceNo(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="flex-1 text-center bg-slate-50 border border-slate-300 rounded-xl py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setDeviceNo((prev) => Math.min(99, prev + 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Formatted Full Serial Display Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                    Selected Item Serial Number
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-brand-300">
                    {currentSerialNo}
                  </span>
                </div>
                <span className="text-xs bg-brand-500/30 text-brand-300 border border-brand-400/40 px-3 py-1 rounded-lg font-mono uppercase">
                  {rawDigitCount} DIGITS ({deviceType})
                </span>
              </div>

              {/* Action Buttons for Single Item Downloads */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => downloadStickerSvg(currentSerialNo)}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-elevated flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>📥</span>
                  <span>Download {deviceType} Tag Only</span>
                </button>

                <button
                  type="button"
                  onClick={downloadSingleSet}
                  className="w-full py-3.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>✨</span>
                  <span>Download Full Set (3 SVGs: T, R1, R2)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Separated Full Lot ZIP Export Box */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span>📦</span>
              <span>Full Lot ZIP Archive (300 SVGs - 1 Prompt)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Bundles all 100 shipped product sets for <strong className="text-brand-300">Lot {formattedLot}</strong> into a dynamic ZIP archive (<code className="text-brand-300">krioj_lot_{formattedLot}_{year.padStart(2, '0').slice(-2)}{month.padStart(2, '0').slice(-2)}_300_tags.zip</code> containing folder <code className="text-brand-300">krioj_lot_{formattedLot}_{year.padStart(2, '0').slice(-2)}{month.padStart(2, '0').slice(-2)}_tags/</code>). Prompts for save location <strong>only ONCE</strong>! Auto-increments Lot No to {String((parseInt(formattedLot) + 1) % 100).padStart(2, '0')} upon completion.
            </p>

            {/* Batch Progress Bar if Active */}
            {isExportingBatch && (
              <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-2xl text-center space-y-2 mb-6 shadow-inner">
                <div className="text-xs font-bold text-brand-300">
                  Zipping Lot {formattedLot}: Set {batchProgress}/100 ({batchProgress * 3}/300 SVGs bundled)...
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full transition-all duration-150"
                    style={{ width: `${(batchProgress / 100) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isExportingBatch}
              onClick={handleBatchDownloadAll300Zip}
              className="w-full py-4 bg-brand-500 hover:bg-brand-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>📁</span>
              <span>
                {isExportingBatch
                  ? `Zipping Lot ${formattedLot} (${batchProgress}/100 sets)...`
                  : `Download Lot ${formattedLot} ZIP Archive (300 SVGs)`}
              </span>
            </button>
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
                  <span className="text-sm font-bold font-sans text-slate-900 tracking-widest">
                    {currentSerialNo}
                  </span>
                </div>

                {/* Help & Support Line */}
                <div className="mt-2.5 flex flex-col items-center">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                    HELP &amp; SUPPORT
                  </span>
                  <span className="text-[9.5px] font-bold text-brand-600 tracking-wide">
                    tarangsupport@krioj.co.in
                  </span>
                </div>
              </div>

              {/* Print Info */}
              <div className="mt-6 text-xs text-slate-500 space-y-1">
                <p>✓ High-DPI Vector SVG Output</p>
                <p>✓ Scans directly to: <span className="text-brand-600 font-semibold">{manualUrl}</span></p>
                <p>✓ Serial: <span className="font-mono text-slate-800 font-bold">{currentSerialNo}</span> ({rawDigitCount} Digits + Hyphens)</p>
                <p className="text-[11px] text-amber-600 font-medium">Bundles into 1 ZIP file (00-99 sets)</p>
              </div>

              <button
                type="button"
                onClick={() => downloadStickerSvg(currentSerialNo)}
                className="mt-6 w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>🖨️</span>
                <span>Download Vector SVG (krioj_{currentSerialNo}.svg)</span>
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
