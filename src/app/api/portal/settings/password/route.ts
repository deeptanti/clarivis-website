import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  const { currentPassword, newPassword } = await request.json()

  if (currentPassword !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Invalid current password' }, { status: 401 })
  }

  // Note: In production, DASHBOARD_PASSWORD would need to be updated via Vercel dashboard
  // This confirms the change was requested successfully
  return NextResponse.json({ success: true, note: 'Update DASHBOARD_PASSWORD in Vercel environment variables to complete the change.' })
}
