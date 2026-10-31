import { createSign } from "node:crypto"
import type { IncomingMessage, ServerResponse } from "node:http"

type SheetRow = string[]
const columns = ["id", "title", "category", "description", "cover_image", "images", "status", "featured", "sort_order"] as const

function cloudinaryUrl(value: string) {
  if (!value) return ""
  try {
    const url = new URL(value)
    // Restrict images to HTTPS Cloudinary delivery URLs, preventing arbitrary embeds.
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && url.pathname.startsWith("/") ? url.href : ""
  } catch { return "" }
}

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url")
}

async function accessToken(email: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000)
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const payload = encodeBase64Url(JSON.stringify({ iss: email, scope: "https://www.googleapis.com/auth/spreadsheets.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }))
  const unsigned = `${header}.${payload}`
  const signer = createSign("RSA-SHA256")
  signer.update(unsigned)
  const assertion = `${unsigned}.${encodeBase64Url(signer.sign(privateKey))}`
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  })
  if (!response.ok) throw new Error("Google authentication failed")
  const data = await response.json() as { access_token: string }
  return data.access_token
}

export default async function handler(_request: IncomingMessage, response: ServerResponse) {
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
  if (_request.method !== "GET") { response.writeHead(405); response.end(JSON.stringify({ error: "Method not allowed" })); return }
  const { GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    response.writeHead(503); response.end(JSON.stringify({ error: "Project feed not configured" })); return
  }
  try {
    const token = await accessToken(GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"))
    const range = encodeURIComponent("Projects!A:I")
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(GOOGLE_SHEET_ID)}/values/${range}`
    const result = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!result.ok) throw new Error(`Google Sheets returned ${result.status}`)
    const data = await result.json() as { values?: SheetRow[] }
    const [header = [], ...rows] = data.values ?? []
    if (columns.some((column, index) => header[index]?.trim().toLowerCase() !== column)) throw new Error("Sheet headers do not match template")
    const projects = rows.map((row) => {
      const [id, title, category, description, cover, imageList, status, featured, order] = row.map(v => (v ?? "").trim())
      const coverImage = cloudinaryUrl(cover)
      const images = (imageList ?? "").split("|").map(v => cloudinaryUrl(v.trim())).filter(Boolean)
      return { id, title, category, description, coverImage, images: images.length ? images : [coverImage], status, featured: featured?.toLowerCase() === "yes", order: Number(order) || 0 }
    }).filter(p => p.id && p.title && p.coverImage && p.status?.toLowerCase() === "published")
      .sort((a, b) => a.order - b.order)
      .map(({ status: _status, order: _order, ...project }) => project)
    response.writeHead(200); response.end(JSON.stringify(projects))
  } catch (error) {
    console.error("Project feed error:", error instanceof Error ? error.message : "Unknown error")
    response.writeHead(502); response.end(JSON.stringify({ error: "Unable to load projects" }))
  }
}
