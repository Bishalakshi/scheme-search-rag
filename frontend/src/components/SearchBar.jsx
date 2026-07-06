import { useState } from "react";

const EXAMPLES = [
  "I am a small farmer with 1 hectare of land in rural Maharashtra",
  "I am an unemployed youth who dropped out after Class 10",
  "I am a woman from a BPL family who needs an LPG gas connection",
  "I want to start a small business but need a loan without collateral",
  "I have a daughter aged 5 and want to save for her education",
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const submit = () => {
    if (query.trim().length < 10) return;
    onSearch(query.trim());
  };

  return (
    <div>
      {/* Main search box */}
      <div style={{
        background: "#161B22",
        border: "1px solid #30363D",
        borderRadius: "14px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
      }}
        onFocus={(e) => e.currentTarget.style.borderColor = "#FF9933"}
        onBlur={(e) => e.currentTarget.style.borderColor = "#30363D"}
      >
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Describe your situation... e.g. I am a daily wage worker in rural Bihar with two children looking for health insurance"
          rows={3}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#E6EDF3",
            fontSize: "15px",
            padding: "16px 20px 8px",
            resize: "none",
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.6,
          }}
        />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px 12px",
        }}>
          <span style={{ fontSize: "12px", color: "#8B949E", fontFamily: "IBM Plex Mono" }}>
            {query.length} chars · Press Enter to search
          </span>
          <button
            onClick={submit}
            disabled={loading || query.trim().length < 10}
            style={{
              background: query.trim().length >= 10 ? "linear-gradient(135deg, #FF9933, #FF6600)" : "#21262D",
              color: query.trim().length >= 10 ? "#000" : "#8B949E",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.05em",
              cursor: query.trim().length >= 10 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {loading ? "SEARCHING..." : "SEARCH →"}
          </button>
        </div>
      </div>

      {/* Example chips */}
      <div style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "11px", color: "#8B949E", fontFamily: "IBM Plex Mono", letterSpacing: "0.1em", marginBottom: "10px" }}>
          TRY AN EXAMPLE
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); onSearch(ex); }}
              style={{
                background: "#161B22",
                border: "1px solid #30363D",
                borderRadius: "20px",
                color: "#8B949E",
                fontSize: "12px",
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#FF9933";
                e.target.style.color = "#E6EDF3";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#30363D";
                e.target.style.color = "#8B949E";
              }}
            >
              {ex.length > 48 ? ex.slice(0, 48) + "…" : ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}