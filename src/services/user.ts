import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AddressData, PaymentMethodData } from '../types';

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        isVerified: true,
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async updateProfile(userId: string, updateData: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        isVerified: true,
        preferences: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async updatePreferences(userId: string, preferences: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const currentPreferences = user.preferences as any;
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { preferences: updatedPreferences },
      select: {
        id: true,
        preferences: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  static async deleteAccount(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }

  // Address management
  static async getAddresses(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return addresses;
  }

  static async createAddress(userId: string, addressData: AddressData) {
    // If this is set as default, remove default from other addresses
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });

    return address;
  }

  static async updateAddress(userId: string, addressId: string, addressData: Partial<AddressData>) {
    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new AppError('Address not found', 404);
    }

    // If this is set as default, remove default from other addresses
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });

    return address;
  }

  static async deleteAddress(userId: string, addressId: string) {
    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new AppError('Address not found', 404);
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  static async setDefaultAddress(userId: string, addressId: string) {
    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new AppError('Address not found', 404);
    }

    // Remove default from all addresses
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set this address as default
    const address = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return address;
  }

  // Payment method management
  static async getPaymentMethods(userId: string) {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
      select: {
        id: true,
        type: true,
        last4: true,
        brand: true,
        expiryMonth: true,
        expiryYear: true,
        isDefault: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return paymentMethods;
  }

  static async createPaymentMethod(userId: string, paymentData: PaymentMethodData) {
    // If this is set as default, remove default from other payment methods
    if (paymentData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        ...paymentData,
        userId,
      },
    });

    return paymentMethod;
  }

  static async updatePaymentMethod(userId: string, paymentMethodId: string, paymentData: Partial<PaymentMethodData>) {
    // Check if payment method belongs to user
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!existingPaymentMethod) {
      throw new AppError('Payment method not found', 404);
    }

    // If this is set as default, remove default from other payment methods
    if (paymentData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId, id: { not: paymentMethodId } },
        data: { isDefault: false },
      });
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: paymentData,
    });

    return paymentMethod;
  }

  static async deletePaymentMethod(userId: string, paymentMethodId: string) {
    // Check if payment method belongs to user
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!existingPaymentMethod) {
      throw new AppError('Payment method not found', 404);
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return { message: 'Payment method deleted successfully' };
  }

  static async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    // Check if payment method belongs to user
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!existingPaymentMethod) {
      throw new AppError('Payment method not found', 404);
    }

    // Remove default from all payment methods
    await prisma.paymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set this payment method as default
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });

    return paymentMethod;
  }
}