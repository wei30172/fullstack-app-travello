import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
// import { Locale, i18n } from '@/i18n.config'
import { CustomMiddleware } from './chain'
import { matchesPath } from './matchesPath'

const protectedPaths = [
  "/board/:path*",
  "/boards",
  "/profile",
  "/change-password",
  "/billing"
]

const publicPaths = [
  "/signin",
  "/signup",
  "/"
]

const memberPaths = [
  "/board/:path*",
  "/boards"
]

// function getProtectedRoutes(protectedPaths: string[], locales: Locale[]) {
//   let protectedPathsWithLocale = [...protectedPaths]

//   protectedPaths.forEach(route => {
//     locales.forEach(
//       locale =>
//         (protectedPathsWithLocale = [
//           ...protectedPathsWithLocale,
//           `/${locale}${route}`
//         ])
//     )
//   })

//   return protectedPathsWithLocale
// }

export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()

    const token = await getToken({ req: request })

    // @ts-ignore
    request.nextauth = request.nextauth || {}
    // @ts-ignore
    request.nextauth.token = token
    const pathname = request.nextUrl.pathname

    // const protectedPathsWithLocale = getProtectedRoutes(protectedPaths, [
    //   ...i18n.locales
    // ])

    const isBoardPath = matchesPath(pathname, '/board/:path*')
    
    // If accessing a protected path without token, redirect to login
    const isProtectedPath = protectedPaths.some(path => matchesPath(pathname, path))
    if (!token && isProtectedPath) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If there is a token and the public path is accessed, redirect to /boards
    if (token && publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/boards', request.url))
    }

    // Attempt to access member path but role is not member, redirect to /billing
    // const isMemberPath = memberPaths.some(path => matchesPath(pathname, path))
    // if (token?.role !== "member" && isMemberPath) {
    //   return NextResponse.redirect(new URL('/billing', request.url));
    // }

    return middleware(request, event, response)
  }
}