// app/admin/insights/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { V20ClientScripts } from "@/components/v20-client-scripts"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Star, ExternalLink } from "lucide-react"

type SnPost = {
  id: number
  title: string
  excerpt: string | null
  featured_image_url: string | null
  published_date: string
  is_featured: boolean
  slug: string
  sn_categories: {
    name: string
    slug: string
  } | null
}

export default function InsightsManagement() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [posts, setPosts] = useState<SnPost[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()

      if (!data.authenticated) {
        router.push("/admin/login")
        return
      }

      setAuthenticated(true)
      fetchPosts()
    } catch (err) {
      router.push("/admin/login")
    } finally {
      setChecking(false)
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/insights")
      const data = await res.json()
      setPosts(data.data || [])
    } catch (err) {
      console.error("Failed to fetch posts:", err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleFeatured(postId: number, currentFeatured: boolean) {
    try {
      const res = await fetch("/api/admin/insights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          isFeatured: !currentFeatured,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to update")
        return
      }

      // 성공시 목록 다시 조회
      fetchPosts()
    } catch (err) {
      console.error("Failed to toggle featured:", err)
      alert("업데이트에 실패했습니다.")
    }
  }

  if (checking) {
    return (
      <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <V20ClientScripts />
        <AdminHeader />
        <main className="min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <p className="text-center text-slate-600 dark:text-slate-300">인증 확인 중...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  const featuredCount = posts.filter((p) => p.is_featured).length

  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <V20ClientScripts />
      <AdminHeader />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <div className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Insights 관리</h1>
            <p className="text-lg text-slate-700 dark:text-slate-200 mt-4">
              Soopnote 블로그 글을 메인 페이지에 노출합니다.
              <Badge variant="secondary" className="ml-3">
                Featured: {featuredCount}/6
              </Badge>
            </p>
          </div>

          {loading ? (
            <p className="text-center text-slate-600 dark:text-slate-300 py-12">로딩 중...</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article key={post.id} className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
                  <div className="p-0">
                    <div className="flex gap-6">
                      {/* 썸네일 */}
                      <div className="flex-shrink-0">
                        {post.featured_image_url ? (
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-40 h-28 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-40 h-28 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* 글 정보 */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              {post.sn_categories && (
                                <Badge variant="outline" className="text-xs">
                                  {post.sn_categories.name}
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {new Date(post.published_date).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                            {post.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          {/* Featured 토글 */}
                          <div className="flex items-center gap-3 ml-4">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <Star
                                  className={`h-4 w-4 ${
                                    post.is_featured ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                  }`}
                                />
                                <Switch
                                  checked={post.is_featured}
                                  onCheckedChange={() => toggleFeatured(post.id, post.is_featured)}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {post.is_featured ? "노출중" : "미노출"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <a
                            href={post.sn_categories?.slug ? `https://www.soopnote.com/${post.sn_categories.slug}/${post.id}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Soopnote에서 보기
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {posts.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-slate-600 dark:text-slate-300">발행된 글이 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
