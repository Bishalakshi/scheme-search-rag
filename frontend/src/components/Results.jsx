import SchemeCard from "./SchemeCard";

export default function Results({ result, query }) {
  if (!result) return null;

  return (
    <div className="animate-fade-in" style={{ marginTop: "40px" }}>

      {/* Query echo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "24px",
      }}>
        <div style={{ height: "1px", flex: 1, background: "#30363D" }} />
        <p style={{
          fontSize: "12px",
          color: "#8B949E",
          fontFamily: "IBM Plex Mono",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}>
          RESULTS FOR "{query.length > 60 ? query.slice(0, 60) + "…" : query}"
        </p>
        <div style={{ height: "1px", flex: 1, background: "#30363D" }} />
      </div>

      {/* AI answer box */}
      <div style={{
        background: "#161B22",
        border: "1px solid rgba(255,153,51,0.4)",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow accent */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #FF9933, #FF6600, transparent)",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "rgba(255,153,51,0.15)",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>✨</div>
          <span style={{ fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#FF9933", letterSpacing: "0.15em" }}>
            AI ANALYSIS
          </span>
        </div>

        <div style={{
          fontSize: "15px",
          color: "#C9D1D9",
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
          fontFamily: "Inter, sans-serif",
        }}>
          {result.answer}
        </div>
      </div>

      {/* Scheme cards */}
      {result.schemes.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#8B949E", letterSpacing: "0.1em" }}>
              MATCHED SCHEMES
            </span>
            <div style={{
              background: "rgba(255,153,51,0.15)",
              border: "1px solid rgba(255,153,51,0.3)",
              borderRadius: "10px",
              padding: "2px 10px",
              fontSize: "12px",
              color: "#FF9933",
              fontFamily: "IBM Plex Mono",
            }}>
              {result.schemes.length}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {result.schemes.map((scheme, i) => (
              <SchemeCard key={scheme.id} scheme={scheme} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        marginTop: "32px",
        padding: "14px 18px",
        background: "rgba(31,111,235,0.08)",
        border: "1px solid rgba(31,111,235,0.2)",
        borderRadius: "10px",
        fontSize: "12px",
        color: "#8B949E",
        lineHeight: 1.6,
        fontFamily: "Inter, sans-serif",
      }}>
        ℹ️ This is AI-generated guidance based on publicly available scheme information. Always verify eligibility and application details at official scheme websites or your nearest Common Service Centre (CSC).
      </div>
    </div>
  );
}