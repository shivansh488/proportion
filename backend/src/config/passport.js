import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import fetch from "node-fetch";

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/spotify/callback",
      scope: [
        "user-read-email",
        "user-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
        "user-read-currently-playing",
        "user-library-read",  // ✅ Add this
        "user-top-read",      // ✅ Add this
        "playlist-read-private",
        "app-remote-control",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token:", accessToken);

        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        console.log("Response:", data);

        if (!response.ok) {
          console.error("Spotify API Error:", JSON.stringify(data, null, 2));
          throw new Error(data.error?.message || "Failed to fetch user profile");
        }

        return done(null, { ...data, accessToken });
      } catch (error) {
        console.error("Authentication Error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
