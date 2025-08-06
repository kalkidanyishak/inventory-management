import express from 'express';
import userRouter from '@/routes/user.routes';
import { errorHandler } from '@/middleware/errorHandler.middleware';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', userRouter);

// Central error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});