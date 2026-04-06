import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/portal')) {
    const authCookie = request.cookies.get('portal_auth')
    
    if (!authCookie || authCookie.value !== process.env.DASHBOARD_PASSWORD) {
      if (request.nextUrl.pathname === '/portal/login') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/portal/:path*']
}
