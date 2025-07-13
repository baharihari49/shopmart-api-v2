# ShopMart API Documentation

## Overview

ShopMart is a comprehensive e-commerce backend API built with Express.js, TypeScript, Prisma, and MySQL. This API provides all the necessary endpoints for building a full-featured e-commerce application.

**Base URL:** `http://0.0.0.0:5000`  
**API Version:** v1  
**Environment:** Development  

## Table of Contents

- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Products](#product-endpoints)
  - [Categories](#category-endpoints)
  - [Brands](#brand-endpoints)
  - [Cart](#cart-endpoints)
  - [Wishlist](#wishlist-endpoints)
  - [Orders](#order-endpoints)
  - [Checkout](#checkout-endpoints)
  - [Reviews](#review-endpoints)
  - [Recommendations](#recommendation-endpoints)
  - [Search](#search-endpoints)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Access Token:** Expires in 15 minutes
- **Refresh Token:** Expires in 7 days
- **Storage:** Refresh tokens are stored in Redis (optional)

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

### Common Error Responses
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "[{\"field\":\"email\",\"message\":\"Please provide a valid email\"}]"
}
```

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **API Endpoints:** 60 requests per minute per IP

## API Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "ShopMart API is healthy",
  "timestamp": "2025-07-13T12:00:00.000Z"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Validation Rules:**
- `email`: Valid email address
- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `firstName`: 2-50 characters
- `lastName`: 2-50 characters
- `phone`: Valid phone number (optional)

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "isVerified": false,
      "createdAt": "2025-07-13T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token",
      "expiresIn": "15m"
    }
  }
}
```

### POST /api/auth/login
Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": true,
      "lastLoginAt": "2025-07-13T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token",
      "expiresIn": "15m"
    }
  }
}
```

### POST /api/auth/logout
Logout user and invalidate refresh token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-refresh-token",
    "expiresIn": "15m"
  }
}
```

### POST /api/auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent"
}
```

### POST /api/auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset-token",
  "password": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

### GET /api/auth/verify-email/:token
Verify email address using verification token.

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### POST /api/auth/resend-verification
Resend email verification.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

## User Endpoints

**All user endpoints require authentication**

### GET /api/users/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": "https://example.com/avatar.jpg",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "MALE",
    "isVerified": true,
    "preferences": {
      "newsletter": true,
      "emailNotifications": true,
      "language": "en",
      "currency": "USD"
    },
    "lastLoginAt": "2025-07-13T12:00:00.000Z",
    "createdAt": "2025-07-13T10:00:00.000Z",
    "updatedAt": "2025-07-13T12:00:00.000Z"
  }
}
```

### PUT /api/users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user profile
  }
}
```

### PUT /api/users/preferences
Update user preferences.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "newsletter": true,
  "emailNotifications": false,
  "smsNotifications": true,
  "language": "en",
  "currency": "USD",
  "theme": "dark"
}
```

### DELETE /api/users/account
Delete user account.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## Address Management

### GET /api/users/addresses
Get user addresses.

**Response:**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "type": "HOME",
      "isDefault": true,
      "firstName": "John",
      "lastName": "Doe",
      "company": "Company Inc.",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA",
      "phone": "+1234567890",
      "createdAt": "2025-07-13T10:00:00.000Z"
    }
  ]
}
```

### POST /api/users/addresses
Create new address.

**Request Body:**
```json
{
  "type": "HOME",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Company Inc.",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "phone": "+1234567890",
  "isDefault": true
}
```

### PUT /api/users/addresses/:id
Update address.

### DELETE /api/users/addresses/:id
Delete address.

### PUT /api/users/addresses/:id/default
Set address as default.

## Payment Methods

### GET /api/users/payment-methods
Get user payment methods.

**Response:**
```json
{
  "success": true,
  "message": "Payment methods retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "type": "CREDIT_CARD",
      "last4": "4242",
      "brand": "visa",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "isDefault": true,
      "isVerified": true,
      "createdAt": "2025-07-13T10:00:00.000Z"
    }
  ]
}
```

### POST /api/users/payment-methods
Add payment method.

### PUT /api/users/payment-methods/:id
Update payment method.

### DELETE /api/users/payment-methods/:id
Delete payment method.

### PUT /api/users/payment-methods/:id/default
Set payment method as default.

---

## Product Endpoints

### GET /api/products
Get products with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Filter by category slug
- `brand`: Filter by brand slug
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search query
- `sortBy`: Sort field (price, rating, name, createdAt)
- `sortOrder`: Sort order (asc, desc)
- `inStock`: Filter in-stock items (true, false)

**Example:**
```
GET /api/products?page=1&limit=12&category=electronics&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc
```

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone with advanced features",
      "price": 999.99,
      "originalPrice": 1099.99,
      "sku": "IPHONE15PRO",
      "images": ["image1.jpg", "image2.jpg"],
      "inStock": true,
      "stockCount": 50,
      "badge": "BESTSELLER",
      "rating": 4.8,
      "reviewCount": 156,
      "category": {
        "id": "uuid",
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "brand": {
        "id": "uuid",
        "name": "Apple",
        "slug": "apple"
      },
      "createdAt": "2025-07-13T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "totalPages": 13
  }
}
```

