const CATEGORY_CONFIG = {
  "Agriculture":               { color: "#3FB950", bg: "rgba(63,185,80,0.1)",   icon: "🌾" },
  "Health":                    { color: "#F85149", bg: "rgba(248,81,73,0.1)",   icon: "🏥" },
  "Housing":                   { color: "#FF9933", bg: "rgba(255,153,51,0.1)",  icon: "🏠" },
  "Business & Entrepreneurship":{ color: "#A371F7", bg: "rgba(163,113,247,0.1)",icon: "💼" },
  "Girl Child & Women":        { color: "#EC6CB9", bg: "rgba(236,108,185,0.1)", icon: "👩" },
  "Education":                 { color: "#58A6FF", bg: "rgba(88,166,255,0.1)",  icon: "📚" },
  "Labour & Employment":       { color: "#E3B341", bg: "rgba(227,179,65,0.1)",  icon: "⚒️" },
  "Finance & Banking":         { color: "#39D353", bg: "rgba(57,211,83,0.1)",   icon: "🏦" },
  "Pension & Retirement":      { color: "#D29922", bg: "rgba(210,153,34,0.1)",  icon: "👴" },
  "Insurance":                 { color: "#2EA043", bg: "rgba(46,160,67,0.1)",   icon: "🛡️" },
  "Skill Development":         { color: "#1F6FEB", bg: "rgba(31,111,235,0.1)",  icon: "🎓" },
  "Employment":                { color: "#56D364", bg: "rgba(86,211,100,0.1)",  icon: "💼" },
  "Women & Rural":             { color: "#DB61A2", bg: "rgba(219,97,162,0.1)",  icon: "👩‍🌾" },
};

export default function SchemeCard({ scheme, index }) {
  const cfg = CATEGORY_CONFIG[scheme.category] || { color: "#FF9933", bg: "rgba(255,153,51,0.1)", icon: "📋" };
  const matchPct = Math.round(scheme.similarity * 100);

  return (
    <div
      className="animate-fade-in"
      style={{
        animationDelay: `${index * 80}ms`,
        background: "#1C2128",
        border: "1px solid #30363D",
        borderRadius: "12px",
        padding: "20px 24px",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = cfg.color;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#30363D";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: cfg.bg,
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}>
            {cfg.icon}
          </div>
          <div>
            <div style={{
              display: "inline-block",
              background: cfg.bg,
              border: `1px solid ${cfg.color}44`,
              borderRadius: "12px",
              padding: "2px 10px",
              fontSize: "11px",
              color: cfg.color,
              fontFamily: "IBM Plex Mono",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}>
              {scheme.category}
            </div>
            <h3 style={{
              fontFamily: "Space Grotesk",
              fontWeight: 600,
              fontSize: "15px",
              color: "#E6EDF3",
              margin: 0,
              lineHeight: 1.3,
            }}>
              {scheme.name}
            </h3>
          </div>
        </div>

        {/* Match score */}
        <div style={{
          flexShrink: 0,
          textAlign: "center",
          background: matchPct >= 70 ? "rgba(63,185,80,0.1)" : "rgba(255,153,51,0.1)",
          border: `1px solid ${matchPct >= 70 ? "#3FB95044" : "#FF993344"}`,
          borderRadius: "8px",
          padding: "6px 10px",
        }}>
          <div style={{
            fontFamily: "IBM Plex Mono",
            fontWeight: 700,
            fontSize: "16px",
            color: matchPct >= 70 ? "#3FB950" : "#FF9933",
          }}>
            {matchPct}%
          </div>
          <div style={{ fontSize: "10px", color: "#8B949E", fontFamily: "IBM Plex Mono" }}>MATCH</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#30363D", margin: "0 0 14px" }} />

      {/* Benefits */}
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", color: "#8B949E", fontFamily: "IBM Plex Mono", letterSpacing: "0.08em", marginBottom: "6px" }}>
          KEY BENEFIT
        </p>
        <p style={{ fontSize: "14px", color: "#C9D1D9", lineHeight: 1.6, margin: 0 }}>
          {scheme.benefits}
        </p>
      </div>

      {/* How to apply */}
      <div style={{
        background: "#161B22",
        border: "1px solid #30363D",
        borderRadius: "8px",
        padding: "12px 14px",
      }}>
        <p style={{ fontSize: "11px", color: "#8B949E", fontFamily: "IBM Plex Mono", letterSpacing: "0.08em", marginBottom: "6px" }}>
          HOW TO APPLY
        </p>
        <p style={{ fontSize: "13px", color: "#8B949E", lineHeight: 1.6, margin: 0 }}>
          {scheme.how_to_apply}
        </p>
      </div>
    </div>
  );
}