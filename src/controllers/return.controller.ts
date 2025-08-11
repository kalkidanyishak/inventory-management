import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as returnService from '../services/return.service';

export const createReturnOrder = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newReturn] = await go(returnService.createReturnOrder(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Return order processed successfully', returnOrder: newReturn });
};

export const getAllReturnOrders = async (req: Request, res: Response, next: NextFunction) => {
  const [error, returnOrders] = await go(returnService.getAllReturnOrders());

  if (error) return next(error);

  res.status(200).json(returnOrders);
};