# Riaz Interiors — Phase 5 (Apps Script integration)

The existing Figma-derived React/CSS layout is unchanged. The project gallery now supports the Google Apps Script endpoint already deployed for Riaz Interiors, with a small Vercel serverless proxy. The proxy normalizes the Google Sheet schema, returns only approved fields for published projects, and accepts only HTTPS Cloudinary image URLs. No Google Cloud service account or billing is required.

## Confirmed source

Google Sheet tab: `Sheet1` with columns `id,title,category,description,image,images,status,featured,sort_order`.

Deployed Apps Script URL is prefilled in `.env.example`. It is a public read-only portfolio endpoint. The endpoint currently returns all columns of published rows; for defense in depth, the Vercel API whitelists fields, but the **original Apps Script URL remains publicly accessible**. Update Apps Script to whitelist fields too before putting confidential columns in the sheet. Never add confidential data to the public projects sheet.

## Run locally

- Install Node.js 22+.
- `npm install`
- `npm run dev` shows the original illustrative project cards while `VITE_PROJECTS_ENABLED=false`.
- `npm run build` checks TypeScript and bundles the website.
- To test the real `/api/projects` endpoint locally, use `vercel dev` after linking a Vercel project and configuring its environment variables. `npm run dev` by itself does not serve Vercel functions.

## Deploy on Vercel

1. Upload the project to the client's GitHub repository and import it into Vercel as a Vite project.
2. In Vercel Project Settings > Environment Variables, add `APPS_SCRIPT_URL` with the deployed `https://script.google.com/macros/s/.../exec` URL from `.env.example` (server-side).
3. Add `VITE_PROJECTS_ENABLED=true` (build-time variable).
4. Redeploy. Visit `https://YOUR_DOMAIN/api/projects`. It should return an array of published projects with valid Cloudinary images.
5. Confirm the Projects gallery and featured homepage cards. New published rows appear after the cache refresh (typically ~5 minutes).

**Note:** The existing sample project has an `image` URL, `status=Published`, `featured=TRUE`, and `sort_order=1`. No change to its sheet headers is needed. Additional gallery images can be put in the `images` column separated by `|`. Keep `Sheet1` as the tab name unless updating the Apps Script constant.

## Important limitations

- The Apps Script deployment has not been independently verified from this container. Test the `/api/projects` endpoint after deploying.
- The contact form email still needs a Formspree endpoint with verified recipient `sameerriaz69@gmail.com`; WhatsApp uses +92 300 2910316.
- Exact pixel-level comparison against Figma has not yet been completed.
- Published project information is public by design. Keep the sheet free of secrets or client-sensitive information.
