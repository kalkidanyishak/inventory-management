import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as locationService from '../services/location.service';

export const createLocation = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newLocation] = await go(locationService.createLocation(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Location created successfully', location: newLocation });
};

export const getAllLocations = async (req: Request, res: Response, next: NextFunction) => {
  const [error, locations] = await go(locationService.getAllLocations());

  if (error) return next(error);

  res.status(200).json(locations);
};

export const getLocationById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid location id' });
  }
  const [error, location] = await go(locationService.getLocationById(id));

  if (error) return next(error);
  if (!location) {
    return res.status(404).json({ message: 'Location not found' });
  }

  res.status(200).json(location);
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid location id' });
  }
  const [error, updatedLocation] = await go(locationService.updateLocation(id, req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Location updated successfully', location: updatedLocation });
};

export const deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid location id' });
  }
  const [error] = await go(locationService.deleteLocation(id));

  if (error) return next(error);

  res.status(200).json({ message: 'Location deleted successfully' });
};