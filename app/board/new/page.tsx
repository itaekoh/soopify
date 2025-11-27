// app/board/new/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Attachment } from "@/lib/supabase"
import { Upload, X, FileText } from "lucide-react"

export default function NewPostPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    } catch (err) {
      router.push("/admin/login")
    } finally {
      setChecking(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "파일 업로드에 실패했습니다.")
        }

        const newAttachment: Attachment = {
          id: Date.now().toString() + Math.random().toString(36),
          name: data.fileName,
          url: data.location,
          size: data.fileSize,
          type: data.fileType,
        }

        setAttachments((prev) => [...prev, newAttachment])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author, attachments }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "공지사항 작성에 실패했습니다.")
      }

      router.push(`/board/${data.post.id}`)
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

  if (!authenticated) {
    return null
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">새 공지사항 작성</CardTitle>
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
                  <Input
                    placeholder="작성자 이름"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    내용
                  </label>
                  <RichTextEditor value={content} onChange={setContent} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    첨부파일
                  </label>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading}
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? "업로드 중..." : "파일 선택"}
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        이미지(5MB), 문서(10MB) 업로드 가능
                      </p>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-md"
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(att.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? "작성 중..." : "공지 작성"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/board")}
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
