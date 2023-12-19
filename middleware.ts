import { chain } from '@/middlewares/chain'
import { withAuthMiddleware } from '@/middlewares/middleware1'

export default chain([withAuthMiddleware])

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}