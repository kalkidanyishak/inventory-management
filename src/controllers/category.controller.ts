import { Request, Response, NextFunction } from 'express';
import { go } from '../utils/TryCatch';
import * as categoryService from '../services/category.service';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const [error, newCategory] = await go(categoryService.createCategory(req.body));

  if (error) return next(error);

  res.status(201).json({ message: 'Category created successfully', category: newCategory });
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  const [error, categories] = await go(categoryService.getAllCategories());

  if (error) return next(error);

  res.status(200).json(categories);
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Category id is required' });
  }
  const [error, category] = await go(categoryService.getCategoryById(id));

  if (error) return next(error);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json(category);
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Category id is required' });
  }
  const [error, updatedCategory] = await go(categoryService.updateCategory(id, req.body));

  if (error) return next(error);

  res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Category id is required' });
  }
  const [error] = await go(categoryService.deleteCategory(id));

  if (error) return next(error);

  res.status(200).json({ message: 'Category deleted successfully' });
};