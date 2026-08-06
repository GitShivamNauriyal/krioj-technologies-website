export default function Footer() {
  return (
    <footer id="footer" className="bg-slate-900 text-white py-16">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-widest text-brand-300 mb-4">
              TARANG
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart RF Tags by Krioj Technologies. Helping you locate your
              belongings with 433 MHz wireless technology.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              Version 1.0
            </p>
          </div>

          {/* Warranty */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Warranty
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Covers manufacturing defects only.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Excludes: physical damage, water damage, unauthorized repairs,
              misuse, and improper charging.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Contact &amp; Support
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>
                <span className="text-slate-500">Email: </span>
                <a
                  href="mailto:support@krioj.com"
                  className="text-brand-300 hover:text-brand-200 transition-colors"
                >
                  support@krioj.com
                </a>
              </p>
              <p>
                <span className="text-slate-500">Website: </span>
                <a
                  href="https://www.krioj.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-300 hover:text-brand-200 transition-colors"
                >
                  www.krioj.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <p className="text-xs text-slate-500">
            &copy; 2026 Krioj Technologies. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
