# GitHub Pages Deployment Guide

This guide explains how to build, publish, and troubleshoot the QVCM site when it is hosted on GitHub Pages.

## Prerequisites

- Write access to the repository
- Node.js 18+
- `npm`

## 1. Build the site

```bash
npm install           # if dependencies are not installed yet
npm run build
```

The build command runs `react-scripts build` and then copies the hashed bundles into `assets/script.js` and `assets/style.css`. These two files are referenced from `index.html`, which is served directly by GitHub Pages.

## 2. Commit the artefacts

```bash
git add assets/script.js assets/style.css index.html public/ src/ QVCM.md
git commit -m "Build site"
```

You may have additional changes (for example, edits to markdown or configuration). Use `git status` to confirm everything that should ship is staged.

## 3. Push to the publishing branch

```bash
git push origin main
```

Pages is configured to deploy from the `main` branch and the repository root. Every push triggers a new publication. The updated site is typically live within a minute at `https://<username>.github.io/<repository>/`.

## 4. Verify the deployment target

If the site does not refresh, confirm the repository settings:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, ensure the source is **Deploy from a branch** with **Branch: main** and **Folder: /(root)**.
3. If you change the repository name, repeat the build-and-push process so the new URL receives the latest files.

## 5. Update the repository slug (optional)

When renaming the project (for example, from `QHCH` to `QVCM`):

1. Change the repository name under **Settings → General → Repository name**.
2. Visit **Settings → Pages** to confirm the configuration still points to `main` / `root`.
3. Push a fresh build. The runtime metadata in `index.html` automatically adjusts canonical and social tags to the new URL.
4. Update bookmarks or documentation that reference the previous address.

## Troubleshooting

| Symptom | Cause | Resolution |
| --- | --- | --- |
| Page shows outdated content | Build artefacts not committed | Re-run `npm run build`, stage the updated files, and push again. |
| 404 at new URL after rename | No files published under the new slug | Push any commit to `main` after the rename to trigger a fresh deployment. |
| Styles or scripts missing | `assets/style.css` or `assets/script.js` absent | Ensure the `post-build` script ran and that both files are committed. |
| Local dev cannot reach APIs | `proxy` points to old Pages domain | Update the `proxy` field in `package.json` to the current GitHub Pages URL. |

## Useful Commands

- Clean install + build in one go:
  ```bash
  npm ci && npm run build
  ```
- Run tests before deploying:
  ```bash
  npm test -- --watchAll=false
  ```

## References

- [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages)
- [Create React App deployment guide](https://create-react-app.dev/docs/deployment/#github-pages)
