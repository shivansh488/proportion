import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SUPABASE_URL = Deno.env.get('https://znmeyumbgnsffshdrbie.supabase.co')!
const SUPABASE_ANON_KEY = Deno.env.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubWV5dW1iZ25zZmZzaGRyYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NzU2NTIsImV4cCI6MjA1NDM1MTY1Mn0.TX26z7SLYOR1hljo8p3ANtDUAOBallps5VGOA-Rka34')!
const SPOTIFY_CLIENT_ID = Deno.env.get('da0e90add8fc45faa250909cf3e1a589')!
const SPOTIFY_CLIENT_SECRET = Deno.env.get('87f24ae18b2848adbe55bc85d6d22756')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  try {
    // Get the code from the query string
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    
    if (error || !code) {
      return new Response(
        JSON.stringify({ error: error || 'No code provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Exchange the code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${url.origin}/api/spotify-auth`,
      }),
    })

    const data = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(data.error_description || 'Failed to exchange code')
    }

    // Get the user's session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      throw new Error('Not authenticated')
    }

    // Calculate expires_at
    const expires_at = new Date()
    expires_at.setSeconds(expires_at.getSeconds() + data.expires_in)

    // Store the tokens in the database
    const { error: dbError } = await supabase
      .from('spotify_tokens')
      .upsert({
        user_id: session.user.id,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: expires_at.toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to store tokens')
    }

    // Redirect back to the app
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${url.origin}?spotify_connected=true`,
      },
    })
  } catch (error) {
    console.error('Error in spotify-auth function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
