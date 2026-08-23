'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'

export function SiteChrome({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useLocale()

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[#f4e6c8]/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="display text-2xl tracking-wide text-[#ffaa00]">
            {t.brand}
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/" className="hover:text-[#ff7a00]">
              {t.book}
            </Link>
            <Link href="/admin" className="hover:text-[#ff7a00]">
              {t.admin}
            </Link>
            <div className="flex overflow-hidden rounded-full border border-[#f4e6c8]/25">
              <button
                type="button"
                className={`px-3 py-1 text-xs font-bold ${locale === 'pt' ? 'bg-[#ff7a00] text-black' : ''}`}
                onClick={() => setLocale('pt')}
              >
                PT
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-xs font-bold ${locale === 'en' ? 'bg-[#ff7a00] text-black' : ''}`}
                onClick={() => setLocale('en')}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-6xl px-5 py-10"
      >
        {children}
      </motion.main>

      <footer className="border-t border-[#f4e6c8]/10 px-5 py-8 text-center text-sm text-[#f4e6c8]/70">
        <p>{t.developed}</p>
        <p className="mt-2 flex justify-center gap-4">
          <a href="https://ividi.dev/" className="text-[#ff7a00] hover:text-[#ffaa00]">
            ividi.dev
          </a>
          <a href="https://github.com/VidiPT89/" className="text-[#ff7a00] hover:text-[#ffaa00]">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
