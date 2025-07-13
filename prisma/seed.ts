import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.reviewHelpfulness.deleteMany();
  await prisma.review.deleteMany();
  await prisma.searchQuery.deleteMany();
  await prisma.productView.deleteMany();
  await prisma.userBehavior.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.shippingMethod.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture and home decor',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Books and educational materials',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        sortOrder: 5,
      },
    }),
  ]);

  // Create subcategories
  const subcategories = await Promise.all([
    // Electronics subcategories
    prisma.category.create({
      data: {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        parentId: categories[0].id,
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Notebooks and accessories',
        parentId: categories[0].id,
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Audio',
        slug: 'audio',
        description: 'Headphones, speakers, and audio equipment',
        parentId: categories[0].id,
        sortOrder: 3,
      },
    }),
    // Fashion subcategories
    prisma.category.create({
      data: {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Clothing for men',
        parentId: categories[1].id,
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Clothing for women',
        parentId: categories[1].id,
        sortOrder: 2,
      },
    }),
  ]);

  // Create Brands
  console.log('🏷️ Creating brands...');
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Apple',
        slug: 'apple',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        description: 'Think Different',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Samsung',
        slug: 'samsung',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg',
        description: 'Inspire the World, Create the Future',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Sony',
        slug: 'sony',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
        description: 'Be Moved',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Nike',
        slug: 'nike',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
        description: 'Just Do It',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Adidas',
        slug: 'adidas',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
        description: 'Impossible is Nothing',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'IKEA',
        slug: 'ikea',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg',
        description: 'The Wonderful Everyday',
      },
    }),
  ]);

  // Create Products
  console.log('📦 Creating products...');
  const products = await Promise.all([
    // Smartphones
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro Max',
        description: 'The latest flagship iPhone with titanium design and advanced camera system',
        price: 1199.99,
        originalPrice: 1299.99,
        sku: 'IPHONE15PROMAX',
        categoryId: subcategories[0].id, // Smartphones
        brandId: brands[0].id, // Apple
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600',
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
        ],
        specifications: {
          display: '6.7-inch Super Retina XDR',
          chip: 'A17 Pro',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: '4422 mAh',
          storage: '256GB',
          ram: '8GB',
          connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
        },
        features: ['Face ID', 'Wireless Charging', 'Water Resistant IP68', 'ProMotion 120Hz', 'Always-On Display'],
        stockCount: 50,
        badge: 'BESTSELLER',
        rating: 4.8,
        reviewCount: 1250,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android flagship with S Pen and AI features',
        price: 1099.99,
        originalPrice: 1299.99,
        sku: 'SAMSUNGS24ULTRA',
        categoryId: subcategories[0].id,
        brandId: brands[1].id,
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
        ],
        specifications: {
          display: '6.8-inch Dynamic AMOLED 2X',
          chip: 'Snapdragon 8 Gen 3',
          camera: '200MP Main + 50MP + 12MP + 10MP',
          battery: '5000 mAh',
          storage: '512GB',
          ram: '12GB',
        },
        features: ['S Pen', 'Wireless Charging', 'Water Resistant IP68', '120Hz Display', 'Galaxy AI'],
        stockCount: 35,
        badge: 'NEW',
        rating: 4.7,
        reviewCount: 890,
      },
    }),

    // Laptops
    prisma.product.create({
      data: {
        name: 'MacBook Pro 16" M3 Max',
        description: 'Professional laptop with incredible performance and battery life',
        price: 3499.99,
        originalPrice: 3999.99,
        sku: 'MACBOOKPRO16M3',
        categoryId: subcategories[1].id,
        brandId: brands[0].id,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        ],
        specifications: {
          display: '16.2-inch Liquid Retina XDR',
          chip: 'Apple M3 Max',
          memory: '36GB Unified Memory',
          storage: '1TB SSD',
          battery: 'Up to 22 hours',
          ports: '3x Thunderbolt 4, HDMI, SD Card, MagSafe 3',
        },
        features: ['Touch ID', 'ProMotion 120Hz', 'Mini-LED Display', '1080p FaceTime HD Camera'],
        stockCount: 20,
        badge: 'PRO',
        rating: 4.9,
        reviewCount: 450,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy Book4 Ultra',
        description: 'Premium Windows laptop with AMOLED display',
        price: 2399.99,
        sku: 'GALAXYBOOK4ULTRA',
        categoryId: subcategories[1].id,
        brandId: brands[1].id,
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        ],
        specifications: {
          display: '16-inch 3K AMOLED',
          processor: 'Intel Core Ultra 9',
          graphics: 'NVIDIA RTX 4070',
          memory: '32GB DDR5',
          storage: '1TB NVMe SSD',
        },
        features: ['Touchscreen', 'S Pen Support', 'Thunderbolt 4', 'Windows Hello'],
        stockCount: 15,
        rating: 4.6,
        reviewCount: 120,
      },
    }),

    // Audio
    prisma.product.create({
      data: {
        name: 'AirPods Pro (2nd Generation)',
        description: 'Premium noise cancelling earbuds with spatial audio',
        price: 249.99,
        sku: 'AIRPODSPRO2',
        categoryId: subcategories[2].id,
        brandId: brands[0].id,
        images: [
          'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
          'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
        ],
        specifications: {
          type: 'In-ear',
          connectivity: 'Bluetooth 5.3',
          battery: 'Up to 6 hours (30 hours with case)',
          features: 'Active Noise Cancellation, Transparency Mode',
        },
        features: ['Adaptive Transparency', 'Personalized Spatial Audio', 'MagSafe Charging', 'IPX4 Water Resistant'],
        stockCount: 100,
        badge: 'POPULAR',
        rating: 4.7,
        reviewCount: 2300,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sony WH-1000XM5',
        description: 'Industry leading noise cancelling headphones',
        price: 379.99,
        originalPrice: 399.99,
        sku: 'SONYWH1000XM5',
        categoryId: subcategories[2].id,
        brandId: brands[2].id,
        images: [
          'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        ],
        specifications: {
          type: 'Over-ear',
          connectivity: 'Bluetooth 5.2',
          battery: 'Up to 30 hours',
          drivers: '30mm',
        },
        features: ['Industry Leading ANC', 'Multipoint Connection', 'Speak-to-Chat', 'Quick Charge'],
        stockCount: 75,
        rating: 4.8,
        reviewCount: 1890,
      },
    }),

    // Fashion - Men's
    prisma.product.create({
      data: {
        name: 'Nike Air Max 90',
        description: 'Classic sneakers with visible Air cushioning',
        price: 129.99,
        sku: 'NIKEAIRMAX90',
        categoryId: subcategories[3].id,
        brandId: brands[3].id,
        images: [
          'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800',
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
        ],
        specifications: {
          material: 'Leather and mesh upper',
          sole: 'Rubber with Air Max unit',
          style: 'Casual/Athletic',
          sizes: '7-13 US',
        },
        features: ['Air Max Cushioning', 'Padded Collar', 'Rubber Waffle Outsole'],
        stockCount: 60,
        badge: 'TRENDING',
        rating: 4.6,
        reviewCount: 780,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Adidas Essentials Hoodie',
        description: 'Comfortable cotton blend hoodie for everyday wear',
        price: 54.99,
        originalPrice: 65.00,
        sku: 'ADIDASESSENTIALHOODIE',
        categoryId: subcategories[3].id,
        brandId: brands[4].id,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        ],
        specifications: {
          material: '70% Cotton, 30% Polyester',
          fit: 'Regular Fit',
          care: 'Machine washable',
          sizes: 'S, M, L, XL, XXL',
        },
        features: ['Kangaroo Pocket', 'Adjustable Hood', 'Ribbed Cuffs', '3-Stripes Logo'],
        stockCount: 120,
        rating: 4.5,
        reviewCount: 340,
      },
    }),

    // Fashion - Women's
    prisma.product.create({
      data: {
        name: 'Nike Yoga Luxe Leggings',
        description: 'Premium yoga leggings with Infinalon fabric',
        price: 89.99,
        sku: 'NIKEYOGALUXE',
        categoryId: subcategories[4].id,
        brandId: brands[3].id,
        images: [
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
          'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
        ],
        specifications: {
          material: 'Infinalon fabric blend',
          fit: 'Tight fit',
          rise: 'High rise',
          sizes: 'XS-2XL',
        },
        features: ['Seamless Construction', 'Sweat-Wicking', '4-Way Stretch', 'Hidden Pocket'],
        stockCount: 85,
        badge: 'ECO-FRIENDLY',
        rating: 4.7,
        reviewCount: 560,
      },
    }),

    // Home & Living
    prisma.product.create({
      data: {
        name: 'IKEA POÄNG Armchair',
        description: 'Comfortable armchair with bent wood frame',
        price: 149.99,
        sku: 'IKEAPOANG',
        categoryId: categories[2].id,
        brandId: brands[5].id,
        images: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        ],
        specifications: {
          dimensions: 'W: 68cm, D: 82cm, H: 100cm',
          material: 'Bent birch wood, Cotton cushion',
          weight: '16kg',
          assembly: 'Required',
        },
        features: ['Ergonomic Design', 'Multiple Color Options', 'Washable Cushion Cover', '10 Year Warranty'],
        stockCount: 30,
        rating: 4.4,
        reviewCount: 890,
      },
    }),

    // Sports & Outdoors
    prisma.product.create({
      data: {
        name: 'Nike Training Mat',
        description: 'Premium exercise mat for yoga and fitness',
        price: 59.99,
        sku: 'NIKETRAININGMAT',
        categoryId: categories[3].id,
        brandId: brands[3].id,
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
        ],
        specifications: {
          dimensions: '183cm x 61cm x 8mm',
          material: 'NBR foam',
          weight: '1.2kg',
          color: 'Black/Grey',
        },
        features: ['Non-Slip Surface', 'Extra Thick Cushioning', 'Carrying Strap', 'Easy to Clean'],
        stockCount: 200,
        rating: 4.5,
        reviewCount: 445,
      },
    }),

    // Books
    prisma.product.create({
      data: {
        name: 'The Psychology of Money',
        description: 'Timeless lessons on wealth, greed, and happiness',
        price: 24.99,
        originalPrice: 28.00,
        sku: 'BOOKPSYCHOLOGYMONEY',
        categoryId: categories[4].id,
        brandId: brands[0].id, // Using Apple as placeholder
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
        ],
        specifications: {
          author: 'Morgan Housel',
          pages: '256',
          publisher: 'Harriman House',
          language: 'English',
          isbn: '9780857197689',
        },
        features: ['Bestseller', 'Hardcover Edition', 'Financial Education', 'Easy to Read'],
        stockCount: 150,
        badge: 'BESTSELLER',
        rating: 4.8,
        reviewCount: 2340,
      },
    }),
  ]);

  // Create Shipping Methods
  console.log('🚚 Creating shipping methods...');
  await Promise.all([
    prisma.shippingMethod.create({
      data: {
        name: 'Standard Shipping',
        description: 'Delivery in 5-7 business days',
        price: 5.99,
        estimatedDays: '5-7 days',
        icon: '📦',
        sortOrder: 1,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Express Shipping',
        description: 'Delivery in 2-3 business days',
        price: 12.99,
        estimatedDays: '2-3 days',
        icon: '🚚',
        sortOrder: 2,
      },
    }),
    prisma.shippingMethod.create({
      data: {
        name: 'Next Day Delivery',
        description: 'Delivery by tomorrow',
        price: 24.99,
        estimatedDays: '1 day',
        icon: '🚀',
        sortOrder: 3,
      },
    }),
  ]);

  // Create Promo Codes
  console.log('🎟️ Creating promo codes...');
  await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        description: 'Welcome discount for new customers',
        minOrderAmount: 50,
        usageLimit: 1000,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'SAVE20',
        type: 'FIXED',
        value: 20,
        description: 'Save $20 on orders over $100',
        minOrderAmount: 100,
        usageLimit: 500,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
  ]);

  // Create Test User
  console.log('👤 Creating test user...');
  const hashedPwd = await hashPassword('Test@123');
  const testUser = await prisma.user.create({
    data: {
      email: 'test@shopmart.com',
      password: hashedPwd,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      isVerified: true,
      preferences: {
        newsletter: true,
        emailNotifications: true,
        smsNotifications: false,
        language: 'en',
        currency: 'USD',
        theme: 'light',
      },
    },
  });

  // Create Address for Test User
  await prisma.address.create({
    data: {
      userId: testUser.id,
      type: 'HOME',
      isDefault: true,
      firstName: 'Test',
      lastName: 'User',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1234567890',
    },
  });

  console.log('✅ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Categories: ${categories.length + subcategories.length}`);
  console.log(`- Brands: ${brands.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Test User: test@shopmart.com (password: Test@123)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });