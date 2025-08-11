import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';

import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { createCustomerSchema, paramsWithIdSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validateResource(createCustomerSchema),
  customerController.createCustomer
);
router.get('/', customerController.getAllCustomers);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  customerController.getCustomerById
);
router.patch(
  '/:id',
  validateResource(paramsWithIdSchema), // Body is partially validated, ensure ID is correct
  customerController.updateCustomer
);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  customerController.deleteCustomer
);

export default router;