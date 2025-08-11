import { Router } from 'express';
import * as manufacturerController from '../controllers/manufacturer.controller';
import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { paramsWithIdSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post('/', manufacturerController.createManufacturer);
router.get('/', manufacturerController.getAllManufacturers);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  manufacturerController.getManufacturerById
);
router.patch('/:id', manufacturerController.updateManufacturer);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  manufacturerController.deleteManufacturer
);

export default router;