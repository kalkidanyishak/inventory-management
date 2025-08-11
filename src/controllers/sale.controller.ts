import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as saleService from '../services/sale.service';

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newSale] = await go(saleService.createSale(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Sale completed successfully', sale: newSale });
};

export const getAllSales = async (req: Request, res: Response, next: NextFunction) => {
  const [error, sales] = await go(saleService.getAllSales());

  if (error) return next(error);

  res.status(200).json(sales);
};

export const getSaleById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Sale id is required' });
  }
  const [error, sale] = await go(saleService.getSaleById(id));

  if (error) return next(error);
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' });
  }

  res.status(200).json(sale);
};