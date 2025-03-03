import React from 'react';

interface LoginButtonProps {
  onLogin: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLogin }) => {
  return (
    <div className="text-center py-10">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 text-green-500">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      <h2 className="text-xl font-bold mb-4">Connect to Spotify</h2>
      <p className="mb-6 text-gray-300">Login with your Spotify account to start listening</p>
      <button
        onClick={onLogin}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition flex items-center justify-center mx-auto"
      >
        <span>Login with Spotify</span>
      </button>
    </div>
  );
};

export default LoginButton;