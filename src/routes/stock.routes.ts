import { Router } from 'express';
import * as stockController from '../controllers/stock.controller';
import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { z } from 'zod';
import { createStockAdjustmentSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

// Get stock for a specific location
router.get(
  '/location/:locationId',
  validateResource(z.object({ params: z.object({ locationId: z.string().uuid() }) })),
  stockController.getStockForLocation
);

// Manually adjust stock
router.post(
  '/adjust',
  validateResource(createStockAdjustmentSchema),
  stockController.adjustStock
);

export default router;