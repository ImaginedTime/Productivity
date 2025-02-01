import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import morgan from "morgan";
import "@/config/passport";

// Import routes (we'll create these next)
import authRoutes from "@/routes/auth";

dotenv.config();
const app = express();

// Custom morgan token for request body
morgan.token('req-body', (req: any) => JSON.stringify(req.body));
morgan.token('res-body', (req: any, res: any) => {
  if (res.locals.responseBody) {
    return JSON.stringify(res.locals.responseBody);
  }
  return '';
});
morgan.token('error', (req: any, res: any) => {
  if (res.locals.error) {
    return JSON.stringify(res.locals.error);
  }
  return '';
});

// Middleware to capture response body
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    res.locals.responseBody = data;
    return oldSend.apply(res, arguments as any);
  };
  next();
});

// Morgan logging middleware
app.use(
  morgan(
    ':method :url :status\n:req-body\nResponse: :res-body\nError: :error\n-------------------------',
    {
      skip: (req: any) => req.url === '/favicon.ico',
    }
  )
);

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.locals.error = {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };
  next(err);
});

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
