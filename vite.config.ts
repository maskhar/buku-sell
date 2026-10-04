import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'dwc-html-metadata',
      transformIndexHtml(html: string) {
        const env = loadEnv(mode, process.cwd(), 'VITE_')
        const token = (process.env.VITE_GOOGLE_SITE_VERIFICATION ?? env.VITE_GOOGLE_SITE_VERIFICATION)?.trim()
        const socialProofMode = process.env.VITE_SOCIAL_PROOF_MODE ?? env.VITE_SOCIAL_PROOF_MODE
        const page = socialProofMode === 'demo'
          ? html.replace('name="robots" content="index, follow, max-image-preview:large"', 'name="robots" content="noindex, nofollow"')
          : html
        if (!token) return page
        if (!/^[A-Za-z0-9_-]+$/.test(token)) throw new Error('Invalid Google site verification token')
        return page.replace('</head>', `    <meta name="google-site-verification" content="${token}" />\n  </head>`)
      },
    },
  ],
  server: {
    allowedHosts: ['buku.dadikwahyuchang.id', 'dadikwahyuchang.id'],
  },
  preview: {
    allowedHosts: ['buku.dadikwahyuchang.id', 'dadikwahyuchang.id'],
  },
  build: { sourcemap: false },
}))
