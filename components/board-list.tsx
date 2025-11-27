// components/board-list.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Post = {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at: string
}

export function BoardList() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [authenticated, setAuthenticated] = useState(false)

  const limit = 10

  useEffect(() => {
    fetchPosts()
    checkAuth()
  }, [page])

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()
      setAuthenticated(data.authenticated || false)
    } catch (err) {
      setAuthenticated(false)
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true)
      const res = await fetch(`/api/posts?page=${page}&limit=${limit}`)
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "게시글 조회에 실패했습니다.")
      }

      setPosts(data.posts)
      setTotal(data.total)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  function stripHtml(html: string): string {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">아직 공지사항이 없습니다.</p>
        <Badge variant="outline">첫 번째 공지를 작성해보세요!</Badge>
      </div>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* 글쓰기 버튼 (관리자만) */}
      {authenticated && (
        <div className="flex justify-end">
          <Button onClick={() => router.push("/board/new")}>
            글쓰기
          </Button>
        </div>
      )}

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/board/${post.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {stripHtml(post.content)}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                onClick={() => setPage(p)}
                className="w-10"
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
