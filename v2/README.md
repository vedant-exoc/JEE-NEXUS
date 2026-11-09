# JEE NEXUS V2 preview

## Run with VS Code Live Server

1. Open this repository branch in VS Code or download it from GitHub using the branch selector.
2. Open the **`v2` folder** in VS Code (or open the repo and locate `v2/index.html`).
3. Install the **Live Server** extension if it is not installed.
4. Right-click **`v2/index.html`** and choose **Open with Live Server**.
5. The app opens at a local address, usually `http://127.0.0.1:5500/v2/`.
6. Click **Explore demo preview** to inspect the dashboard and navigate the sample workspaces.

## Files connected for the local preview

- `index.html` loads `./style.css`, then `./config.js`, then `./app.js`.
- `config.js` contains only blank public Supabase configuration placeholders. No secrets belong here.
- `app.js` powers navigation, demo records, search/filter, add/complete/delete interactions, and the sample dashboard.
- `style.css` supplies the V2 responsive visual design.

Keep all four files in the same `v2/` folder. This preview does not require Netlify, a build step, or a backend service.

## Scope and limitations

This is a **front-end preview using temporary sample data**, not a configured secure cloud deployment. Login, invitation validation, password reset, admin controls, email alerts, and cloud sync are intentionally not represented as working features. Do not enter real credentials or study data. The demo sample records reset when the page is refreshed.

The V2 preview does not register a service worker, use a PWA manifest, or implement offline support. V1 files at the repository root have not been changed by this preview update.
