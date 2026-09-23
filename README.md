# agentrange.com

The Agent Range marketing site — a single-page React app (Vite 8, React 19)
that renders the wordmark, tagline and contact address as animated ASCII art on
an SVG character grid, plus two plain static pages — the privacy policy and a
404.

```
frontend/          the app (Vite)
  src/             React components + the ASCII art data
  public/          files copied verbatim into the build: privacy.html,
                   404.html, favicon.svg, icons.svg, pentapus.ico
docs/superpowers/  the original design spec and build plan (historical —
                   they describe a Flask host that no longer exists)
```

There is no backend. The site is 100% static: everything it serves comes out of
`frontend/dist`.

## Local development

Requires Node **22.16.0** or newer (see [Node version](#node-version)).

```bash
cd frontend
npm ci
npm run dev        # http://localhost:5173, hot reload
```

Other scripts:

```bash
npm run lint       # eslint
npm run build      # production build into frontend/dist
npm run preview    # serve the built frontend/dist, as production will
```

`npm run preview` is the way to check a production build locally. It serves the
real build output — including `privacy.html`, `404.html` and the hashed asset
files — rather
than the dev server's on-the-fly transforms, so it is what to use before
shipping anything that touches the build.

## Deployment — Cloudflare Pages

The site is built and served by Cloudflare Pages. Every push to `main` triggers
a production deploy; pushes to any other branch get a preview deploy at a
`*.pages.dev` URL.

Enter these settings in the Cloudflare dashboard (Workers & Pages → the project
→ Settings → Build):

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None (or "Vite") |
| **Root directory** | **`frontend`** |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Node version | `22.16.0`, from `.node-version` |

Two of those are easy to get wrong:

- **Root directory must be `frontend`.** `package.json` is not at the repo root.
  If this is left blank the build fails immediately with "no package.json
  found".
- **Build output directory is `dist`, not `frontend/dist`.** It is resolved
  relative to the root directory set above.

No environment variables and no secrets are required. The build needs no
credentials of any kind; if the Pages project ever asks for one, something is
wrong.

Cloudflare also runs its own dependency install before the build command, so
`npm run build` alone would work. `npm ci && npm run build` is specified anyway
because it is self-contained: the same command reproduces the deploy on any
machine, and `npm ci` installs strictly from `package-lock.json` instead of
resolving fresh versions.

### Node version

Pinned to **22.16.0** by `.node-version`, which Cloudflare Pages reads to choose
the Node in its build image. Pinning it means a Pages build-image update cannot
change the Node the site is built with without somebody editing this repo.

**Pin only a version the build image already carries.** The image installs Node
through asdf/node-build from definitions baked in when the image was built, and
it cannot reach GitHub to fetch newer ones. An earlier pin of `24.21.0` failed
every build with `node-build: definition not found: 24.21.0`. 22.16.0 is the
version the image ships by default, so it always resolves. Before raising this
pin, push the change to a branch and confirm the preview deployment builds.

The file is committed at both the repo root and in `frontend/` deliberately.
Cloudflare's documented lookup is the project root, but this project sets a
custom root directory, and a failed production deploy is a bad way to discover
which of the two it actually consults. Keep the two files in step.

`frontend/package.json` carries a matching `engines` range (`>=22.16.0`) so a
local install on an older Node warns. It only warns — `engine-strict` is not
set — so it will not block anyone mid-task.

### Routing

**This site needs no SPA fallback, and one must not be added.**

The app does not use client-side routing. There is no router dependency
(`package.json` lists only `react` and `react-dom`) and `src/App.jsx` renders a
fixed tree with no route matching. The only navigation away from `/` is the
footer link to `/privacy`, which is a full page load of the real file
`frontend/public/privacy.html`.

Pages strips the `.html` extension and serves that file at `/privacy`, so
requesting `/privacy.html` directly answers `308 → /privacy`. The footer links
straight at `/privacy` to skip that hop; old links to `/privacy.html` keep
working through the redirect.

A `_redirects` file containing `/* /index.html 200` — the usual Vite-on-Pages
reflex — would be actively harmful here: it would shadow `privacy.html` and
serve the React app in its place. Do not add one.

Unknown paths are served `frontend/public/404.html` with a real HTTP 404 status.
Pages picks that file up automatically — it needs no configuration and does not
affect `privacy.html`. It is a hand-written static page: no build step, no
external requests.

### Asset paths

`vite.config.js` does not set `base`, so the build emits root-absolute asset
references (`/assets/index-<hash>.js`). That is correct for this site, which is
served from the root of its own domain — leave it alone. `base` would only need
changing if the site ever moved under a sub-path (`example.com/site/`).
