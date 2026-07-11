export function VariantB() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 p-10"
      style={{ background: "#07080f" }}>

      {/* Label */}
      <p className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "#3b82f6" }}>
        Вариант B — Diamond Monogram
      </p>

      {/* === FULL LOGO === */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          {/* Icon: blue diamond with bold B */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect x="7" y="7" width="30" height="30" rx="4" fill="#2563EB" transform="rotate(45 22 22)"/>
            <text x="22" y="28" textAnchor="middle" fill="white"
              fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" letterSpacing="-1">B</text>
          </svg>

          {/* Wordmark */}
          <div className="flex flex-col leading-none gap-1.5">
            <span style={{
              color: "white",
              fontFamily: "'Inter', sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.15em",
            }}>BOVAJA</span>
            <div className="flex items-center gap-2">
              <div style={{ width: "18px", height: "1px", background: "#3b82f6" }} />
              <span style={{
                color: "#64748b",
                fontFamily: "'Inter', sans-serif",
                fontSize: "8px",
                fontWeight: 500,
                letterSpacing: "0.4em",
              }}>PREMIUM VEHICLE IMPORT</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "360px", height: "1px", background: "rgba(255,255,255,0.08)" }} />

        {/* Compact symbol alone */}
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Символ бренда</p>
          <svg width="56" height="56" viewBox="0 0 44 44" fill="none">
            <rect x="7" y="7" width="30" height="30" rx="4" fill="#2563EB" transform="rotate(45 22 22)"/>
            <text x="22" y="28" textAnchor="middle" fill="white"
              fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" letterSpacing="-1">B</text>
          </svg>
        </div>

        {/* Divider */}
        <div style={{ width: "360px", height: "1px", background: "rgba(255,255,255,0.08)" }} />

        {/* На светлом фоне */}
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>На светлом фоне</p>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl" style={{ background: "#f1f5f9" }}>
            <svg width="34" height="34" viewBox="0 0 44 44" fill="none">
              <rect x="7" y="7" width="30" height="30" rx="4" fill="#2563EB" transform="rotate(45 22 22)"/>
              <text x="22" y="28" textAnchor="middle" fill="white"
                fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="20" letterSpacing="-1">B</text>
            </svg>
            <div className="flex flex-col leading-none gap-1">
              <span style={{ color: "#0f172a", fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 800, letterSpacing: "0.15em" }}>BOVAJA</span>
              <span style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif", fontSize: "7px", fontWeight: 500, letterSpacing: "0.35em" }}>PREMIUM VEHICLE IMPORT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
