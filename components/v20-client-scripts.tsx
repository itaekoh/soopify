// components/v20-client-scripts.tsx
"use client"

import { useEffect } from "react"

export function V20ClientScripts() {
  useEffect(() => {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggle')
    if (themeBtn) {
      const sun = themeBtn.querySelector('[data-icon="sun"]')
      const moon = themeBtn.querySelector('[data-icon="moon"]')

      function syncIcons() {
        const isDark = document.documentElement.classList.contains('dark')
        // In dark mode, show sun (switch to light). In light mode, show moon (switch to dark).
        if (sun) sun.classList.toggle('hidden', !isDark)
        if (moon) moon.classList.toggle('hidden', isDark)
      }

      themeBtn.addEventListener('click', function () {
        const isDark = document.documentElement.classList.contains('dark')
        document.documentElement.classList.toggle('dark', !isDark)
        try {
          localStorage.setItem('theme', !isDark ? 'dark' : 'light')
        } catch (e) {}
        syncIcons()
      })

      syncIcons()
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn')
    const mobileMenu = document.getElementById('mobileMenu')

    function setOpen(open: boolean) {
      if (!mobileMenu || !mobileMenuBtn) return
      mobileMenu.classList.toggle('hidden', !open)
      mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
      mobileMenuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기')
    }

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden')
        setOpen(!isOpen)
      })

      // Close when clicking a link
      mobileMenu.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (target && target.tagName === 'A') setOpen(false)
      })

      // Close on resize to md+
      const handleResize = () => {
        if (window.innerWidth >= 768) setOpen(false)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Image loader with placeholder
  useEffect(() => {
    const encodeSvgDataUri = (svg: string) =>
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg).replace(/%0A/g, '')

    function photoLikePlaceholder(kind: string, w = 1600, h = 1000) {
      const themes: Record<string, { a: string, b: string, c: string, t: string }> = {
        dashboard: { a: '#0b1220', b: '#111827', c: '#1f2937', t: 'Dashboard Preview' },
        lifecycle: { a: '#0b1220', b: '#111827', c: '#0f172a', t: 'Lifecycle Plan' },
        operations: { a: '#0b1220', b: '#111827', c: '#0f172a', t: 'Field → Record → Compare' },
        school: { a: '#0b3b2e', b: '#0f5132', c: '#134e4a', t: 'School Forest' },
        street: { a: '#0f172a', b: '#111827', c: '#1f2937', t: 'Street Trees' },
        apartment: { a: '#1f2937', b: '#111827', c: '#0f172a', t: 'Apartment Complex' },
        hero: { a: '#0b3b2e', b: '#0f172a', c: '#111827', t: 'Soopify' },
      }
      const th = themes[kind] || themes.hero

      const sceneContent = kind === 'dashboard' || kind === 'lifecycle' || kind === 'operations' ? `
        <g opacity="0.92">
          <rect x="${w * 0.06}" y="${h * 0.10}" width="${w * 0.88}" height="${h * 0.80}" rx="40" fill="#0b1220" opacity="0.55"/>
          <rect x="${w * 0.08}" y="${h * 0.12}" width="${w * 0.84}" height="${h * 0.76}" rx="36" fill="#ffffff" opacity="0.08"/>
          <rect x="${w * 0.10}" y="${h * 0.18}" width="${w * 0.35}" height="${h * 0.05}" rx="14" fill="#ffffff" opacity="0.12"/>
          <rect x="${w * 0.10}" y="${h * 0.26}" width="${w * 0.55}" height="${h * 0.03}" rx="12" fill="#ffffff" opacity="0.10"/>
          <rect x="${w * 0.10}" y="${h * 0.34}" width="${w * 0.26}" height="${h * 0.22}" rx="26" fill="#ffffff" opacity="0.08"/>
          <rect x="${w * 0.39}" y="${h * 0.34}" width="${w * 0.26}" height="${h * 0.22}" rx="26" fill="#ffffff" opacity="0.08"/>
          <rect x="${w * 0.68}" y="${h * 0.34}" width="${w * 0.24}" height="${h * 0.22}" rx="26" fill="#ffffff" opacity="0.08"/>
          <rect x="${w * 0.10}" y="${h * 0.60}" width="${w * 0.82}" height="${h * 0.24}" rx="26" fill="#ffffff" opacity="0.08"/>
        </g>
      ` : `
        <path d="M0 ${h * 0.72} C ${w * 0.20} ${h * 0.64}, ${w * 0.45} ${h * 0.80}, ${w} ${h * 0.70} L ${w} ${h} L 0 ${h} Z" fill="#000000" opacity="0.35"/>
        <g opacity="0.35">
          <rect x="${w * 0.62}" y="${h * 0.28}" width="${w * 0.10}" height="${h * 0.40}" rx="14" fill="#000000"/>
          <rect x="${w * 0.74}" y="${h * 0.22}" width="${w * 0.12}" height="${h * 0.46}" rx="14" fill="#000000"/>
          <rect x="${w * 0.88}" y="${h * 0.30}" width="${w * 0.08}" height="${h * 0.38}" rx="14" fill="#000000"/>
        </g>
        <g opacity="0.42">
          <circle cx="${w * 0.18}" cy="${h * 0.48}" r="${h * 0.13}" fill="#000000"/>
          <circle cx="${w * 0.28}" cy="${h * 0.50}" r="${h * 0.10}" fill="#000000"/>
          <circle cx="${w * 0.40}" cy="${h * 0.52}" r="${h * 0.12}" fill="#000000"/>
          <rect x="${w * 0.175}" y="${h * 0.56}" width="${w * 0.02}" height="${h * 0.22}" rx="8" fill="#000000"/>
          <rect x="${w * 0.275}" y="${h * 0.58}" width="${w * 0.02}" height="${h * 0.22}" rx="8" fill="#000000"/>
          <rect x="${w * 0.395}" y="${h * 0.60}" width="${w * 0.02}" height="${h * 0.22}" rx="8" fill="#000000"/>
        </g>
      `

      return encodeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg-${kind}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${th.a}"/>
      <stop offset="0.6" stop-color="${th.b}"/>
      <stop offset="1" stop-color="${th.c}"/>
    </linearGradient>
    <radialGradient id="haze-${kind}" cx="30%" cy="20%" r="80%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette-${kind}" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </radialGradient>
    <filter id="noise-${kind}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.14 0"/>
    </filter>
    <filter id="soft-${kind}">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg-${kind})"/>
  <rect width="100%" height="100%" fill="url(#haze-${kind})"/>
  ${sceneContent}
  <g filter="url(#soft-${kind})" opacity="0.35">
    <circle cx="${w * 0.18}" cy="${h * 0.20}" r="${h * 0.12}" fill="#ffffff"/>
    <circle cx="${w * 0.76}" cy="${h * 0.18}" r="${h * 0.10}" fill="#ffffff"/>
    <circle cx="${w * 0.86}" cy="${h * 0.62}" r="${h * 0.12}" fill="#ffffff"/>
  </g>
  <rect width="100%" height="100%" filter="url(#noise-${kind})" opacity="0.55"/>
  <rect width="100%" height="100%" fill="url(#vignette-${kind})"/>
  <g opacity="0.70">
    <rect x="${w * 0.06}" y="${h * 0.08}" width="${w * 0.42}" height="${h * 0.08}" rx="18" fill="#000000" opacity="0.28"/>
    <text x="${w * 0.08}" y="${h * 0.135}" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.045)}" font-weight="700" fill="#ffffff">${th.t}</text>
    <text x="${w * 0.08}" y="${h * 0.18}" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.022)}" font-weight="600" fill="#ffffff" opacity="0.75">Photo-like placeholder • Replace via data-src</text>
  </g>
</svg>`)
    }

    function mountMedia() {
      const nodes = document.querySelectorAll('img.js-media')
      nodes.forEach(img => {
        const kind = img.getAttribute('data-kind') || 'hero'
        const real = (img.getAttribute('data-src') || '').trim()

        if (real) {
          ;(img as HTMLImageElement).src = real
          return
        }

        const isWide = img.closest('.aspect-\\[16\\/10\\]') || img.closest('.aspect-\\[16\\/9\\]')
        const w = isWide ? 1600 : 1200
        const h = isWide ? 1000 : 900
        ;(img as HTMLImageElement).src = photoLikePlaceholder(kind, w, h)
      })
    }

    mountMedia()
  }, [])

  return null
}
