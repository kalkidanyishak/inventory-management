import { Router } from 'express';
import * as productController from '../controllers/product.controller';

import requireAuth from '../middleware/requireAuth';
import validateResource from '../middleware/validateResource';
import { createProductSchema, paramsWithIdSchema, updateProductSchema, updateProductVariantSchema } from '@/types/user.types';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validateResource(createProductSchema),
  productController.createProduct
);
router.get('/', productController.getAllProducts);
router.get(
  '/:id',
  validateResource(paramsWithIdSchema),
  productController.getProductById
);
router.patch(
  '/:id',
  validateResource(updateProductSchema),
  productController.updateProduct
);
router.patch(
  '/variants/:variantId', // Separate route for variants
  validateResource(updateProductVariantSchema),
  productController.updateProductVariant
);
router.delete(
  '/:id',
  validateResource(paramsWithIdSchema),
  productController.deleteProduct
);

export default router;