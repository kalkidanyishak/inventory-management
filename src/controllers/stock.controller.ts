import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as stockService from '../services/stock.service';

export const getStockForLocation = async (req: Request, res: Response, next: NextFunction) => {
  const { locationId } = req.params;
  if (!locationId) {
    return res.status(400).json({ message: 'locationId parameter is required' });
  }
  const [error, stockLevels] = await go(stockService.getStockForLocation(locationId));

  if (error) return next(error);

  res.status(200).json(stockLevels);
};

export const adjustStock = async (req: Request, res: Response, next: NextFunction) => {
  const [error, result] = await go(stockService.adjustStock(req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Stock adjusted successfully', ...result });
};