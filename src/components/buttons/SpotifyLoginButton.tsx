import React, { useEffect, useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Loader, Music2, ListMusic, X, Search } from 'lucide-react';

const SpotifyPlayer = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPremium, setIsPremium] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [searchTracks, setSearchTracks] = useState([]); // Separate state for search results
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
            fetchUserPlaylists(data.accessToken); // Fetch Playlists

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
      setSearchTracks(data.tracks.items || []); // Update search results
    } catch (error) {
      console.error("Failed to search tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Playlist Selection
  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylist(playlistId);
    setSearchTerm(""); // Clear search term
    fetchPlaylistTracks(playlistId);
  };

  // Play Selected Track
  const playTrack = async (trackUri) => {
    if (!deviceId || !accessToken || !trackUri) {
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
        setShowMusicSelector(false); // Close the popup after selecting a track
      } else {
        console.error("Failed to start playback:", await response.json());
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
      // Send a request to your backend to log the user out
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies for session-based logout
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
    return (
      <div className="text-center p-4 bg-red-900 bg-opacity-30 rounded-lg">
       
        <h2 className="text-xl font-bold mb-4">Premium Account Required</h2>
        <p className="mb-4">Spotify requires a Premium account to use the Web Playback SDK.</p>
        <a
          href="https://www.spotify.com/premium/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 underline"
        >
          Upgrade to Premium
        </a>
        <div className="justify-center items-center flex mt-4">
        <button
        onClick={handleLogout}
        className=" bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded-full transition flex items-center justify-center"
      >
        Logout
      </button>
      </div>
        
      
  
      </div>
      
    );
  }
  

  return (
    <div className="flex flex-col relative">
      {accessToken && (
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition flex items-center justify-center"
      >
        Logout
      </button>
    )}

      {!accessToken ? (
        <div className="text-center py-10">
          <Music2 size={64} className="mx-auto mb-6 text-green-500" />
          <h2 className="text-xl font-bold mb-4">Connect to Spotify</h2>
          <p className="mb-6 text-gray-300">Login with your Spotify account to start listening</p>
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition flex items-center justify-center mx-auto"
          >
            <span>Login with Spotify</span>
          </button>
        </div>
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

            {/* Player Controls */}
            <div className="flex justify-center items-center space-x-6 py-4 w-full">
              <button
                onClick={skipPrevious}
                className="p-2 rounded-full hover:bg-gray-600 transition"
                disabled={!playerReady}
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition"
                disabled={!playerReady}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={18} className="ml-1" />}
              </button>

              <button
                onClick={skipNext}
                className="p-2 rounded-full hover:bg-gray-600 transition"
                disabled={!playerReady}
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Browse Music Button */}
            <button
              onClick={() => setShowMusicSelector(true)}
              className="browse-music-btn bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-full transition flex items-center justify-center"
            >
              <ListMusic size={18} className="mr-2" />
              Browse Music
            </button>
          </div>

          {/* Music Selector Popup */}
          {showMusicSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 p-4">
              <div
                id="music-selector-popup"
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              >
                <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 flex justify-between items-center border-b border-gray-700">
                  <h3 className="text-lg font-bold">Select Music</h3>
                  <button
                    onClick={() => {
                      setShowMusicSelector(false);
                      setSearchTerm(""); // Clear search term
                    }}
                    className="p-1 rounded-full hover:bg-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tracks..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        searchSpotifyTracks(e.target.value); // Trigger search on input change
                      }}
                      className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="flex h-full overflow-hidden">
                  {/* Playlists Column */}
                  <div className="w-1/3 border-r border-gray-700 overflow-y-auto p-2">
                    <h4 className="text-sm font-medium text-gray-400 mb-2 px-2">YOUR PLAYLISTS</h4>
                    <div className="space-y-1">
                      {playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handlePlaylistSelect(playlist.id)}
                          className={`w-full text-left p-2 rounded-lg transition ${
                            selectedPlaylist === playlist.id
                              ? 'bg-gray-600 text-white'
                              : 'hover:bg-gray-700 text-gray-300'
                          }`}
                        >
                          <p className="truncate text-sm">{playlist.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tracks Column */}
                  <div className="w-2/3 overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader size={24} className="animate-spin text-green-500" />
                      </div>
                    ) : (
                      <div className="p-2">
                        {searchTerm ? (
                          searchTracks.length > 0 ? (
                            <div className="space-y-1">
                              {searchTracks.map((track) => (
                                <button
                                  key={track.id}
                                  onClick={() => playTrack(track.uri)}
                                  className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg transition"
                                >
                                  {track.album.images && track.album.images[2] && (
                                    <img
                                      src={track.album.images[2].url}
                                      alt={track.album.name}
                                      className="w-10 h-10 rounded mr-3"
                                    />
                                  )}
                                  <div className="flex-1 text-left">
                                    <p className="truncate text-sm font-medium">{track.name}</p>
                                    <p className="truncate text-xs text-gray-400">
                                      {track.artists.map(a => a.name).join(', ')}
                                    </p>
                                  </div>
                                  <Play size={16} className="text-gray-400 ml-2" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              No matching tracks found
                            </div>
                          )
                        ) : selectedPlaylist ? (
                          filteredTracks.length > 0 ? (
                            <div className="space-y-1">
                              {filteredTracks.map((item) => (
                                <button
                                  key={item.track.id}
                                  onClick={() => playTrack(item.track.uri)}
                                  className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg transition"
                                >
                                  {item.track.album.images && item.track.album.images[2] && (
                                    <img
                                      src={item.track.album.images[2].url}
                                      alt={item.track.album.name}
                                      className="w-10 h-10 rounded mr-3"
                                    />
                                  )}
                                  <div className="flex-1 text-left">
                                    <p className="truncate text-sm font-medium">{item.track.name}</p>
                                    <p className="truncate text-xs text-gray-400">
                                      {item.track.artists.map(a => a.name).join(', ')}
                                    </p>
                                  </div>
                                  <Play size={16} className="text-gray-400 ml-2" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              This playlist is empty
                            </div>
                          )
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            Select a playlist to view tracks
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;