import React from 'react';

interface PremiumRequiredProps {
  onLogout: () => void;
}

const PremiumRequired: React.FC<PremiumRequiredProps> = ({ onLogout }) => {
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
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded-full transition flex items-center justify-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PremiumRequired;