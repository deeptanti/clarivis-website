import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  
  if (password === process.env.DASHBOARD_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('portal_auth', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    })
    return response
  }
  
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('portal_auth')
  return response
}
