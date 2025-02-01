import express, { Request, Response, RequestHandler } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// Add this interface
interface AuthRequest extends Request {
  user?: any;
  logout: any;
}

const router = express.Router();
const prisma = new PrismaClient();

// Register route
router.post("/register", (async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    console.log(req.body);

    console.log(email, password, name);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}) as RequestHandler);

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user });
});

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login",
  })
);

// Logout route
router.get("/logout", ((req: AuthRequest, res: Response) => {
  req.logout((err: Error | null) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.json({ message: "Logged out successfully" });
  });
}) as RequestHandler);

// Get current user
router.get("/current-user", ((req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
}) as RequestHandler);

export default router;
