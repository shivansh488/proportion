import React from 'react';

interface Track {
  id: string;
  name: string;
  uri: string;
  album: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
  artists: Array<{
    name: string;
  }>;
}

interface PlaylistTrack {
  track: Track;
}

interface Playlist {
  id: string;
  name: string;
}

interface MusicSelectorProps {
  show: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  playlists: Playlist[];
  selectedPlaylist: string | null;
  onPlaylistSelect: (playlistId: string) => void;
  tracks: PlaylistTrack[];
  searchTracks: Track[];
  loading: boolean;
  onPlayTrack: (trackUri: string) => void;
}

const MusicSelector: React.FC<MusicSelectorProps> = ({
  show,
  onClose,
  searchTerm,
  onSearchChange,
  playlists,
  selectedPlaylist,
  onPlaylistSelect,
  tracks,
  searchTracks,
  loading,
  onPlayTrack
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 p-4">
      <div
        id="music-selector-popup"
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 flex justify-between items-center border-b border-gray-700">
          <h3 className="text-lg font-bold">Select Music</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
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
                  onClick={() => onPlaylistSelect(playlist.id)}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-green-500">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              </div>
            ) : (
              <div className="p-2">
                {searchTerm ? (
                  searchTracks.length > 0 ? (
                    <div className="space-y-1">
                      {searchTracks.map((track) => (
                        <TrackItem 
                          key={track.id}
                          track={track}
                          onPlay={() => onPlayTrack(track.uri)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No matching tracks found
                    </div>
                  )
                ) : selectedPlaylist ? (
                  tracks.length > 0 ? (
                    <div className="space-y-1">
                      {tracks.map((item) => (
                        <TrackItem 
                          key={item.track.id}
                          track={item.track}
                          onPlay={() => onPlayTrack(item.track.uri)}
                        />
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
  );
};

interface TrackItemProps {
  track: Track;
  onPlay: () => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onPlay }) => {
  return (
    <button
      onClick={onPlay}
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
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 ml-2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    </button>
  );
};

export default MusicSelector;