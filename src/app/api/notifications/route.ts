import { NextRequest, NextResponse } from 'next/server'

// Mock database for notifications (in production, use actual database)
const notifications: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Filter notifications for user
    let filteredNotifications = notifications.filter((n) => n.user_id === userId)

    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter((n) => !n.is_read)
    }

    // Sort by created_at (newest first)
    filteredNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({ notifications: filteredNotifications })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, message, type, link } = body

    // Validate required fields
    if (!user_id || !title || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create notification
    const notification = {
      id: crypto.randomUUID(),
      user_id,
      title,
      message,
      type,
      link,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    notifications.push(notification)

    // TODO: Send push notification
    // TODO: Send email notification

    return NextResponse.json(
      { notification, success: true },
      { status: 201 }
    )
  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, is_read } = body

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID required' },
        { status: 400 }
      )
    }

    // Update notification
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.is_read = is_read
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
