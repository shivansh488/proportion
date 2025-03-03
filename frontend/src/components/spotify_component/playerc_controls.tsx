import React from 'react';

interface PlayerControlsProps {
  isPlaying: boolean;
  playerReady: boolean;
  onTogglePlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  playerReady,
  onTogglePlayPause,
  onSkipNext,
  onSkipPrevious
}) => {
  return (
    <div className="flex justify-center items-center space-x-6 py-4 w-full">
      <button
        onClick={onSkipPrevious}
        className="p-2 rounded-full hover:bg-gray-600 transition"
        disabled={!playerReady}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 20-10-8 10-8v16Z"></path>
          <path d="M5 19V5"></path>
        </svg>
      </button>

      <button
        onClick={onTogglePlayPause}
        className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition"
        disabled={!playerReady}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>

      <button
        onClick={onSkipNext}
        className="p-2 rounded-full hover:bg-gray-600 transition"
        disabled={!playerReady}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 4 10 8-10 8V4Z"></path>
          <path d="M19 5v14"></path>
        </svg>
      </button>
    </div>
  );
};

export default PlayerControls;