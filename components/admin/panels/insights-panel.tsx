// components/admin/panels/insights-panel.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Star, ExternalLink } from "lucide-react"
import { PanelHeader, PanelEmpty, PanelError, PanelLoading } from "@/components/admin/panel-chrome"

type SnPost = {
  id: number
  title: string
  excerpt: string | null
  featured_image_url: string | null
  published_date: string
  is_featured: boolean
  slug: string
  sn_categories: { name: string; slug: string } | null
}

export function InsightsPanel() {
  const [posts, setPosts] = useState<SnPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<number | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/insights", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "글 목록을 불러오지 못했습니다.")
      setPosts(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "글 목록을 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function toggleFeatured(postId: number, currentFeatured: boolean) {
    setPending(postId)
    // 낙관적 업데이트 — 실패하면 되돌린다
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, is_featured: !currentFeatured } : p)),
    )
    try {
      const res = await fetch("/api/admin/insights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, isFeatured: !currentFeatured }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "변경에 실패했습니다.")
      await fetchPosts()
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, is_featured: currentFeatured } : p)),
      )
      setError(err instanceof Error ? err.message : "변경에 실패했습니다.")
    } finally {
      setPending(null)
    }
  }

  const featuredCount = posts.filter((p) => p.is_featured).length

  return (
    <div>
      <PanelHeader
        title="Insights 관리"
        description={
          <>
            Soopnote 블로그 글을 메인 페이지에 노출합니다.
            <Badge variant="secondary" className="ml-2">
              Featured {featuredCount}/6
            </Badge>
          </>
        }
      />

      {error && (
        <div className="mb-4">
          <PanelError message={error} onRetry={fetchPosts} />
        </div>
      )}

      {loading ? (
        <PanelLoading />
      ) : posts.length === 0 ? (
        <PanelEmpty message="발행된 글이 없습니다." />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border bg-card p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {post.featured_image_url ? (
                  <img
                    src={post.featured_image_url}
                    alt=""
                    className="h-32 w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-36"
                  />
                ) : (
                  <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-muted sm:h-24 sm:w-36">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold">{post.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {post.sn_categories && (
                          <Badge variant="outline" className="text-xs">
                            {post.sn_categories.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.published_date).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <Star
                          className={
                            post.is_featured
                              ? "h-4 w-4 fill-yellow-500 text-yellow-500"
                              : "h-4 w-4 text-muted-foreground"
                          }
                        />
                        <Switch
                          checked={post.is_featured}
                          disabled={pending === post.id}
                          onCheckedChange={() => toggleFeatured(post.id, post.is_featured)}
                          aria-label={`${post.title} 노출 전환`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {post.is_featured ? "노출중" : "미노출"}
                      </span>
                    </div>
                  </div>

                  {post.sn_categories?.slug && (
                    <a
                      href={`https://www.soopnote.com/${post.sn_categories.slug}/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Soopnote에서 보기
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
