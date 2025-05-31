import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    const CLIENT_ID = process.env.CHASE_CLIENT_ID
    const CLIENT_SECRET = process.env.CHASE_CLIENT_SECRET
    const REDIRECT_URI = process.env.CHASE_REDIRECT_URI

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      throw new Error('Missing required environment variables')
    }

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://chase-auth-api.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to obtain access token')
    }

    const tokenData = await tokenResponse.json()

    // Store the token securely (you should implement proper token storage)
    // For example, you might want to store it in a secure session or database
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to exchange token' },
      { status: 500 }
    )
  }
} 