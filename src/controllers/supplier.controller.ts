import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as supplierService from '../services/supplier.service';

export const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newSupplier] = await go(supplierService.createSupplier(req.body));
  if (error) return next(error);
  res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
};

export const getAllSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  const [error, suppliers] = await go(supplierService.getAllSuppliers());
  if (error) return next(error);
  res.status(200).json(suppliers);
};

export const getSupplierById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Supplier id is required' });
  }
  const [error, supplier] = await go(supplierService.getSupplierById(id));
  if (error) return next(error);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
  res.status(200).json(supplier);
};

export const updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Supplier id is required' });
  }
  const [error, updatedSupplier] = await go(supplierService.updateSupplier(id, req.body));
  if (error) return next(error);
  res.status(200).json({ message: 'Supplier updated successfully', supplier: updatedSupplier });
};

export const deleteSupplier = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Supplier id is required' });
  }
  const [error] = await go(supplierService.deleteSupplier(id));
  if (error) return next(error);
  res.status(200).json({ message: 'Supplier deleted successfully' });
};