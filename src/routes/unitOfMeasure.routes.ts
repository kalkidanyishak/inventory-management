import { Router } from 'express';
import * as unitOfMeasureController from '../controllers/unitOfMeasure.controller';
import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { paramsWithIdSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post('/', unitOfMeasureController.createUnitOfMeasure);
router.get('/', unitOfMeasureController.getAllUnitsOfMeasure);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  unitOfMeasureController.getUnitOfMeasureById
);
router.patch('/:id', unitOfMeasureController.updateUnitOfMeasure);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  unitOfMeasureController.deleteUnitOfMeasure
);

export default router;