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
  passport.authenticate("spotify", { failureRedirect: "http://localhost:8080/login" }),
  (req, res) => {
    console.log("Session Data:", req.session); // ✅ Debug session
    res.redirect("http://localhost:8080/");
  }
);

// 🔹 Get Logged-In User
router.get("/user", (req, res) => {
  console.log("Session Data:", req.session);
  if (req.isAuthenticated() && req.session.passport?.user) {
    res.json({ accessToken: req.session.passport.user.accessToken });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// 🔹 Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:8080/");
  });
});

export default router;
