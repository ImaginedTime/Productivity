import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import "@/config/passport";

// Import routes (we'll create these next)
import authRoutes from "@/routes/auth";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors()
);

// Session configuration
app.use(
  session({
    secret: process.env.COOKIE_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
