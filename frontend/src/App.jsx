import AsciiSvg from "./AsciiSvg";
import RoamingPentapus from "./RoamingPentapus";
import { TITLE_ART, TAGLINE_ART } from "./asciiData";

function App() {
  return (
    <div className="app">
      <RoamingPentapus />
      <AsciiSvg lines={TITLE_ART} />
      <AsciiSvg lines={TAGLINE_ART} rainbow={false} maxWidth={480} />
      <a
        href="mailto:info@agentrange.com"
        style={{
          color: "#aaa",
          marginTop: "1.5rem",
          fontSize: "1rem",
          textDecoration: "none",
        }}
      >
        info@agentrange.com
      </a>
    </div>
  );
}

export default App;
