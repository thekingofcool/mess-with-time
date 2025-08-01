import '../globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Metadata } from 'next'

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

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as keyof typeof languages
  const t = languages[lang] || languages.en

  return {
    title: t.title,
    description: t.description,
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: '#111827' }
    ]
  }
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}