import { body } from 'express-validator';

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('gender')
    .optional()
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Gender must be MALE, FEMALE, or OTHER'),
];

export const addressValidation = [
  body('type')
    .isIn(['HOME', 'WORK', 'OTHER'])
    .withMessage('Address type must be HOME, WORK, or OTHER'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('addressLine1')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Address line 1 must be between 5 and 100 characters'),
  
  body('addressLine2')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Address line 2 cannot exceed 100 characters'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('postalCode')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Postal code must be between 3 and 10 characters'),
  
  body('country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
];

export const paymentMethodValidation = [
  body('type')
    .isIn(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER'])
    .withMessage('Payment type must be CREDIT_CARD, DEBIT_CARD, PAYPAL, or BANK_TRANSFER'),
  
  body('stripePaymentMethodId')
    .optional()
    .isString()
    .withMessage('Stripe payment method ID must be a string'),
];

export const preferencesValidation = [
  body('newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter preference must be a boolean'),
  
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications preference must be a boolean'),
  
  body('smsNotifications')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications preference must be a boolean'),
  
  body('language')
    .optional()
    .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'])
    .withMessage('Language must be a valid language code'),
  
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'])
    .withMessage('Currency must be a valid currency code'),
  
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
];