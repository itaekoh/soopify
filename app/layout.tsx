// app/layout.tsx
import "./globals.css"
import { GoogleAnalytics } from "@/components/google-analytics"
import { AuthProvider } from "@/contexts/auth-context"

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
