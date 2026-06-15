import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe payments not yet implemented' },
    { status: 501 }
  )
}
