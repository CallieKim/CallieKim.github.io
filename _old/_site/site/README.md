# Callie Y. Kim — Research Portfolio

Editorial + technical single-page portfolio. Paper cream background, Source Serif 4 headlines, Space Mono labels, Inter body. Features an inline block-based robot-programming demo.

## Deploy to GitHub Pages

1. In your `CallieKim.github.io` repo, archive your current files into `_old/` (optional but safe).
2. Copy the contents of this folder to the repo root:
   - `index.html`
   - `styles.css`
   - `app.jsx`
   - `robot-demo.jsx`
   - `publications.jsx`
3. Commit & push. GitHub Pages rebuilds automatically.

## Files

- **index.html** — entry point; loads React + Babel + JSX files from CDN
- **styles.css** — all styling (colors, typography, layout, responsive)
- **app.jsx** — page scaffold (header, rail, hero, sections, footer)
- **robot-demo.jsx** — draggable block-based robot programmer (Section 02)
- **publications.jsx** — publication list (edit the `PUBS` array to update)

## Editing content

- **Your bio & research statement** — `app.jsx` → `Hero` and `ResearchStatement`
- **Publications** — `publications.jsx` → the `PUBS` array at the top
- **Links (Scholar, ORCID, LinkedIn, CV)** — `app.jsx` → `LeftRail` component
- **Contact / socials** — same place, plus `Footer`
- **Photo** — replace the `.avatar-ph` placeholder in `app.jsx` with `<img src="photo.jpg" />` and drop `photo.jpg` in the folder

## Accent color

Edit `styles.css` → `:root { --accent: #3d6b8a; }` for a different color. Signal amber is `--signal`.

## Notes

- The site uses Babel-in-browser to transpile JSX on load (~200ms on first load). Totally fine for a portfolio; if you want faster, migrate to Vite later.
- No build step required — edit JSX, push, done.
- Custom domain: add a `CNAME` file at the repo root with just your domain.
