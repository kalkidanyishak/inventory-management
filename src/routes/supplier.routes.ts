import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller';
import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { paramsWithIdSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post('/', supplierController.createSupplier);
router.get('/', supplierController.getAllSuppliers);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  supplierController.getSupplierById
);
router.patch('/:id', supplierController.updateSupplier);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  supplierController.deleteSupplier
);

export default router;