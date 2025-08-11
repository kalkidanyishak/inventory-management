import { Router } from 'express';
import * as saleController from '../controllers/sale.controller';

import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { createSaleSchema, paramsWithIdSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validateResource(createSaleSchema),
  saleController.createSale
);
router.get('/', saleController.getAllSales);
router.get('/:id', validateResource(paramsWithIdSchema), saleController.getSaleById);

export default router;