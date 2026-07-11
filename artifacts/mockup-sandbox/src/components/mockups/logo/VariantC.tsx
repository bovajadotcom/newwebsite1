export function VariantC() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 p-10"
      style={{ background: "#07080f" }}>

      {/* Label */}
      <p className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "#3b82f6" }}>
        Вариант C — Speed Mark
      </p>

      {/* === FULL LOGO === */}
      <div className="flex flex-col items-center gap-8">
        {/* Main logo with split-color B and speed element */}
        <div className="flex items-center gap-0" style={{ position: "relative" }}>
          {/* Speed mark icon */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginRight: "-4px" }}>
            {/* Outer ring arc */}
            <circle cx="24" cy="24" r="20" stroke="#1e3a5f" strokeWidth="1.5" fill="none"/>
            {/* Speed slash lines */}
            <line x1="14" y1="38" x2="24" y2="10" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="22" y1="38" x2="30" y2="18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
            {/* Blue dot */}
            <circle cx="24" cy="10" r="3" fill="#60a5fa"/>
          </svg>

          {/* Wordmark: B in blue, rest white */}
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{
              color: "#3b82f6",
              fontFamily: "'Inter', sans-serif",
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}>B</span>
            <span style={{
              color: "white",
              fontFamily: "'Inter', sans-serif",
              fontSize: "30px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}>OVAJA</span>
          </div>
        </div>

        {/* Thin blue underline accent */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "-10px" }}>
          <div style={{ width: "40px", height: "1.5px", background: "linear-gradient(to right, transparent, #3b82f6)" }}/>
          <span style={{ color: "#475569", fontSize: "8px", letterSpacing: "0.45em", fontWeight: 600, textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
            Auto Import
          </span>
          <div style={{ width: "40px", height: "1.5px", background: "linear-gradient(to left, transparent, #3b82f6)" }}/>
        </div>

        {/* Divider */}
        <div style={{ width: "360px", height: "1px", background: "rgba(255,255,255,0.08)" }} />

        {/* Compact symbol alone */}
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Символ бренда</p>
          <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="#1e3a5f" strokeWidth="1.5" fill="#0d1628"/>
            <line x1="14" y1="38" x2="24" y2="10" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="22" y1="38" x2="30" y2="18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
            <circle cx="24" cy="10" r="3" fill="#60a5fa"/>
          </svg>
        </div>

        {/* Divider */}
        <div style={{ width: "360px", height: "1px", background: "rgba(255,255,255,0.08)" }} />

        {/* На светлом фоне */}
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>На светлом фоне</p>
          <div className="flex items-center gap-1 px-6 py-3 rounded-xl" style={{ background: "#f1f5f9" }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#cbd5e1" strokeWidth="1.5" fill="none"/>
              <line x1="14" y1="38" x2="24" y2="10" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="22" y1="38" x2="30" y2="18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
              <circle cx="24" cy="10" r="3" fill="#60a5fa"/>
            </svg>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ color: "#2563EB", fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 900, letterSpacing: "0.08em" }}>B</span>
              <span style={{ color: "#0f172a", fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 800, letterSpacing: "0.08em" }}>OVAJA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
