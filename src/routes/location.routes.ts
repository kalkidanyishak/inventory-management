import { Router } from 'express';
import * as locationController from '../controllers/location.controller';
import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { paramsWithIdSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post('/', locationController.createLocation);
router.get('/', locationController.getAllLocations);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  locationController.getLocationById
);
router.patch('/:id', locationController.updateLocation);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  locationController.deleteLocation
);

export default router;