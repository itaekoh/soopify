// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { GoogleAnalytics } from "@/components/google-analytics"
import { AuthProvider } from "@/contexts/auth-context"

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
      <body className="font-sans text-[17px] md:text-[18px]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
