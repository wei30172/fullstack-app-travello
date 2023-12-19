// import { NextResponse } from 'next/server'
// import type { NextFetchEvent, NextRequest } from 'next/server'

// import { i18n } from '@/i18n.config'

// import { match as matchLocale } from '@formatjs/intl-localematcher'
// import Negotiator from 'negotiator'
// import { CustomMiddleware } from './chain'

// function getLocale(request: NextRequest): string | undefined {
//   const acceptLanguage = request.headers.get('accept-language')
//   if (!acceptLanguage) {
//     return undefined
//   }

//   const languages = new Negotiator({ headers: { 'accept-language': acceptLanguage } }).languages()
//   return matchLocale(languages, i18n.locales, i18n.defaultLocale)
// }

// export function middleware(request: NextRequest) {}

// export function withI18nMiddleware(middleware: CustomMiddleware) {
//   return async (
//     request: NextRequest,
//     event: NextFetchEvent,
//     response: NextResponse
//   ) => {
//     // 處理 i18n
//     const pathname = request.nextUrl.pathname
//     const pathnameIsMissingLocale = i18n.locales.every(
//       locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//     )

//     // 如果沒有 locale 設定則重定向
//     if (pathnameIsMissingLocale) {
//       const locale = getLocale(request)
//       if (locale) {
//         return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
//       }
//     }

//     return middleware(request, event, response)
//   }
// }