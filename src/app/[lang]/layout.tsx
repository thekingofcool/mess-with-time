import '../globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Metadata, Viewport } from 'next'

const languages = {
  en: {
    title: 'Mess with Time',
    description: 'A versatile time conversion and manipulation tool'
  },
  zh: {
    title: '时间转换工具',
    description: '功能强大的时间转换和处理工具'
  },
  es: {
    title: 'Juega con el Tiempo',
    description: 'Una herramienta versátil para la conversión y manipulación del tiempo'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ]
}

export function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as keyof typeof languages
  const t = languages[lang] || languages.en

  return {
    title: t.title,
    description: t.description,
  }
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { lang: string }
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const lang = params.lang as keyof typeof languages

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}