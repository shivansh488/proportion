import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useSpotifyPlayer() {
  const [player, setPlayer] = useState<Spotify.Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<{
    name: string
    artist: string
    albumArt: string
  }>({
    name: 'Not Playing',
    artist: 'No Artist',
    albumArt: '/placeholder.svg'
  })
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true

    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        const { data: tokenData, error: tokenError } = await supabase
          .from('spotify_tokens')
          .select('access_token')
          .maybeSingle()

        if (tokenError) throw new Error('Error fetching token')
        if (!tokenData) throw new Error('No access token found')

        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: cb => cb(tokenData.access_token),
        })

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id)
          setIsReady(true)
        })

        player.addListener('player_state_changed', state => {
          if (!state) return

          setIsPlaying(!state.paused)
          if (state.track_window.current_track) {
            const track = state.track_window.current_track
            setCurrentTrack({
              name: track.name,
              artist: track.artists[0].name,
              albumArt: track.album.images[0]?.url || '/placeholder.svg'
            })
          }
        })

        await player.connect()
        setPlayer(player)
      } catch (error) {
        console.error('Error initializing Spotify player:', error)
      }
    }

    return () => {
      player?.disconnect()
      document.body.removeChild(script)
    }
  }, [])

  const togglePlay = async () => {
    if (!player) return
    await player.togglePlay()
  }

  const nextTrack = async () => {
    if (!player) return
    await player.nextTrack()
  }

  const previousTrack = async () => {
    if (!player) return
    await player.previousTrack()
  }

  return {
    isReady,
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
  }
}