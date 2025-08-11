import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as purchaseOrderService from '../services/purchaseOrder.service';

export const createPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newOrder] = await go(purchaseOrderService.createPurchaseOrder(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Purchase Order created successfully', purchaseOrder: newOrder });
};

export const getAllPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {
  const [error, orders] = await go(purchaseOrderService.getAllPurchaseOrders());

  if (error) return next(error);

  res.status(200).json(orders);
};

export const getPurchaseOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Purchase Order ID is required' });
  }
  const [error, order] = await go(purchaseOrderService.getPurchaseOrderById(id));

  if (error) return next(error);
  if (!order) {
    return res.status(404).json({ message: 'Purchase Order not found' });
  }

  res.status(200).json(order);
};

export const receivePurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Purchase Order ID is required' });
  }
  const [error, updatedOrder] = await go(purchaseOrderService.receivePurchaseOrder(id, req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Items received successfully', purchaseOrder: updatedOrder });
};