### GET /api/products/:id
Get single product details.

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": 999.99,
    "originalPrice": 1099.99,
    "sku": "IPHONE15PRO",
    "images": ["image1.jpg", "image2.jpg"],
    "specifications": {
      "display": "6.1-inch Super Retina XDR",
      "chip": "A17 Pro",
      "storage": "128GB"
    },
    "features": ["Face ID", "Wireless Charging", "5G"],
    "inStock": true,
    "stockCount": 50,
    "rating": 4.8,
    "reviewCount": 156,
    "category": {
      "id": "uuid",
      "name": "Smartphones",
      "slug": "smartphones"
    },
    "brand": {
      "id": "uuid",
      "name": "Apple",
      "slug": "apple",
      "logo": "apple-logo.png"
    },
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "title": "Excellent phone!",
        "comment": "Great performance and camera quality",
        "user": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "D.",
          "avatar": "avatar.jpg"
        },
        "createdAt": "2025-07-13T10:00:00.000Z"
      }
    ]
  }
}
```

### GET /api/products/search
Search products.

**Query Parameters:**
- `q`: Search query
- `limit`: Number of results (default: 10)

**Example:**
```
GET /api/products/search?q=iphone&limit=5
```

### GET /api/products/autocomplete
Get search suggestions.

**Query Parameters:**
- `q`: Search query
- `limit`: Number of suggestions (default: 5)

**Response:**
```json
{
  "success": true,
  "message": "Autocomplete suggestions",
  "data": [
    {
      "id": "uuid",
      "value": "iPhone 15 Pro",
      "label": "iPhone 15 Pro"
    }
  ]
}
```

### GET /api/products/trending
Get trending products.

**Query Parameters:**
- `limit`: Number of products (default: 10)

### POST /api/products/:id/view
Track product view (optional authentication).

**Headers:** `Authorization: Bearer <token>` (optional)
**Headers:** `X-Session-ID: <session-id>` (for guest users)

### GET /api/products/:id/reviews
Get product reviews.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

### GET /api/products/:id/recommendations
Get related products.

**Query Parameters:**
- `limit`: Number of products (default: 8)

---

## Category Endpoints

### GET /api/categories
Get all categories with hierarchy.

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "image": "electronics.jpg",
      "isActive": true,
      "sortOrder": 1,
      "children": [
        {
          "id": "uuid",
          "name": "Smartphones",
          "slug": "smartphones",
          "isActive": true,
          "sortOrder": 1
        }
      ],
      "_count": {
        "products": 150
      },
      "createdAt": "2025-07-13T10:00:00.000Z"
    }
  ]
}
```

### GET /api/categories/:slug
Get category details.

### GET /api/categories/:slug/products
Get products in category.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

---

## Brand Endpoints

### GET /api/brands
Get all brands.

**Response:**
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Apple",
      "slug": "apple",
      "logo": "apple-logo.png",
      "description": "Technology company",
      "isActive": true,
      "_count": {
        "products": 25
      },
      "createdAt": "2025-07-13T10:00:00.000Z"
    }
  ]
}
```

### GET /api/brands/:slug
Get brand details.

### GET /api/brands/:slug/products
Get products by brand.

---

## Cart Endpoints

**Authentication is optional for guest carts**

### GET /api/cart
Get cart contents.

**Headers:** 
- `Authorization: Bearer <token>` (optional)
- `X-Session-ID: <session-id>` (for guest users)

**Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "priceAtTime": 999.99,
        "product": {
          "id": "uuid",
          "name": "iPhone 15 Pro",
          "price": 999.99,
          "images": ["image1.jpg"],
          "inStock": true,
          "stockCount": 50,
          "brand": {
            "name": "Apple"
          }
        },
        "createdAt": "2025-07-13T10:00:00.000Z"
      }
    ],
    "subtotal": 1999.98,
    "itemCount": 2,
    "createdAt": "2025-07-13T10:00:00.000Z"
  }
}
```

