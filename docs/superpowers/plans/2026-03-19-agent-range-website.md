# Agent Range Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page ASCII art website for Agent Range with SVG-rendered text, rainbow gradient, and an animated roaming pentapus.

**Architecture:** React + Vite frontend with all ASCII art rendered as SVG `<text>` elements on a character grid. Animation via `requestAnimationFrame`. Flask backend serves the production build as static files.

**Tech Stack:** React 18, Vite, Flask, plain CSS

**Spec:** `docs/superpowers/specs/2026-03-19-agent-range-website-design.md`
**Logo reference:** `Screenshot 2026-03-01 at 4.32.16 PM.png`

---

## File Structure

```
frontend/
├── src/
│   ├── App.jsx              # Root component — composes all sections + roaming pentapus
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles (black bg, reset, email link)
│   ├── asciiData.js         # Hardcoded ASCII art strings (title, pentapus, tagline)
│   ├── AsciiSvg.jsx         # Reusable: renders a 2D char array as SVG with rainbow
│   ├── RoamingPentapus.jsx  # Animated pentapus with path + mouse attraction
│   └── useMousePosition.js  # Hook: tracks mouse position on document
├── index.html
├── package.json
└── vite.config.js

backend/
├── app.py
└── requirements.txt
```

---

### Task 1: Scaffold the frontend project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/index.css`

- [ ] **Step 1: Initialize Vite + React project**

```bash
cd /Users/bjt/Documents/agentrangewebsite
npm create vite@latest frontend -- --template react
```

- [ ] **Step 2: Strip boilerplate**

```bash
rm -f frontend/src/App.css
rm -rf frontend/src/assets/
```

Replace `frontend/src/App.jsx` with:

```jsx
function App() {
  return (
    <div className="app">
      <h1>Agent Range</h1>
    </div>
  );
}

export default App;
```

Replace `frontend/src/index.css` with:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  overflow-x: hidden;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}
```

Update `frontend/src/main.jsx` to only import `index.css` (remove App.css import if present).

- [ ] **Step 3: Verify it runs**

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 — should show "Agent Range" in white on black.

- [ ] **Step 4: Commit**

```bash
git init
git add frontend/ docs/
git commit -m "feat: scaffold frontend with Vite + React"
```

---

### Task 2: Create the ASCII art data

**Files:**
- Create: `frontend/src/asciiData.js`

- [ ] **Step 1: Create asciiData.js with the FIGlet title**

The "Agent Range" title uses the "Big" FIGlet font. The pentapus matches the logo image. Each art piece is stored as an array of strings (one per row).

```js
// Big FIGlet font for "Agent Range"
export const TITLE_ART = [
  "                    _     _____                       ",
  "    /\\              | |   |  __ \\                      ",
  "   /  \\   __ _  ___ | |_  | |__) |__ _ _ __   __ _  ___",
  "  / /\\ \\ / _` |/ _ \\| __| |  _  // _` | '_ \\ / _` |/ _ \\",
  " / ____ \\ (_| |  __/| |_  | | \\ \\ (_| | | | | (_| |  __/",
  "/_/    \\_\\__, |\\___| \\__| |_|  \\_\\__,_|_| |_|\\__, |\\___|",
  "          __/ |                                __/ |     ",
  "         |___/                                |___/      ",
];

// Pentapus logo — reference: Screenshot 2026-03-01 at 4.32.16 PM.png
// Exact spacing to be refined visually against the original logo
export const PENTAPUS_ART = [
  "    _____    ",
  "   /     \\   ",
  "  (  • •  )  ",
  "   \\_____/   ",
  "  / | | | \\  ",
];

export const TAGLINE_ART = [
  "...a range of agents",
];
```

- [ ] **Step 2: Verify import works**

Temporarily import `TITLE_ART` in `App.jsx` and `console.log` it. Check browser console shows the array.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/asciiData.js
git commit -m "feat: add hardcoded ASCII art data for title, pentapus, tagline"
```

---

### Task 3: Build the AsciiSvg component

**Files:**
- Create: `frontend/src/AsciiSvg.jsx`

- [ ] **Step 1: Create AsciiSvg.jsx**

This component takes an array of strings and renders each character as an SVG `<text>` element at grid coordinates. It applies a rainbow gradient per column.

```jsx
const CELL_W = 10;
const CELL_H = 18;

function charToHue(colIndex, totalCols) {
  return (colIndex / totalCols) * 360;
}

export default function AsciiSvg({ lines, rainbow = true, className = "" }) {
  const rows = lines.length;
  const cols = Math.max(...lines.map((l) => l.length));
  const width = cols * CELL_W;
  const height = rows * CELL_H;

  const chars = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const ch = lines[r][c];
      if (ch === " ") continue;
      const hue = rainbow ? charToHue(c, cols) : 0;
      const fill = rainbow ? `hsl(${hue}, 100%, 65%)` : "#ccc";
      chars.push(
        <text
          key={`${r}-${c}`}
          x={c * CELL_W}
          y={r * CELL_H + 14}
          fill={fill}
          fontFamily="monospace"
          fontSize="16"
        >
          {ch}
        </text>
      );
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: 960 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {chars}
    </svg>
  );
}
```

