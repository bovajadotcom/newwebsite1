export function VariantA() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 p-10"
      style={{ background: "#07080f" }}>

      {/* Label */}
      <p className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "#3b82f6" }}>
        Вариант A — Double Chevron
      </p>

      {/* === FULL LOGO === */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          {/* Icon: blue rounded square with >> */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill="#2563EB"/>
            <path d="M11 30L19 22L11 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 30L30 22L22 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M31 22H33" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>

          {/* Wordmark */}
          <div className="flex flex-col leading-none gap-1">
            <span style={{
              color: "white",
              fontFamily: "'Inter', sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}>BOVAJA</span>
            <span style={{
              color: "#3b82f6",
              fontFamily: "'Inter', sans-serif",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.35em",
            }}>AUTO IMPORT</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "320px", height: "1px", background: "rgba(255,255,255,0.08)" }} />

        {/* Compact symbol alone */}
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Символ бренда</p>
          <svg width="52" height="52" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill="#2563EB"/>
            <path d="M11 30L19 22L11 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 30L30 22L22 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M31 22H33" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Divider */}
        <div style={{ width: "320px", height: "1px", background: "rgba(255,255,255,0.08)" }} />

        {/* On light background */}
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "#475569", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>На светлом фоне</p>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl" style={{ background: "#f1f5f9" }}>
            <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="10" fill="#2563EB"/>
              <path d="M11 30L19 22L11 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 30L30 22L22 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M31 22H33" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-col leading-none gap-0.5">
              <span style={{ color: "#0f172a", fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 800, letterSpacing: "0.12em" }}>BOVAJA</span>
              <span style={{ color: "#2563EB", fontFamily: "'Inter', sans-serif", fontSize: "8px", fontWeight: 600, letterSpacing: "0.3em" }}>AUTO IMPORT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
