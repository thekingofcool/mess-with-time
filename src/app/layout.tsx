import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata = {
  title: 'Mess with Time',
  description: 'A versatile time conversion and manipulation tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