### POST /api/cart/items
Add item to cart.

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": "uuid",
    "quantity": 1,
    "priceAtTime": 999.99,
    "product": {
      "id": "uuid",
      "name": "iPhone 15 Pro",
      "price": 999.99,
      "images": ["image1.jpg"]
    }
  }
}
```

### PUT /api/cart/items/:id
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

### DELETE /api/cart/items/:id
Remove item from cart.

### DELETE /api/cart
Clear entire cart.

### POST /api/cart/sync
Sync guest cart with user cart (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

---

## Wishlist Endpoints

**All wishlist endpoints require authentication**

### GET /api/wishlist
Get user wishlist.

**Response:**
```json
{
  "success": true,
  "message": "Wishlist retrieved successfully",
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "product": {
          "id": "uuid",
          "name": "iPhone 15 Pro",
          "price": 999.99,
          "originalPrice": 1099.99,
          "images": ["image1.jpg"],
          "inStock": true,
          "rating": 4.8,
          "reviewCount": 156,
          "badge": "BESTSELLER",
          "brand": {
            "name": "Apple"
          },
          "category": {
            "name": "Smartphones"
          }
        },
        "createdAt": "2025-07-13T10:00:00.000Z"
      }
    ],
    "createdAt": "2025-07-13T09:00:00.000Z"
  }
}
```

### POST /api/wishlist/items
Add item to wishlist.

**Request Body:**
```json
{
  "productId": "uuid"
}
```

### DELETE /api/wishlist/items/:id
Remove item from wishlist by item ID.

### DELETE /api/wishlist/products/:productId
Remove item from wishlist by product ID.

### DELETE /api/wishlist
Clear entire wishlist.

### GET /api/wishlist/check/:productId
Check if product is in wishlist.

**Response:**
```json
{
  "success": true,
  "message": "Wishlist status checked",
  "data": {
    "isInWishlist": true
  }
}
```

### POST /api/wishlist/items/:id/move-to-cart
Move item from wishlist to cart.

---

## Order Endpoints

**All order endpoints require authentication**

### GET /api/orders
Get user orders.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by order status

**Response:**
```json
{
  "success": true,
  "message": "Orders endpoint - coming soon",
  "data": []
}
```

### GET /api/orders/:id
Get order details.

### POST /api/orders
Create new order.

### PUT /api/orders/:id/cancel
Cancel order.

### GET /api/orders/:id/tracking
Get order tracking information.

---

## Checkout Endpoints

### GET /api/checkout/shipping-methods
Get available shipping methods.

### POST /api/checkout/calculate
Calculate order totals (requires authentication).

### POST /api/checkout/validate-promo
Validate promo code (requires authentication).

### POST /api/checkout/process
Process payment and create order (requires authentication).

---

## Review Endpoints

### POST /api/reviews/products/:id/reviews
Submit product review (requires authentication).

### PUT /api/reviews/:id
Update review (requires authentication).

### DELETE /api/reviews/:id
Delete review (requires authentication).

### POST /api/reviews/:id/helpful
Mark review as helpful (requires authentication).

---

## Recommendation Endpoints

### GET /api/recommendations/trending
Get trending products.

### GET /api/recommendations/personalized
Get personalized recommendations (optional authentication).

### GET /api/recommendations/similar/:id
Get similar products.

### GET /api/recommendations/bought-together
Get frequently bought together products.

### GET /api/recommendations/recently-viewed
Get recently viewed products (optional authentication).

---

## Search Endpoints

### GET /api/search
General search endpoint.

### GET /api/search/suggestions
Get search suggestions.

### GET /api/search/popular
Get popular searches.

### POST /api/search/track
Track search query (optional authentication).

---

## Data Models

### User Model
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  isVerified: boolean;
  preferences: {
    newsletter: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    currency: string;
    theme: string;
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  images: string[];
  specifications: object;
  features: string[];
  stockCount: number;
  inStock: boolean;
  badge?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  categoryId: string;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Address Model
```typescript
{
  id: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Environment Variables

Required environment variables for the API:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# App Configuration
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"
API_BASE_URL="http://localhost:5000"

# External Services (optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
STRIPE_SECRET_KEY="sk_test_..."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints.

### Example curl requests:

**Register a user:**
```bash
curl -X POST http://0.0.0.0:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Get products:**
```bash
curl http://0.0.0.0:5000/api/products?page=1&limit=5
```

**Add to cart (with authentication):**
```bash
curl -X POST http://0.0.0.0:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "product-uuid",
    "quantity": 1
  }'
```

---

## Support

For API support and questions:
- Check the health endpoint: `GET /health`
- Review error messages in the response
- Ensure proper authentication headers
- Validate request body format

**Note:** This API is currently in development. Some endpoints marked as "coming soon" are placeholder implementations and will be fully developed in future iterations.