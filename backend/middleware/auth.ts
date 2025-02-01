import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface UserWithoutPassword {
	id: string;
	email: string;
	name: string | null;
}

// Extend Express Request type to include user
declare global {
	namespace Express {
		interface Request {
			user?: User | undefined;
		}
	}
}

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

		if (!token) {
			res.status(401).json({ message: "No token provided" });
			return;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

		// Get user from database
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				name: true,
			},
		});

		if (!user) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		// Now TypeScript knows user exists
		req.user = user as UserWithoutPassword;
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}
		res.status(500).json({ message: "Error authenticating user" });
	}
};

// Optional: Middleware to check if user is authenticated via session (for Passport.js)
export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({ message: "Not authenticated" });
};

// Optional: Middleware to handle roles/permissions
export const hasPermission = (permission: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ message: "Not authenticated" });
		}
		// Add your permission logic here
		next();
	};
};
