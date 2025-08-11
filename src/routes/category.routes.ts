import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';

import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { createCategorySchema, paramsWithIdSchema, updateCategorySchema } from '@/types/user.types';

const router = Router();

// All category routes are protected
router.use(requireAuth);

router.post(
  '/',
  validateResource(createCategorySchema),
  categoryController.createCategory
);
router.get('/', categoryController.getAllCategories);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  categoryController.getCategoryById
);
router.patch(
  '/:id',
  validateResource(updateCategorySchema),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  categoryController.deleteCategory
);

export default router;