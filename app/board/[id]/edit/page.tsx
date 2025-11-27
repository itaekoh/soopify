// app/board/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/rich-text-editor"

type Post = {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at: string
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchPost()
    }
  }, [authenticated, params.id])

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()

      if (!data.authenticated) {
        router.push("/admin/login")
        return
      }

      setAuthenticated(true)
    } catch (err) {
      router.push("/admin/login")
    } finally {
      setChecking(false)
    }
  }

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${params.id}`)
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "공지사항을 찾을 수 없습니다.")
      }

      setPost(data.post)
      setTitle(data.post.title)
      setContent(data.post.content)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "공지사항 수정에 실패했습니다.")
      }

      router.push(`/board/${params.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-background">
          <div className="max-w-5xl mx-auto px-4 py-14">
            <p className="text-center text-muted-foreground">인증 확인 중...</p>
          </div>
        </main>
      </>
    )
  }

  if (!authenticated || !post) {
    return null
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">공지사항 수정</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    제목
                  </label>
                  <Input
                    placeholder="공지사항 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    작성자
                  </label>
                  <Input value={post.author} disabled />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    내용
                  </label>
                  <RichTextEditor value={content} onChange={setContent} />
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? "수정 중..." : "수정 완료"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/board/${params.id}`)}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
