import React, { useEffect, useState } from "react";
import { Music2 } from 'lucide-react';
import PlayerControls from "../spotify_component/playerc_controls";
import MusicSelector from "../spotify_component/music_selector";
import LoginButton from "../spotify_component/login_button";
import PremiumRequired from "../spotify_component/premium_required";

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPremium, setIsPremium] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [searchTracks, setSearchTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState(null);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check session and fetch user details
  useEffect(() => {
    fetch("http://localhost:8000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Session Response:", data);
        if (!data.accessToken) return;

        fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        })
          .then((res) => res.json())
          .then((userData) => {
            console.log("Spotify User Data:", userData);
            if (userData.product !== "premium") {
              console.error("User is not premium. Streaming is restricted.");
              setIsPremium(false);
              return;
            }

            setIsPremium(true);
            setAccessToken(data.accessToken);
            fetchUserPlaylists(data.accessToken);

            if (!playerReady) {
              loadSpotifyPlayer(data.accessToken);
            }
          })
          .catch((err) => console.error("Failed to fetch user data:", err));
      })
      .catch(() => console.log("User not logged in"));
  }, [playerReady]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popup = document.getElementById('music-selector-popup');
      if (showMusicSelector && popup && !popup.contains(event.target) && !event.target.closest('.browse-music-btn')) {
        setShowMusicSelector(false);
        setSearchTerm(""); // Clear search term when closing popup
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMusicSelector]);

  const handleLogin = () => {
    window.location.href = "http://localhost:8000/auth/spotify";
  };

  // Load Spotify Web Playback SDK
  const loadSpotifyPlayer = (token) => {
    if (window.Spotify) {
      initializeSpotifyPlayer(token);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    script.onload = () => {
      console.log("Spotify SDK loaded.");
      if (window.Spotify) {
        initializeSpotifyPlayer(token);
      } else {
        console.error("Spotify SDK failed to initialize.");
      }
    };

    script.onerror = () => console.error("Failed to load Spotify SDK");
    document.body.appendChild(script);
  };

  const initializeSpotifyPlayer = (token) => {
    const spotifyPlayer = new window.Spotify.Player({
      name: "My React Spotify Player",
      getOAuthToken: (cb) => cb(token),
    });

    spotifyPlayer.addListener("ready", async ({ device_id }) => {
      console.log("Spotify Player Ready with Device ID:", device_id);
      await transferPlaybackToDevice(device_id, token);
      setDeviceId(device_id);

      spotifyPlayer.connect().then((success) => {
        if (success) {
          spotifyPlayer.setVolume(0.5).catch(console.error);
          console.log("Connected to Spotify Player 🎵");
        }
      });
    });

    spotifyPlayer.addListener("player_state_changed", (state) => {
      if (!state) return;

      setCurrentTrack(state.track_window.current_track);
      setIsPlaying(!state.paused);
    });

    spotifyPlayer.addListener("initialization_error", ({ message }) =>
      console.error("Initialization Error:", message)
    );
    spotifyPlayer.addListener("authentication_error", ({ message }) =>
      console.error("Authentication Error:", message)
    );
    spotifyPlayer.addListener("account_error", ({ message }) =>
      console.error("Account Error:", message)
    );
    spotifyPlayer.addListener("playback_error", ({ message }) =>
      console.error("Playback Error:", message)
    );

    spotifyPlayer.connect();
    setPlayer(spotifyPlayer);
    setPlayerReady(true);
  };

  const transferPlaybackToDevice = async (deviceId, token) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ device_ids: [deviceId] }),
      });

      if (response.ok) {
        console.log("Playback transferred to device:", deviceId);
      } else {
        console.error("Failed to transfer playback:", await response.json());
      }
    } catch (error) {
      console.error("Error in playback transfer:", error);
    }
  };

  // Fetch User's Playlists
  const fetchUserPlaylists = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("User Playlists:", data);
      setPlaylists(data.items || []);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Playlist Tracks
  const fetchPlaylistTracks = async (playlistId) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      console.log("Playlist Tracks:", data);
      setTracks(data.items || []);
    } catch (error) {
      console.error("Failed to fetch playlist tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search Spotify Tracks
  const searchSpotifyTracks = async (query) => {
    if (!accessToken || !query) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      console.log("Search Results:", data);
      setSearchTracks(data.tracks.items || []);
    } catch (error) {
      console.error("Failed to search tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Playlist Selection
  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylist(playlistId);
    setSearchTerm("");
    fetchPlaylistTracks(playlistId);
  };

  // Play Selected Track
  const playTrack = async (trackUri) => {
    if (!deviceId || !accessToken || !trackUri || !player) {
      console.error("Player is not ready or no track selected");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: [trackUri],
          device_id: deviceId,
        }),
      });
  
      if (response.ok) {
        console.log("Playback started successfully");
        setIsPlaying(true);
        setShowMusicSelector(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to start playback:", errorData);
      }
    } catch (error) {
      console.error("Error in playback:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (player) {
      player.togglePlay().then(() => {
        setIsPlaying(!isPlaying);
      });
    }
  };

  const skipNext = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const skipPrevious = () => {
    if (player) {
      player.previousTrack();
    }
  };

  // Filter tracks based on search term
  const filteredTracks = tracks.filter(item =>
    item.track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.track.artists.some(artist =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        console.log("Logged out successfully");
        // Reset the application state
        setAccessToken(null);
        setPlayerReady(false);
        setIsPremium(null);
        setDeviceId(null);
        setPlaylists([]);
        setSelectedPlaylist(null);
        setTracks([]);
        setSearchTracks([]);
        setCurrentTrack(null);
        setIsPlaying(false);
        setPlayer(null);
        setShowMusicSelector(false);
        setSearchTerm("");
      } else {
        console.error("Failed to log out:", await response.json());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (isPremium === false) {
    return <PremiumRequired onLogout={handleLogout} />;
  }

  return (
    <div className="flex flex-col relative">
      {accessToken && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-2 rounded-full transition flex items-center justify-center"
        >
          Logout
        </button>
      )}

      {!accessToken ? (
        <LoginButton onLogin={handleLogin} />
      ) : (
        <div className="space-y-6">
          {/* Now Playing Section */}
          <div className="bg-gray-700 bg-opacity-50 backdrop-blur-lg rounded-lg p-2 flex flex-col items-center">
            {currentTrack ? (
              <>
                {currentTrack.album.images && currentTrack.album.images[0] && (
                  <img
                    src={currentTrack.album.images[0].url}
                    alt={currentTrack.album.name}
                    className="w-28 h-28 rounded-lg shadow-lg mb-4"
                  />
                )}
                <div className="text-center">
                  <h3 className="font-bold text-sm">{currentTrack.name}</h3>
                  <p className="text-gray-300 text-xs">{currentTrack.artists.map((a) => a.name).join(', ')}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Music2 size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No track playing</p>
              </div>
            )}

            <PlayerControls 
              isPlaying={isPlaying}
              playerReady={playerReady}
              onTogglePlayPause={togglePlayPause}
              onSkipNext={skipNext}
              onSkipPrevious={skipPrevious}
            />

            {/* Browse Music Button */}
            <button
              onClick={() => setShowMusicSelector(true)}
              className="browse-music-btn bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-full transition flex items-center justify-center"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
                Browse Music
              </span>
            </button>
          </div>

          <MusicSelector 
            show={showMusicSelector}
            onClose={() => {
              setShowMusicSelector(false);
              setSearchTerm("");
            }}
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              searchSpotifyTracks(value);
            }}
            playlists={playlists}
            selectedPlaylist={selectedPlaylist}
            onPlaylistSelect={handlePlaylistSelect}
            tracks={filteredTracks}
            searchTracks={searchTracks}
            loading={loading}
            onPlayTrack={playTrack}
          />
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;