# Riaz Interiors — Phase 4

Existing Figma-derived React/Vite site, with corrected TypeScript syntax and an optional Google Sheets + Cloudinary project feed. The original CSS/layout is retained; only project content and optional multi-photo modal controls are dynamic.

## Run locally

1. Install Node.js 22 or newer.
2. Run `npm install`, then `npm run dev`.
3. Open the Vite local URL. With `VITE_PROJECTS_ENABLED=false` (default), the original illustrative concept cards appear; they are **not** real Riaz Interiors projects.
4. Run `npm run build` to check production compilation. **This package has not been build-verified in the generation environment because dependency installation could not complete.**

## Set up Google Sheets (one-time)

1. Create a spreadsheet in your Google Drive. Name its first tab exactly `Projects`.
2. Import `projects-template.csv` or copy the exact header row: `id,title,category,description,cover_image,images,status,featured,sort_order`.
3. For each completed project add a unique `id`, project title, category, description, a Cloudinary `https://res.cloudinary.com/...` cover URL, and optional multiple image URLs separated by a `|` character. Use `Published` or `Draft` in the `status` column; `Yes` or `No` in `featured`. Lower `sort_order` appears first.
4. Do **not** publish the example row: it has a placeholder Cloudinary URL and Draft status.
5. In Google Cloud Console create a project, enable **Google Sheets API**, create a **service account**, and create a JSON key. Keep the key private.
6. In Google Sheets, click Share and give the service account email **Viewer** access to this one spreadsheet. Keep the sheet private.
7. Copy the spreadsheet ID from its URL (`/spreadsheets/d/THIS_PART/edit`).

## Deploy to Vercel (backend and website)

1. Push source to your own private GitHub repository. **Do not commit `.env.local` or any service-account JSON keys.**
2. Import the repository into Vercel as a Vite project. The `api/projects.ts` file is a Vercel serverless function.
3. Add these server environment variables in Vercel settings:
   - `GOOGLE_SHEET_ID`: spreadsheet ID
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: email from the service account JSON
   - `GOOGLE_PRIVATE_KEY`: private_key from the service account JSON (retain newlines or use escaped `\n`)
4. Add frontend build environment variable `VITE_PROJECTS_ENABLED=true`.
5. Redeploy after adding environment variables. Visit `https://YOUR_DOMAIN/api/projects` and check it returns a JSON array. Draft projects should be excluded. Test with a real published Cloudinary image.
6. Confirm that homepage shows only `featured=Yes` projects, up to six, while Projects page shows all published projects.

**Local development:** `npm run dev` runs Vite only, not the Vercel serverless API. Keep `VITE_PROJECTS_ENABLED=false` for the local visual preview, or use `vercel dev` after linking the Vercel project and configuring credentials to test the full integration locally.

**Security:** Google credentials remain on the server. The endpoint is public and returns only published project details. Anyone can view published project titles and images; do not put private client details in published rows. Only HTTPS Cloudinary delivery URLs are accepted. API responses are cached for 5 minutes on Vercel's CDN, so sheet edits may take several minutes to appear.

## Contact form

Phone/WhatsApp: +92 300 2910316. Intended email recipient: sameerriaz69@gmail.com. Email delivery is **not active** until you create a Formspree form, verify that recipient, and set `VITE_FORMSPREE_ENDPOINT` to the provided form endpoint. The contact form offers a prefilled WhatsApp message if email delivery is not configured or fails.

## Important

- The visual design is inherited from the existing Figma-derived source. Exact pixel matching has **not** been verified by browser comparison.
- Google Sheets and Cloudinary integration is **implemented in code**, but cannot return real projects until you configure accounts and deploy the API.
- The example cards remain visible until the live project feed is enabled. When enabled, no example cards will appear, even if the sheet has no published projects.
