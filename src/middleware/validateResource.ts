import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Creates an Express middleware for validating request data against a Zod schema.
 * This is a generic factory function that can be used for any route.
 *
 * @param schema The Zod schema to validate against (`z.object({ body: ..., params: ..., query: ... })`).
 * @returns An Express middleware function.
 */
const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(error.errors);
      }
      next(error);
    }
  };

export default validateResource;