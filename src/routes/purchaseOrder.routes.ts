import { Router } from 'express';
import * as poController from '../controllers/purchaseOrder.controller';

import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { createPurchaseOrderSchema, paramsWithIdSchema, receivePurchaseOrderSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validateResource(createPurchaseOrderSchema),
  poController.createPurchaseOrder
);
router.get('/', poController.getAllPurchaseOrders);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  poController.getPurchaseOrderById
);
router.post( // This is an action, so POST is appropriate
  '/:id/receive',
  validateResource(receivePurchaseOrderSchema),
  poController.receivePurchaseOrder
);

export default router;