# A 3-D Themed Portfolio

My portfolio is a house you can walk through. Built with React Three Fiber, it runs
entirely in the browser and deploys as a static site to GitHub Pages.

## Explore

| Room | What's inside |
| --- | --- |
| **Entrance Hall** | Typed hero intro, wayfinding signs + a waving robot (my future AI twin) |
| **Living Room** | Skills — bookshelf (languages), workstation (GenAI/agentic AI), cabinet (backend & cloud) — plus a jukebox |
| **Gallery** | **ANIMESH·TV** — fullscreen project carousel (the only project display), a metro-map journey wall, and a laptop that boots "Animesh XP" with my links |
| **Kitchen** | "Let's cook something together" contact recipe card, resume on the fridge + an idea corkboard for pitching collabs |
| **Workshop** | What I'm building right now — whiteboard + bench, driven by `current.json` |
| **Balcony** | A telescope that fetches programming jokes from the stars |

**Desktop:** click to grab the camera · `WASD` walk · `Shift` run · `E` interact · `Esc` frees the cursor
**Mobile:** tap the glowing portal discs to move between rooms · swipe to look around

## Stack

- [Vite](https://vitejs.dev) + React 18 + TypeScript
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) (Three.js)
- [zustand](https://github.com/pmndrs/zustand) for state, Tailwind CSS for the 2D UI
- No backend: contact form posts to Getform, jokes come from JokeAPI (safe-mode)

The house itself is **procedural** — walls, furniture and lighting are all Three.js
primitives, so there are no heavy model downloads (JS bundle ≈ 330 KB gzip). Real
`.glb` props can be dropped into `public/models/` — see `src/scene/props/GltfProp.tsx`.

## Updating content

All portfolio data lives in `src/data/*.json`:

- `profile.json` — name, typed roles, bio, socials, resume path
- `skills.json` — skill categories; each category's `prop` field binds it to a piece of furniture
- `projects.json` — every project becomes a channel on ANIMESH·TV (optional `github`, `live` URL for a LIVE badge, `proprietary` for client work)
- `journey.json` — career timeline; drives both the metro-map wall art and its detail panel
- `current.json` — work-in-progress list; drives the workshop whiteboard and panel
- `music.json` — jukebox playlist (MP3s go in `public/music/`)
- `config.json` — form endpoint, joke API, mobile waypoint graph

Editing the JSON updates both the 3D scene and the overlay panels. See `CLAUDE.md` for
architecture invariants, deployment gotchas and the full contributor guide.

## Develop & deploy

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Pushing to `master`/`main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages (repo Settings → Pages → Source: **GitHub Actions**).

> ⚠️ `vite.config.ts` sets `base: '/Portfolio/'` — it must match the repo name.
