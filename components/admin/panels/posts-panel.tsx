// components/admin/panels/posts-panel.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react"
import { PanelHeader, PanelEmpty, PanelError, PanelLoading } from "@/components/admin/panel-chrome"
import { useAdminModal } from "@/components/admin/admin-modal-provider"

type Post = {
  id: string
  title: string
  author: string | null
  created_at: string
}

export function PostsPanel() {
  const router = useRouter()
  const { closeModal } = useAdminModal()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/posts?page=1&limit=50", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "공지사항을 불러오지 못했습니다.")
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "공지사항을 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  /** 에디터는 별도 페이지라서 모달을 닫고 이동한다. */
  function goto(href: string) {
    closeModal()
    router.push(href)
  }

  async function handleDelete(post: Post) {
    if (!window.confirm(`"${post.title}" 공지를 삭제할까요? 되돌릴 수 없습니다.`)) return
    setDeleting(post.id)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || "삭제에 실패했습니다.")
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <PanelHeader
        title="공지사항 관리"
        description={`총 ${posts.length}건`}
        action={
          <button
            onClick={() => goto("/board/new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background transition hover:opacity-90"
          >
            <PlusCircle className="h-4 w-4" />새 공지
          </button>
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
        <PanelEmpty message="등록된 공지사항이 없습니다." />
      ) : (
        <ul className="divide-y rounded-2xl border">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{post.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {post.author || "Soopify"} ·{" "}
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => goto(`/board/${post.id}`)}
                  aria-label={`${post.title} 보기`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button
                  onClick={() => goto(`/board/${post.id}/edit`)}
                  aria-label={`${post.title} 수정`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  disabled={deleting === post.id}
                  aria-label={`${post.title} 삭제`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        글 작성·수정은 리치 에디터가 필요해서 별도 페이지로 이동합니다.
      </p>
    </div>
  )
}
