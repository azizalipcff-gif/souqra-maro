import { NextRequest, NextResponse } from 'next/server'

// Mock database for messages (in production, use actual database)
const messages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Filter messages based on user
    let filteredMessages = messages.filter(
      (m) => m.sender_id === userId || m.receiver_id === userId
    )

    if (conversationId) {
      filteredMessages = filteredMessages.filter(
        (m) => m.conversation_id === conversationId
      )
    }

    // Sort by created_at
    filteredMessages.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    return NextResponse.json({ messages: filteredMessages })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sender_id, receiver_id, content } = body

    // Validate required fields
    if (!sender_id || !receiver_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create message
    const message = {
      id: crypto.randomUUID(),
      sender_id,
      receiver_id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    messages.push(message)

    // TODO: Emit socket event for real-time delivery
    // TODO: Send notification to receiver

    return NextResponse.json(
      { message, success: true },
      { status: 201 }
    )
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
