
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (q) => {
    setLoading(true);
    setError("");
    setQuery(q);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D1117" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #30363D",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #FF9933, #FF6600)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>🇮🇳</div>
          <div>
            <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "18px", color: "#E6EDF3" }}>
              Scheme<span style={{ color: "#FF9933" }}>Search</span>
            </span>
            <span style={{ marginLeft: "8px", fontSize: "11px", color: "#3FB950", fontFamily: "IBM Plex Mono", letterSpacing: "0.1em" }}>INDIA</span>
          </div>
        </div>
        <span style={{ fontSize: "11px", color: "#8B949E", fontFamily: "IBM Plex Mono", letterSpacing: "0.1em" }}>
          RAG + GEMINI
        </span>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Hero */}
        {!result && !loading && (
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(255,153,51,0.1)",
              border: "1px solid rgba(255,153,51,0.3)",
              borderRadius: "20px",
              padding: "6px 16px",
              marginBottom: "20px",
            }}>
              <span style={{ fontSize: "12px", color: "#FF9933", fontFamily: "IBM Plex Mono", letterSpacing: "0.15em" }}>
                GOVERNMENT SCHEME ELIGIBILITY FINDER
              </span>
            </div>
            <h1 style={{
              fontFamily: "Space Grotesk",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: "#E6EDF3",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}>
              Tell us your situation.<br />
              <span style={{ color: "#FF9933" }}>We'll find your schemes.</span>
            </h1>
            <p style={{ fontSize: "16px", color: "#8B949E", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              Describe yourself in plain language — your occupation, income, location, or specific need.
              Our AI searches 25+ central government schemes and tells you what you qualify for.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "32px" }}>
              {[["25+", "Schemes"], ["Free", "Access"], ["AI", "Powered"]].map(([val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Space Grotesk", fontSize: "22px", fontWeight: 700, color: "#FF9933" }}>{val}</div>
                  <div style={{ fontSize: "12px", color: "#8B949E", fontFamily: "IBM Plex Mono" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div style={{ textAlign: "center", marginTop: "64px" }}>
            <div style={{
              width: "40px", height: "40px",
              border: "3px solid #30363D",
              borderTopColor: "#FF9933",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#8B949E", fontFamily: "IBM Plex Mono", fontSize: "13px", letterSpacing: "0.1em" }}>
              SEARCHING SCHEMES...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "rgba(248,81,73,0.1)",
            border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: "10px",
            color: "#F85149",
            fontSize: "14px",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <Results result={result} query={query} />
      </main>

      <footer style={{
        borderTop: "1px solid #30363D",
        padding: "20px 24px",
        textAlign: "center",
        color: "#8B949E",
        fontSize: "12px",
        fontFamily: "IBM Plex Mono",
      }}>
        For official information, verify at scheme websites or your nearest Common Service Centre (CSC).
      </footer>
    </div>
  );
}