import { Router } from "express";
import passport from "../config/passport.js";

const router = Router();

// 🔹 Start Spotify Authentication
router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private", "streaming", "user-read-playback-state", "user-modify-playback-state"],
  })
);

// 🔹 Handle Spotify Callback
router.get(
  "/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: "http://localhost:8080/login",
    successRedirect: "http://localhost:8080/",
    session: true,  // ✅ Ensure session is stored
  }),
  (req, res) => {
    console.log("Session Data:", req.session); // ✅ Debug session
    res.redirect("http://localhost:8080/");
  }
);

// 🔹 Get Logged-In User
router.get("/user", (req, res) => {
  console.log("Session Data:", req.session);
  

  if (req.isAuthenticated()) {
    console.log("User Data:", req.user); // ✅ Debug user data

    res.json({ 
      user: req.user, 
      accessToken: req.user.accessToken 
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});


// 🔹 Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clear session cookie
      return res.json({ message: "Logged out successfully" });
    });
  });
});

export default router;
