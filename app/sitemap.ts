// app/sitemap.ts
import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/board`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.1 },
  ]

  // DB 조회가 실패해도(빌드 시점 등) 정적 라우트는 나가야 하므로 삼킨다.
  const { data: posts } = await supabase
    .from("posts")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .then(
      (res) => res,
      () => ({ data: null }),
    )

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${SITE_URL}/board/${post.id}`,
    lastModified: post.created_at ? new Date(post.created_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.3,
  }))

  return [...staticRoutes, ...postRoutes]
}
