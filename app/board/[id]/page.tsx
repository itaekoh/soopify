// app/board/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Attachment } from "@/lib/supabase"
import { FileText, Download } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Post = {
  id: string
  title: string
  content: string
  author: string
  attachments?: Attachment[]
  created_at: string
  updated_at: string
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { authenticated } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  async function fetchPost() {
    try {
      setLoading(true)
      const res = await fetch(`/api/posts/${params.id}`, {
        next: { revalidate: 60 },
      })
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

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
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
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.attachments && post.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    첨부파일 ({post.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {post.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {att.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(att.size)}
                            </p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

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
