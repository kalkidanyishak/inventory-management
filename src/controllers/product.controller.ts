import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as productService from '../services/product.service';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newProduct] = await go(productService.createProduct(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Product created successfully', product: newProduct });
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const [error, products] = await go(productService.getAllProducts());

  if (error) return next(error);

  res.status(200).json(products);
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  const [error, product] = await go(productService.getProductById(id));

  if (error) return next(error);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  const [error, updatedProduct] = await go(productService.updateProduct(id, req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
};

export const updateProductVariant = async (req: Request, res: Response, next: NextFunction) => {
  const { variantId } = req.params;
  if (!variantId) {
    return res.status(400).json({ message: 'Variant ID is required' });
  }
  const [error, updatedVariant] = await go(productService.updateProductVariant(variantId, req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Product variant updated successfully', variant: updatedVariant });
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  const [error] = await go(productService.deleteProduct(id));

  if (error) return next(error);

  res.status(200).json({ message: 'Product deleted successfully' });
};