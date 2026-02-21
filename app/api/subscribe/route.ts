import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Invalid email address.' },
        { status: 400 }
      )
    }

    const sanitized = email.trim().toLowerCase().slice(0, 254)

    const apiKey = process.env.RESEND_API_KEY
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!apiKey || !audienceId) {
      console.error('[SUBSCRIBE] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID')
      return NextResponse.json(
        { message: 'Subscription is not configured yet.' },
        { status: 500 }
      )
    }

    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitized,
        unsubscribed: false,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('[SUBSCRIBE] Resend error:', error)

      if (res.status === 409) {
        return NextResponse.json(
          { message: 'Subscribed successfully.' },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { message: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Subscribed successfully.' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[SUBSCRIBE] Error:', err)
    return NextResponse.json(
      { message: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
