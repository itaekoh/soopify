// app/board/page.tsx
import { SiteHeader } from "@/components/site-header"
import { BoardList } from "@/components/board-list"

export default function BoardPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <header className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold">공지사항</h1>
            <p className="text-muted-foreground text-[15px]">
              Soopify의 소식과 정보를 공유합니다.
            </p>
          </header>

          <BoardList />
        </div>
      </main>
    </>
  )
}