- [ ] **Step 2: Wire it into App.jsx**

```jsx
import AsciiSvg from "./AsciiSvg";
import { TITLE_ART, PENTAPUS_ART, TAGLINE_ART } from "./asciiData";

function App() {
  return (
    <div className="app">
      <AsciiSvg lines={TITLE_ART} />
      <AsciiSvg lines={PENTAPUS_ART} />
      <AsciiSvg lines={TAGLINE_ART} rainbow={false} />
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
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:5173. Should see:
- Rainbow "Agent Range" FIGlet art
- Rainbow pentapus
- White/gray tagline
- Gray email link

Check that resizing the browser window scales the SVGs proportionally without breaking alignment.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/AsciiSvg.jsx frontend/src/App.jsx
git commit -m "feat: add AsciiSvg component with rainbow gradient rendering"
```

---

### Task 4: Refine the pentapus ASCII art against the logo

**Files:**
- Modify: `frontend/src/asciiData.js`

- [ ] **Step 1: Compare rendered pentapus to the logo**

Open the logo image (`Screenshot 2026-03-01 at 4.32.16 PM.png`) side by side with the browser. The pentapus has NO mouth — just a head with eyes. Adjust character spacing in `PENTAPUS_ART` until it matches:
- `_____` flat top of head
- `/     \` upper sides of head
- `(  • •  )` wide body with eyes centered inside
- `\_____/` bottom of head
- `/ | | | \` five legs splayed outward

The current `PENTAPUS_ART` in `asciiData.js` is the starting point. Compare the SVG render to the PNG logo and tweak spacing (add/remove spaces between characters) until the proportions match. Example adjustment:

```js
export const PENTAPUS_ART = [
  "    _____      ",
  "   /     \\     ",
  "  (  • •  )    ",
  "   \\_____/     ",
  "  / | | | \\    ",
];
```

- [ ] **Step 2: Verify visually**

Reload browser, compare to logo image. Iterate until satisfied.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/asciiData.js
git commit -m "fix: refine pentapus ASCII art spacing to match logo"
```

---

### Task 5: Add the mouse position hook

**Files:**
- Create: `frontend/src/useMousePosition.js`

- [ ] **Step 1: Create useMousePosition.js**

```js
import { useState, useEffect } from "react";

export default function useMousePosition() {
  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    function handleMove(e) {
      setPos({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return pos;
}
```

- [ ] **Step 2: Verify it works**

Temporarily use the hook in `App.jsx` and render the coordinates on screen. Move mouse, confirm values update.

- [ ] **Step 3: Remove the temporary debug display and commit**

```bash
git add frontend/src/useMousePosition.js
git commit -m "feat: add useMousePosition hook for cursor tracking"
```

---

### Task 6: Build the RoamingPentapus component

**Files:**
- Create: `frontend/src/RoamingPentapus.jsx`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Create RoamingPentapus.jsx**

This component renders a small pentapus SVG that moves along a rectangular loop and is attracted to the mouse cursor.

