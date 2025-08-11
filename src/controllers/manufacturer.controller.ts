import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as manufacturerService from '../services/manufacturer.service';

export const createManufacturer = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newManufacturer] = await go(manufacturerService.createManufacturer(req.body));
  if (error) return next(error);
  res.status(201).json({ message: 'Manufacturer created successfully', manufacturer: newManufacturer });
};

export const getAllManufacturers = async (req: Request, res: Response, next: NextFunction) => {
  const [error, manufacturers] = await go(manufacturerService.getAllManufacturers());
  if (error) return next(error);
  res.status(200).json(manufacturers);
};

export const getManufacturerById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Manufacturer id is required' });
  }
  const [error, manufacturer] = await go(manufacturerService.getManufacturerById(id));
  if (error) return next(error);
  if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });
  res.status(200).json(manufacturer);
};

export const updateManufacturer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Manufacturer id is required' });
  }
  const [error, updatedManufacturer] = await go(manufacturerService.updateManufacturer(id, req.body));
  if (error) return next(error);
  res.status(200).json({ message: 'Manufacturer updated successfully', manufacturer: updatedManufacturer });
};

export const deleteManufacturer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Manufacturer id is required' });
  }
  const [error] = await go(manufacturerService.deleteManufacturer(id));
  if (error) return next(error);
  res.status(200).json({ message: 'Manufacturer deleted successfully' });
};