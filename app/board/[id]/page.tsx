// app/board/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Post = {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at: string
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPost()
    checkAuth()
  }, [params.id])

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()
      setAuthenticated(data.authenticated || false)
    } catch (err) {
      setAuthenticated(false)
    }
  }

  async function fetchPost() {
    try {
      setLoading(true)
      const res = await fetch(`/api/posts/${params.id}`)
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "공지사항을 찾을 수 없습니다.")
      }

      setPost(data.post)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "공지사항 삭제에 실패했습니다.")
      }

      router.push("/board")
    } catch (err: any) {
      alert(err.message)
      setDeleting(false)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-background">
          <div className="max-w-5xl mx-auto px-4 py-14">
            <p className="text-center text-muted-foreground">로딩 중...</p>
          </div>
        </main>
      </>
    )
  }

  if (error || !post) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-background">
          <div className="max-w-5xl mx-auto px-4 py-14">
            <p className="text-center text-red-600 dark:text-red-400 mb-4">
              {error || "공지사항을 찾을 수 없습니다."}
            </p>
            <div className="text-center">
              <Button onClick={() => router.push("/board")}>목록으로</Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <Button
            variant="outline"
            onClick={() => router.push("/board")}
            className="mb-6"
          >
            ← 목록으로
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                <span>{post.author}</span>
                <span>•</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {authenticated && (
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/board/${post.id}/edit`)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "삭제 중..." : "삭제"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
