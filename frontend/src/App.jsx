import AsciiSvg from "./AsciiSvg";
import RoamingPentapus from "./RoamingPentapus";
import { TITLE_ART, TAGLINE_ART, EMAIL_ART } from "./asciiData";

function App() {
  return (
    <div className="app">
      <RoamingPentapus />
      <AsciiSvg lines={TITLE_ART} />
      <AsciiSvg lines={TAGLINE_ART} rainbow={false} maxWidth={480} className="tagline" />
      <a href="mailto:info@agentrange.com" style={{ textDecoration: "none", marginTop: "1.5rem" }}>
        <AsciiSvg lines={EMAIL_ART} rainbow={false} maxWidth={320} />
      </a>
      <footer
        style={{
          position: "fixed",
          bottom: "1rem",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: "0.75rem",
        }}
      >
        <a href="/privacy.html" style={{ color: "#666", textDecoration: "none" }}>
          privacy policy
        </a>
      </footer>
    </div>
  );
}

export default App;
