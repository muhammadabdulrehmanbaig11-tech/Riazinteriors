import { useEffect, useState } from "react"

export type Project = {
  id: string
  title: string
  category: string
  description: string
  coverImage: string
  images: string[]
  featured: boolean
  isExample?: boolean
}

const configured = import.meta.env.VITE_PROJECTS_ENABLED === "true"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!configured) return
    const controller = new AbortController()
    fetch("/api/projects", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Projects API returned ${response.status}`)
        return (await response.json()) as Project[]
      })
      .then((data) => { if (!Array.isArray(data)) throw new Error("Invalid project data"); setProjects(data) })
      .catch((cause: unknown) => { if (!(cause instanceof DOMException && cause.name === "AbortError")) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  return { projects, loading, error, configured }
}
