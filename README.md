# Quantum Vantage Consciousness Model (QVCM)

This repository publishes the latest draft of the **Quantum Vantage Consciousness Model** and the companion React single-page application that renders the paper, provides a chatbot, and exposes realtime voice controls. The site is deployed through **GitHub Pages** from the repository root, so a fresh production build must be committed whenever the source code or thesis text changes.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- `npm` (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm start
```

The development build serves the React app at `http://localhost:3000/`. The Express proxy used in production is not required for local testing—the development server calls the configured OpenAI endpoints directly.

### Run the unit tests

```bash
npm test -- --watchAll=false
```

## Project Structure

```
├── assets/                 # Production JS/CSS bundles consumed by index.html
├── public/                 # Static assets copied verbatim into the build
├── src/                    # React application source code
├── QVCM.md                 # Canonical Markdown draft of the thesis
├── index.html              # Standalone entry point served by GitHub Pages
├── scripts/post-build.js   # Copies hashed bundles into ./assets after each build
└── docs/                   # Supplementary documentation (deployment, realtime API notes, …)
```

## Updating the Thesis Content

1. Edit `QVCM.md` with the latest manuscript.
2. Run `npm run build` so the markdown and derived assets are embedded into the production bundle.
3. Commit the updated markdown together with the regenerated `assets/` outputs.

The React viewer automatically reloads `QVCM.md` at runtime, so a rebuild is only necessary when the bundling pipeline or styling changes.

## Publishing to GitHub Pages

GitHub Pages hosts the compiled site directly from the default branch. To ship an update:

1. Create a fresh production bundle.
   ```bash
   npm run build
   ```
   The `post-build` script copies the hashed JavaScript and CSS into `assets/` so `index.html` always references stable filenames.
2. Stage the generated artefacts together with any source changes.
   ```bash
   git add assets/script.js assets/style.css index.html public/ src/ QVCM.md
   ```
   (Add any other modified files listed by `git status`.)
3. Commit and push to `main`.
   ```bash
   git commit -m "Build site"
   git push origin main
   ```
4. Wait for GitHub Pages to publish the branch. The site refreshes on the next page load at `https://rodrigowf.github.io/QVCM/` (or your chosen repository slug).

### Renaming the Pages URL

If the repository name changes—for example from `QHCH` to `QVCM`—update the deployment target:

1. In GitHub, open **Settings → General → Repository name** and apply the new slug.
2. Visit **Settings → Pages** and confirm the **Build and deployment** source is set to `main` / `root`.
3. Push a fresh build (`npm run build` followed by `git push`) so GitHub Pages publishes files under the new URL. The runtime metadata script inside `index.html` rewrites the canonical, Open Graph, and Twitter URLs automatically based on `window.location`, so no manual HTML edits are required.
4. Update the `proxy` field in `package.json` if the application needs to call APIs hosted on the same Pages domain.

## Additional Documentation

- [`docs/github-pages.md`](docs/github-pages.md) — extended deployment notes and troubleshooting steps
- [`docs/realtime-model-capabilities.md`](docs/realtime-model-capabilities.md) — realtime voice agent behaviours

## License

Released under the [MIT License](LICENSE).
