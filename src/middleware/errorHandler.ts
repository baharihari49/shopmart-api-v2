import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';
import { sendError } from '../utils/responses';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      return new AppError('A record with this information already exists', 409);
    case 'P2025':
      return new AppError('Record not found', 404);
    case 'P2003':
      return new AppError('Invalid reference to related record', 400);
    case 'P2014':
      return new AppError('Invalid ID provided', 400);
    default:
      return new AppError('Database operation failed', 500);
  }
};

const sendErrorDev = (err: AppError, res: Response): void => {
  sendError(res, err.message, err.statusCode, err.stack);
};

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    sendError(res, err.message, err.statusCode);
  } else {
    logger.error('ERROR:', err);
    sendError(res, 'Something went wrong!', 500);
  }
};

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError('Invalid data provided', 400);
  } else if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  } else if (err.name === 'ValidationError') {
    error = new AppError('Validation failed', 400);
  }

  if (!error.statusCode) {
    error.statusCode = 500;
  }

  logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};