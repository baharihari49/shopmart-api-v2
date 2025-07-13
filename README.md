# ShopMart Backend API v2

A comprehensive e-commerce backend API built with Express.js, TypeScript, Prisma, and MySQL.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **User Management**: Profile management, addresses, payment methods
- **Product Catalog**: Products, categories, brands with search and filtering
- **Shopping Cart**: Guest and user carts with session management
- **Wishlist**: User wishlist functionality
- **Security**: Rate limiting, input validation, security headers
- **Database**: MySQL with Prisma ORM
- **Caching**: Redis for sessions and caching
- **Error Handling**: Comprehensive error handling with logging

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Winston** - Logging
- **Express Validator** - Input validation

## Prerequisites

- Node.js (v18+)
- MySQL
- Redis (optional but recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shopmart-api-v2
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Setup the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://0.0.0.0:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update preferences
- `DELETE /api/users/account` - Delete account
- `GET /api/users/addresses` - Get addresses
- `POST /api/users/addresses` - Create address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/payment-methods` - Get payment methods
- `POST /api/users/payment-methods` - Add payment method

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products
- `GET /api/products/autocomplete` - Search autocomplete
- `POST /api/products/:id/view` - Track product view
- `GET /api/products/:id/reviews` - Get product reviews
- `GET /api/products/:id/recommendations` - Related products

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Get category details
- `GET /api/categories/:slug/products` - Get category products

### Brands
- `GET /api/brands` - List all brands
- `GET /api/brands/:slug` - Get brand details
- `GET /api/brands/:slug/products` - Get brand products

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/sync` - Sync guest cart

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/items` - Add to wishlist
- `DELETE /api/wishlist/items/:id` - Remove from wishlist
- `DELETE /api/wishlist` - Clear wishlist

## Database Schema

The database uses the following main entities:

- **Users**: User accounts with authentication
- **Products**: Product catalog with categories and brands
- **Cart/Wishlist**: Shopping cart and wishlist functionality
- **Orders**: Order management system
- **Reviews**: Product reviews and ratings
- **Addresses**: User shipping/billing addresses
- **Payment Methods**: Stored payment methods

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

- JWT authentication with refresh tokens
- Rate limiting on API endpoints
- Input validation and sanitization
- Security headers with Helmet
- Password hashing with bcrypt
- CORS configuration

## Error Handling

The API includes comprehensive error handling with:
- Global error handler middleware
- Custom error classes
- Structured error responses
- Logging with Winston

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License