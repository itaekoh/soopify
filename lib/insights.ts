// lib/insights.ts
import { supabase } from "@/lib/supabase"

export type Insight = {
  id: number
  title: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  published_date: string
  category_id: number
  slug: string
  sn_categories: { slug: string } | null
}

/** 랜딩(InsightsSection)과 /api/insights 가 같은 조회를 쓴다. */
export async function getFeaturedInsights(limit: number): Promise<Insight[]> {
  const { data, error } = await supabase
    .from("sn_posts")
    .select(
      "id, title, excerpt, content, featured_image_url, published_date, category_id, slug, sn_categories(slug)",
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_date", { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []) as unknown as Insight[]
}
