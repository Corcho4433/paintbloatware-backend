import { ServerError, NotFound } from "./server_errors";
import { type NextFunction, type Request, type Response } from "express";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof ServerError) {
    res.status(error.error_code).json({
      success: false,
      error: {
        message: error.message,
        code: error.error_code,
        type: error.constructor.name
      }
    });

    return
  }
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFound(`Route ${req.originalUrl} not found`);
  next(error);
};