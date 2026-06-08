import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear los errores de Zod de manera amigable
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.slice(1).join('.'), // remueve el prefijo 'body', 'query', etc.
          message: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          message: 'Error de validación de datos',
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
}
