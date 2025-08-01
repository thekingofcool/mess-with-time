'use client'

import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' }
]

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mess with Time</h1>
        
        <div className="flex items-center gap-4">
          <select
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            onChange={(e) => router.push(`/${e.target.value}`)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}