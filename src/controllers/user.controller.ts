import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services/user.service';
import { LoginSchema, SignUpSchema } from '@/types/user.types';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = SignUpSchema.parse(req.body);
    const newUser = await userService.signup(validatedData);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const user = await userService.login(validatedData);
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    next(error);
  }
};