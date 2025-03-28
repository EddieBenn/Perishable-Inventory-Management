import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import createHttpError, { HttpError } from 'http-errors';
import winstonLogger from './logger.middleware';

export function globalExceptionHandler(error: Error | ZodError, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = undefined;

  if (createHttpError.isHttpError(error)) {
    statusCode = error.status;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
  } else if (error instanceof Error) {
    message = error.message || 'Something went wrong';
  }

  winstonLogger.error(`[ERROR] ${req.method} ${req.url}: ${error.message}`, {
    method: req.method,
    url: req.url,
    statusCode: statusCode,
    stack: error.stack,
    errors: errors,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
    path: req.url,
    timestamp: new Date().toISOString(),
    errors: errors,
  });
}

export function getErrorMessage(error: Error | ZodError | HttpError): { error: string } {
  if (error instanceof ZodError) {
    return { error: error.errors[0].message };
  } else if (createHttpError.isHttpError(error)) {
    return { error: error.message };
  } else if (error instanceof Error) {
    return { error: error.message };
  }
  return { error: 'An unexpected error occurred' };
}
