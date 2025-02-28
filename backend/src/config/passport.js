import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET ,
      callbackURL: "http://localhost:8000/auth/spotify/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Spotify Profile:", profile); // ✅ Debug user data
      return done(null, { ...profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing User:", user); // ✅ Check session storage
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("Deserializing User:", user); // ✅ Check session retrieval
  done(null, user);
});

export default passport;
