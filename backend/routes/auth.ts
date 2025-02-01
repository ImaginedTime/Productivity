import express, { Request, Response, RequestHandler } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Add this interface
interface AuthRequest extends Request {
  user?: any;
  logout: any;
}

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to generate token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

// Register route
router.post("/register", (async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

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

    // Generate token for the new user
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}) as RequestHandler);

// Login route
router.post("/login", (async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
}) as RequestHandler);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: AuthRequest, res: Response) => {
    if (req.user) {
      // Generate token for OAuth user
      const token = generateToken(req.user.id);
      
      // Redirect to app with token
      res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    } else {
      res.redirect("/login");
    }
  }
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
  
  // Refresh token
  const token = generateToken(req.user.id);
  
  res.json({
    user: req.user,
    token,
  });
}) as RequestHandler);

export default router;
