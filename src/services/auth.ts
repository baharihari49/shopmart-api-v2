import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, TokenPayload } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { RegisterData, LoginCredentials } from '../types';
import redisClient from '../config/redis';

export class AuthService {
  static async register(userData: RegisterData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        verificationToken,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const tokens = generateTokens(tokenPayload);

    // Store refresh token in Redis with expiration (if Redis is available)
    try {
      await redisClient.setEx(
        `refresh_token:${user.id}`,
        7 * 24 * 60 * 60, // 7 days
        tokens.refreshToken
      );
    } catch (redisError) {
      console.warn('Redis not available for storing refresh token');
    }

    return {
      user,
      tokens,
      verificationToken,
    };
  }

  static async login(credentials: LoginCredentials) {
    const { email, password } = credentials;

    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const tokens = generateTokens(tokenPayload);

    // Store refresh token in Redis (if available)
    try {
      await redisClient.setEx(
        `refresh_token:${user.id}`,
        7 * 24 * 60 * 60, // 7 days
        tokens.refreshToken
      );
    } catch (redisError) {
      console.warn('Redis not available for storing refresh token');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  static async logout(userId: string) {
    // Remove refresh token from Redis (if available)
    try {
      await redisClient.del(`refresh_token:${userId}`);
    } catch (redisError) {
      console.warn('Redis not available for logout');
    }
  }

  static async refreshToken(refreshToken: string) {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;

    // Check if refresh token exists in Redis (if available)
    let storedToken = null;
    try {
      storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);
    } catch (redisError) {
      console.warn('Redis not available for token validation');
    }
    
    if (storedToken && storedToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokenPayload: TokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
    };

    const tokens = generateTokens(tokenPayload);

    // Update refresh token in Redis (if available)
    try {
      await redisClient.setEx(
        `refresh_token:${decoded.userId}`,
        7 * 24 * 60 * 60, // 7 days
        tokens.refreshToken
      );
    } catch (redisError) {
      console.warn('Redis not available for updating refresh token');
    }

    return tokens;
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    });

    return {
      resetToken,
      message: 'Password reset token generated',
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Remove all refresh tokens for this user (if Redis is available)
    try {
      await redisClient.del(`refresh_token:${user.id}`);
    } catch (redisError) {
      console.warn('Redis not available for removing refresh tokens');
    }

    return { message: 'Password has been reset successfully' };
  }

  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        isVerified: false,
      },
    });

    if (!user) {
      throw new AppError('Invalid verification token', 400);
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  static async resendVerification(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    return {
      verificationToken,
      message: 'Verification email sent',
    };
  }
}