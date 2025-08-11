import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as customerService from '../services/customer.service';

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newCustomer] = await go(customerService.createCustomer(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
};

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  const [error, customers] = await go(customerService.getAllCustomers());

  if (error) return next(error);

  res.status(200).json(customers);
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Customer ID is required' });
  }
  const [error, customer] = await go(customerService.getCustomerById(id));

  if (error) return next(error);
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  res.status(200).json(customer);
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Customer ID is required' });
  }
  const [error, updatedCustomer] = await go(customerService.updateCustomer(id, req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Customer ID is required' });
  }
  const [error] = await go(customerService.deleteCustomer(id));

  if (error) return next(error);

  res.status(200).json({ message: 'Customer deleted successfully' });
};