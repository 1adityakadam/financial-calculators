import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // These values would come from your Chase API credentials
    const CLIENT_ID = process.env.CHASE_CLIENT_ID
    const REDIRECT_URI = process.env.CHASE_REDIRECT_URI
    const SCOPE = 'account_details transaction_details'

    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error('Missing required environment variables')
    }

    // Construct the authorization URL
    const authUrl = new URL('https://chase-auth-api.com/oauth/authorize')
    authUrl.searchParams.append('client_id', CLIENT_ID)
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', SCOPE)
    
    return NextResponse.json({ authUrl: authUrl.toString() })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
} 