```jsx
import { useRef, useEffect, useState } from "react";
import { PENTAPUS_ART } from "./asciiData";
import useMousePosition from "./useMousePosition";

const CELL_W = 10;
const CELL_H = 18;
const SPEED = 60; // px per second
const ATTRACTION_RADIUS = 200;
const DAMPING = 0.95;

function getWaypoints() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return [
    { x: w * 0.1, y: h * 0.1 },
    { x: w * 0.9, y: h * 0.1 },
    { x: w * 0.9, y: h * 0.9 },
    { x: w * 0.1, y: h * 0.9 },
  ];
}

export default function RoamingPentapus() {
  const mouse = useMousePosition();
  const posRef = useRef({ x: window.innerWidth * 0.1, y: window.innerHeight * 0.1 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const waypointIndexRef = useRef(0);
  const progressRef = useRef(0);
  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    function tick(time) {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const waypoints = getWaypoints();
      const idx = waypointIndexRef.current;
      const next = (idx + 1) % waypoints.length;
      const from = waypoints[idx];
      const to = waypoints[next];

      const segDx = to.x - from.x;
      const segDy = to.y - from.y;
      const segLen = Math.sqrt(segDx * segDx + segDy * segDy);
      if (segLen === 0) return;

      progressRef.current += (SPEED * dt) / segLen;
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        waypointIndexRef.current = next;
      }

      const t = progressRef.current;
      const pathX = from.x + segDx * t;
      const pathY = from.y + segDy * t;

      // Mouse attraction
      if (mouse.x >= 0 && mouse.y >= 0) {
        const dx = mouse.x - pathX;
        const dy = mouse.y - pathY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < ATTRACTION_RADIUS) {
          const force = 1 - dist / ATTRACTION_RADIUS;
          offsetRef.current.x += dx * force * 0.02;
          offsetRef.current.y += dy * force * 0.02;
        }
      }

      // Dampen offset back to zero
      offsetRef.current.x *= DAMPING;
      offsetRef.current.y *= DAMPING;

      posRef.current.x = pathX + offsetRef.current.x;
      posRef.current.y = pathY + offsetRef.current.y;

      setRenderPos({ x: posRef.current.x, y: posRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouse]);

  const rows = PENTAPUS_ART.length;
  const cols = Math.max(...PENTAPUS_ART.map((l) => l.length));
  const artW = cols * CELL_W;
  const artH = rows * CELL_H;

  const chars = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < PENTAPUS_ART[r].length; c++) {
      const ch = PENTAPUS_ART[r][c];
      if (ch === " ") continue;
      const hue = (c / cols) * 360;
      chars.push(
        <text
          key={`${r}-${c}`}
          x={c * CELL_W}
          y={r * CELL_H + 14}
          fill={`hsl(${hue}, 100%, 65%)`}
          fontFamily="monospace"
          fontSize="16"
        >
          {ch}
        </text>
      );
    }
  }

  // 40% of static size
  const scale = 0.4;
  const displayW = artW * scale;
  const displayH = artH * scale;

  return (
    <svg
      style={{
        position: "fixed",
        left: renderPos.x - displayW / 2,
        top: renderPos.y - displayH / 2,
        width: displayW,
        height: displayH,
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${artW} ${artH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {chars}
    </svg>
  );
}
```

- [ ] **Step 2: Add RoamingPentapus to App.jsx**

```jsx
import AsciiSvg from "./AsciiSvg";
import RoamingPentapus from "./RoamingPentapus";
import { TITLE_ART, PENTAPUS_ART, TAGLINE_ART } from "./asciiData";

function App() {
  return (
    <div className="app">
      <RoamingPentapus />
      <AsciiSvg lines={TITLE_ART} />
      <AsciiSvg lines={PENTAPUS_ART} />
      <AsciiSvg lines={TAGLINE_ART} rainbow={false} />
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
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:5173. Should see:
- The pentapus drifting slowly around the edges of the page
- Moving the mouse near it should pull it toward the cursor
- Stopping mouse movement should let it drift back to its path
- It should render behind the main content at 60% opacity

- [ ] **Step 4: Verify mobile behavior**

Open browser dev tools, toggle device emulation (e.g., iPhone). The roaming pentapus should loop on its path with no attraction behavior (since there's no mouse). Touch events should not trigger attraction.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/RoamingPentapus.jsx frontend/src/App.jsx
git commit -m "feat: add roaming pentapus animation with mouse attraction"
```

---

### Task 7: Set up the Flask backend

**Files:**
- Create: `backend/app.py`
- Create: `backend/requirements.txt`

- [ ] **Step 1: Create requirements.txt**

```
flask==3.1.0
```

- [ ] **Step 2: Create app.py**

```python
import os
from flask import Flask, send_from_directory

DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

app = Flask(__name__, static_folder=DIST_DIR, static_url_path="")


@app.route("/")
def index():
    return send_from_directory(DIST_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(DIST_DIR, path)


if __name__ == "__main__":
    app.run(port=5000)
```

- [ ] **Step 3: Build frontend and test Flask serving**

```bash
cd /Users/bjt/Documents/agentrangewebsite/frontend && npm run build
cd /Users/bjt/Documents/agentrangewebsite/backend && pip install -r requirements.txt && flask run --port 5000
```

Open http://localhost:5000 — should see the full site identical to the Vite dev server.

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: add Flask backend to serve production build"
```

---

### Task 8: Final polish and verification

**Files:**
- Modify: `frontend/src/index.css` (if needed)
- Modify: `frontend/src/App.jsx` (if needed)

- [ ] **Step 1: Check responsive scaling**

Open browser dev tools, test at:
- Desktop: 1440px wide
- Tablet: 768px wide
- Mobile: 375px wide

Verify SVG art scales proportionally and stays centered at all sizes.

- [ ] **Step 2: Verify mailto link**

Click `info@agentrange.com` — should open email client.

- [ ] **Step 3: Verify animation on different viewport sizes**

Resize window. Confirm roaming pentapus adjusts its path to the new viewport dimensions.

- [ ] **Step 4: Add .gitignore**

Create `.gitignore` at project root:

```
node_modules/
frontend/dist/
__pycache__/
*.pyc
.superpowers/
```

- [ ] **Step 5: Final commit**

```bash
git add .gitignore
git commit -m "chore: add gitignore and complete initial site"
```
