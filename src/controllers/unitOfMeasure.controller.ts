import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as unitOfMeasureService from '../services/unitOfMeasure.service';

export const createUnitOfMeasure = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newUnit] = await go(unitOfMeasureService.createUnitOfMeasure(req.body));
  if (error) return next(error);
  res.status(201).json({ message: 'Unit of Measure created successfully', unitOfMeasure: newUnit });
};

export const getAllUnitsOfMeasure = async (req: Request, res: Response, next: NextFunction) => {
  const [error, units] = await go(unitOfMeasureService.getAllUnitsOfMeasure());
  if (error) return next(error);
  res.status(200).json(units);
};

export const getUnitOfMeasureById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Unit of Measure ID is required' });
  }
  const [error, unit] = await go(unitOfMeasureService.getUnitOfMeasureById(id));
  if (error) return next(error);
  if (!unit) return res.status(404).json({ message: 'Unit of Measure not found' });
  res.status(200).json(unit);
};

export const updateUnitOfMeasure = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Unit of Measure ID is required' });
  }
  const [error, updatedUnit] = await go(unitOfMeasureService.updateUnitOfMeasure(id, req.body));
  if (error) return next(error);
  res.status(200).json({ message: 'Unit of Measure updated successfully', unitOfMeasure: updatedUnit });
};

export const deleteUnitOfMeasure = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Unit of Measure ID is required' });
  }
  const [error] = await go(unitOfMeasureService.deleteUnitOfMeasure(id));
  if (error) return next(error);
  res.status(200).json({ message: 'Unit of Measure deleted successfully' });
};