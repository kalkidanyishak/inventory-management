import { Router } from 'express';
import * as returnController from '../controllers/return.controller';
import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { createReturnOrderSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validateResource(createReturnOrderSchema),
  returnController.createReturnOrder
);
router.get('/', returnController.getAllReturnOrders);

export default router;