import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supportedLanguages = ['en', 'zh', 'es', 'fr', 'de', 'ru']
const defaultLanguage = 'en'

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname

  // If the pathname is just '/', redirect to the default language
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLanguage}`, request.url))
  }

  // Check if the pathname starts with a supported language
  const pathnameIsMissingValidLanguage = supportedLanguages.every(
    (lang) => !pathname.startsWith(`/${lang}`)
  )

  // If the pathname doesn't start with a supported language, redirect to the default language
  if (pathnameIsMissingValidLanguage) {
    return NextResponse.redirect(
      new URL(`/${defaultLanguage}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}