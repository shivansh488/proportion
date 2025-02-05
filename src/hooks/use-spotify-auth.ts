import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkSpotifyAuth()
  }, [])

  const checkSpotifyAuth = async () => {
    try {
      const { data, error } = await supabase
        .from('spotify_tokens')
        .select('*')
        .maybeSingle()

      if (error) throw error
      setIsAuthenticated(!!data)
    } catch (error) {
      console.error('Error checking Spotify auth:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const connectSpotify = useCallback(() => {
    const redirectUri = `${window.location.origin}/api/spotify-auth`
    const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state'
    
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope,
    })

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
  }, [])

  return {
    isAuthenticated,
    isLoading,
    connectSpotify,
  }
}