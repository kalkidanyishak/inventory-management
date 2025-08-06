import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/utils/AppError';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error); // For debugging

  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Validation failed', errors: error.flatten().fieldErrors });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({ message: 'make sure you send the right data like check for trailing commas...' });
};