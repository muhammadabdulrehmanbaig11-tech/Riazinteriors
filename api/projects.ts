import type { IncomingMessage, ServerResponse } from "node:http"

type RawProject = Record<string, unknown>
const approvedFields = ["id", "title", "category", "description", "image", "images", "status", "featured", "sort_order"] as const

function cloudinaryUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return ""
  try {
    const url = new URL(value.trim())
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && /^\/[^/]+\/image\/upload\/.+/.test(url.pathname) ? url.href : ""
  } catch { return "" }
}

function isFeatured(value: unknown): boolean {
  return value === true || value === 1 || (typeof value === "string" && ["true", "yes", "1"].includes(value.trim().toLowerCase()))
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
  if (request.method !== "GET") {
    response.writeHead(405).end(JSON.stringify({ error: "Method not allowed" }))
    return
  }
  const endpoint = process.env.APPS_SCRIPT_URL
  if (!endpoint) {
    response.writeHead(503).end(JSON.stringify({ error: "Projects API not configured" }))
    return
  }
  try {
    const source = new URL(endpoint)
    if (source.protocol !== "https:" || source.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(source.pathname)) {
      throw new Error("Invalid Apps Script deployment URL")
    }
    const upstream = await fetch(source, { signal: AbortSignal.timeout(12000), redirect: "follow" })
    if (!upstream.ok) throw new Error(`Apps Script returned ${upstream.status}`)
    const payload: unknown = await upstream.json()
    if (!payload || typeof payload !== "object" || !Array.isArray((payload as { projects?: unknown }).projects)) {
      throw new Error("Invalid Apps Script response")
    }
    const projects = ((payload as { projects: RawProject[] }).projects)
      .filter((p): p is RawProject => !!p && typeof p === "object" && !Array.isArray(p))
      .map((p) => {
        const safe = Object.fromEntries(approvedFields.map((field) => [field, p[field]]))
        const coverImage = cloudinaryUrl(safe.image)
        const images = (Array.isArray(safe.images) ? safe.images : String(safe.images ?? "").split("|"))
          .map(cloudinaryUrl).filter(Boolean)
        return {
          id: String(safe.id ?? "").trim(), title: String(safe.title ?? "").trim(),
          category: String(safe.category ?? "").trim(), description: String(safe.description ?? "").trim(),
          coverImage, images: images.length ? [coverImage, ...images.filter((image) => image !== coverImage)] : [coverImage],
          status: String(safe.status ?? "").trim().toLowerCase(), featured: isFeatured(safe.featured),
          order: Number(safe.sort_order) || 0,
        }
      })
      .filter((p) => p.id && p.title && p.coverImage && p.status === "published")
      .sort((a, b) => a.order - b.order)
      .map(({ status: _status, order: _order, ...project }) => project)
    response.writeHead(200).end(JSON.stringify(projects))
  } catch (error) {
    console.error("Project feed error:", error instanceof Error ? error.message : "Unknown error")
    response.writeHead(502).end(JSON.stringify({ error: "Unable to load projects" }))
  }
}
