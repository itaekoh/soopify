// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { GoogleAnalytics } from "@/components/google-analytics"
import { AdminModalProvider } from "@/components/admin/admin-modal-provider"
import { AdminModal } from "@/components/admin/admin-modal"

// 파비콘은 app/icon.png, app/favicon.ico, app/apple-icon.png 파일 컨벤션으로
// 처리한다(파일 컨벤션이 metadata.icons보다 우선하므로 중복 선언하지 않는다).
// 세 파일 모두 scripts/build-brand-assets.mjs 가 생성한다.
export const metadata: Metadata = {
  openGraph: {
    siteName: "Soopify",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/images/soopify-og.jpg", width: 1200, height: 630, alt: "Soopify" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/soopify-og.jpg"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldDark = stored ? stored === 'dark' : prefersDark;
                  document.documentElement.classList.toggle('dark', shouldDark);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      {/* bg/text 를 body 에 둔다. 예전에는 app/page.tsx 의 래퍼 div 에만
          있어서, 그 밖에 마운트되는 AdminModal 이 색을 물려받지 못했다.
          다크모드에서 배경은 어두운데 글자는 브라우저 기본 검정이 되어
          관리자 화면 글씨가 보이지 않았다. */}
      <body className="bg-background font-sans text-[17px] text-foreground md:text-[18px]">
        <AdminModalProvider>
          {children}
          <AdminModal />
        </AdminModalProvider>
      </body>
    </html>
  )
}
