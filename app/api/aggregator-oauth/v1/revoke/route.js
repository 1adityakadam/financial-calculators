import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const CLIENT_ID = process.env.CHASE_CLIENT_ID
    const CLIENT_SECRET = process.env.CHASE_CLIENT_SECRET

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Missing required environment variables')
    }

    // Revoke the access token
    const revokeResponse = await fetch('https://chase-auth-api.com/oauth/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      }
    })

    if (!revokeResponse.ok) {
      throw new Error('Failed to revoke access token')
    }

    // Clear stored token data (implement based on your storage solution)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to revoke access' },
      { status: 500 }
    )
  }
} 