'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const defaultLocale = 'en'
const locales = ['en', 'zh', 'es']

function getLocale() {
  if (typeof window === 'undefined') return defaultLocale
  
  const userLanguage = navigator.language.toLowerCase()
  const matchedLocale = locales.find(l => userLanguage.startsWith(l))
  return matchedLocale || defaultLocale
}

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const locale = getLocale()
    router.replace(`/${locale}`)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  )
}