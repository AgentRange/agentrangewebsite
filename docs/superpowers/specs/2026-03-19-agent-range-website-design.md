# Agent Range Website — Design Spec

## Overview

A single-page website for Agent Range that is 100% ASCII art rendered as SVG. The page displays the company name in large FIGlet-style ASCII art with a static rainbow gradient, the "pentapus" logo, a tagline, and a contact email. An animated pentapus roams the page on a fixed path, attracted to the user's mouse cursor.

## Visual Layout

The page is black with all content centered vertically and horizontally. Top to bottom:

1. **"Agent Range" in large FIGlet ASCII art** — using the "Big" FIGlet font style, rendered as SVG text elements at exact character coordinates. Static rainbow gradient applied per-character column (red → orange → yellow → green → blue → purple, left to right). The exact rendered ASCII art will be hardcoded in the source (not generated at runtime).

2. **Pentapus ASCII art** — the company logo rendered as SVG, also rainbow-colored. This is the static centered version; a second animated copy roams the page (see Animation).

3. **"...a range of agents"** — ASCII-style text, smaller than the title. Rendered in SVG.

4. **"info@agentrange.com"** — normal HTML text (not ASCII art) with a `mailto:info@agentrange.com` link. Light color on black background.

## The Pentapus

ASCII art representation of the logo — a five-legged creature (the name "pentapus" = penta + octopus). Rounded head with eyes, no mouth:

```
    _____
   /     \
  (  • •  )
   \_____/
  / | | | \
```

Note: The exact character spacing will be finalized during SVG implementation using the original logo image (`Screenshot 2026-03-01 at 4.32.16 PM.png`) as the authoritative reference.

This appears both as a static element in the center layout and as an animated element that moves around the page.

## ASCII Art Rendering

All ASCII art is rendered as SVG, not `<pre>` tags. Each character is placed at exact x/y coordinates using a monospace character grid. This ensures:

- Pixel-perfect alignment regardless of screen size
- No font rendering inconsistencies
- Smooth scaling via SVG viewBox — the art scales to fit the viewport width
- Works identically on desktop, tablet, and mobile

The SVG uses a `viewBox` sized to the character grid dimensions. Character cell size: 10px wide × 18px tall (standard monospace proportions). The SVG element is set to `width: 100%; max-width: 960px` so it scales responsively and doesn't stretch absurdly on ultrawide monitors.

## Rainbow Gradient

Static per-character-column rainbow. Characters in the same column share a hue. The hue is computed as: `hue = (columnIndex / totalColumns) * 360`. This produces a smooth left-to-right rainbow across the full ASCII art block.

Applied to: the "Agent Range" title and the pentapus logo.

The tagline and email use a simpler treatment — white or light gray.

## Animation: Roaming Pentapus

A copy of the pentapus ASCII art (rendered as a small SVG element) moves around the page:

- **Path:** A fixed rectangular loop defined as waypoints at percentage-based positions relative to the viewport: top-left (10%, 10%) → top-right (90%, 10%) → bottom-right (90%, 90%) → bottom-left (10%, 90%) → back to top-left. This traces the page perimeter. Waypoints scale with viewport size.
- **Speed:** ~60px per second — slow, ambient drift. Not frantic.
- **Roaming pentapus size:** Approximately 40% the size of the static centered pentapus.
- **Roaming pentapus color:** Same rainbow gradient as the static version (no separate color alpha — the element-level opacity handles it).
- **Mouse interaction:** Attraction radius of 200px. Within that radius, the pentapus is pulled toward the cursor with a force proportional to `1 - (distance / 200)`. When the mouse stops moving or leaves the radius, the pentapus returns to its path position with a damping factor of 0.95 per frame (smooth ease-back). Implemented via linear interpolation between current position and path position.
- **Mobile:** No mouse, so the pentapus simply follows its fixed loop path. Touch events are ignored (no attraction behavior on touch).
- **Z-index:** The roaming pentapus renders behind the main content so it doesn't obscure the title/tagline.
- **Opacity:** 0.6 so it feels like a background element.

## Responsiveness

- SVG `viewBox` handles scaling — no media query breakpoints needed for the ASCII art itself.
- On very narrow screens (mobile), the SVG scales down proportionally. The art may become small but remains perfectly aligned.
- The email link and any HTML text use standard responsive sizing.
- The roaming pentapus path scales with the viewport dimensions.

## Tech Stack

### Frontend (React + Vite)

- **Framework:** React 18+ with Vite as the build tool
- **Structure:** Single `App` component with:
  - An SVG element for the static ASCII art (title + pentapus + tagline)
  - A separate positioned SVG element for the roaming pentapus
  - HTML for the email link
  - Animation logic using `requestAnimationFrame` for the pentapus movement
  - Mouse event listeners on the document for cursor tracking
- **Dependencies:** React, ReactDOM, Vite. No other libraries needed.
- **Build output:** Static files in `frontend/dist/`

### Backend (Flask)

- **Framework:** Flask
- **Purpose:** Serve the built React static files. No API routes.
- **Routes:**
  - `GET /` — serves `index.html` from the React build
  - `GET /<path:filename>` — serves static assets (JS, CSS, etc.) from the React build
- **Dependencies:** Flask only

### Project Structure

```
agentrangewebsite/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component — SVG ASCII art + animation
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Minimal global styles (black bg, reset)
│   ├── index.html           # Vite HTML entry
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py               # Flask app — serves static files
│   └── requirements.txt     # Flask dependency
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-19-agent-range-website-design.md
```

## Testing

- **Visual:** Manual check that ASCII art renders correctly at various viewport sizes
- **Animation:** Manual check that pentapus moves on path and responds to mouse
- **Link:** Verify mailto link works
- **Mobile:** Check responsive scaling in browser dev tools
- **Flask:** Verify Flask serves the built React app correctly

## Running the App

### Development

During development, use the Vite dev server directly (port 5173). Flask is not needed for development.

```bash
cd frontend && npm install && npm run dev
# Open http://localhost:5173
```

### Production

Build the frontend, then run Flask to serve it:

```bash
cd frontend && npm run build
cd ../backend && pip install -r requirements.txt && flask run --port 5000
# Open http://localhost:5000
```

## Out of Scope

- No database
- No authentication
- No API endpoints
- No analytics
- No SEO meta tags beyond basics
- No additional pages
