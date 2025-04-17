import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js"; // Import Passport configuration
import spotifyRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import ProjectRoute from "./routes/projectRoutes.js"

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_ORIGIN || "http://localhost:8080"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies & sessions
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbackSecret", // Use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only secure in production
      httpOnly: true, // Prevent JavaScript access
      sameSite: "lax", // Helps with cross-origin authentication
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", spotifyRoutes);
app.use("/user",ProjectRoute)


// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export the app
export { app };
