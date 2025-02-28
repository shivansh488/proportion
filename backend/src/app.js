import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js"; // Import passport config
import spotifyRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080", // ✅ Allow frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // ✅ Allow cookies & sessions
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // ✅ Set to `true` in production with HTTPS
      httpOnly: true, // ✅ Prevents JavaScript access to cookies
      sameSite: "lax", // ✅ Helps with cross-origin authentication
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", spotifyRoutes);

export {app}
