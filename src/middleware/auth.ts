import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/responses';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { AppError } from './errorHandler';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return sendError(res, 'Access token is required', 401) as any;
    }

    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        isVerified: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 401) as any;
    }

    req.user = user as any;
    req.userId = user.id;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401) as any;
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          isVerified: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (user) {
        req.user = user as any;
        req.userId = user.id;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};