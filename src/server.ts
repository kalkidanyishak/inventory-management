import express from 'express';
import userRouter from '@/routes/user.routes';
import { errorHandler } from '@/middleware/errorHandler.middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  // Replace with your actual frontend URL in production
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true, // <-- THIS IS ESSENTIAL
}));

// Routes
app.use('/api/auth', userRouter);

// Central error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});