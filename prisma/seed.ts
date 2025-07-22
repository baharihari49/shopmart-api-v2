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

  // Helper function to create slug
  function createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/--+/g, '-');
  }

  // Create Products
  console.log('📦 Creating products...');
  const products = await Promise.all([
    // Smartphones
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro Max',
        slug: createSlug('iPhone 15 Pro Max'),
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
        badge: 'FEATURED',
        rating: 4.8,
        reviewCount: 1250,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24 Ultra',
        slug: createSlug('Samsung Galaxy S24 Ultra'),
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
        slug: createSlug('MacBook Pro 16" M3 Max'),
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
        badge: 'FEATURED',
        rating: 4.9,
        reviewCount: 450,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy Book4 Ultra',
        slug: createSlug('Samsung Galaxy Book4 Ultra'),
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
        slug: createSlug('AirPods Pro (2nd Generation)'),
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
        slug: createSlug('Sony WH-1000XM5'),
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
        slug: createSlug('Nike Air Max 90'),
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
        slug: createSlug('Adidas Essentials Hoodie'),
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
        slug: createSlug('Nike Yoga Luxe Leggings'),
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
        slug: createSlug('IKEA POÄNG Armchair'),
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
        slug: createSlug('Nike Training Mat'),
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
        slug: createSlug('The Psychology of Money'),
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

    // Additional Electronics - Cameras
    prisma.product.create({
      data: {
        name: 'Sony Alpha a7 IV',
        slug: createSlug('Sony Alpha a7 IV'),
        description: 'Full-frame mirrorless camera for professionals',
        price: 2498.00,
        originalPrice: 2799.99,
        sku: 'SONYA7IV',
        categoryId: subcategories[0].id,
        brandId: brands[2].id,
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
          'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=800',
        ],
        specifications: {
          sensor: '33MP Full-Frame CMOS',
          video: '4K 60fps',
          iso: '100-51200',
          autofocus: '759 Phase-Detection Points',
          stabilization: '5.5-stop In-Body',
          viewfinder: '3.68M-dot OLED EVF',
        },
        features: ['Real-time Eye AF', 'Dual Card Slots', '10fps Burst', '5-axis IBIS', 'Weather Sealed'],
        stockCount: 12,
        badge: 'PRO',
        rating: 4.9,
        reviewCount: 567,
      },
    }),

    // Camera Lens
    prisma.product.create({
      data: {
        name: 'Professional Camera Lens 50mm f/1.8',
        slug: createSlug('Professional Camera Lens 50mm f/1.8'),
        description: 'Fast prime lens perfect for portraits and low-light photography',
        price: 399.99,
        originalPrice: 449.99,
        sku: 'LENS50MM18',
        categoryId: subcategories[0].id,
        brandId: brands[2].id, // Sony
        images: [
          'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=800',
          'https://images.unsplash.com/photo-1617638924951-92d272ce9b77?w=800',
          'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800',
        ],
        specifications: {
          focalLength: '50mm',
          aperture: 'f/1.8 - f/22',
          mount: 'E-Mount / RF Mount / Z Mount',
          elements: '7 elements in 6 groups',
          weight: '186g',
          filter: '49mm',
        },
        features: ['Ultra-fast Autofocus', 'Bokeh Effect', 'Compact Design', 'Weather Resistant', 'Nano Coating'],
        stockCount: 45,
        badge: 'FEATURED',
        rating: 4.7,
        reviewCount: 892,
      },
    }),

    // Gaming Console
    prisma.product.create({
      data: {
        name: 'PlayStation 5 Digital Edition',
        slug: createSlug('PlayStation 5 Digital Edition'),
        description: 'Next-gen gaming console with ultra-high speed SSD',
        price: 449.99,
        originalPrice: 499.99,
        sku: 'PS5DIGITAL',
        categoryId: subcategories[0].id,
        brandId: brands[2].id,
        images: [
          'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        ],
        specifications: {
          cpu: 'AMD Zen 2 8-core',
          gpu: 'AMD RDNA 2',
          memory: '16GB GDDR6',
          storage: '825GB SSD',
          resolution: 'Up to 4K 120fps / 8K',
        },
        features: ['Ray Tracing', 'Tempest 3D AudioTech', 'DualSense Controller', 'Backward Compatible'],
        stockCount: 25,
        badge: 'TRENDING',
        rating: 4.8,
        reviewCount: 1890,
      },
    }),

    // Smart Watch
    prisma.product.create({
      data: {
        name: 'Apple Watch Ultra 2',
        slug: createSlug('Apple Watch Ultra 2'),
        description: 'Rugged and capable smartwatch for extreme environments',
        price: 799.00,
        originalPrice: 899.00,
        sku: 'APPLEWATCH-ULTRA2',
        categoryId: subcategories[0].id,
        brandId: brands[0].id,
        images: [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
        ],
        specifications: {
          display: '49mm Retina LTPO OLED',
          chip: 'S9 SiP',
          battery: '36 hours typical use',
          water: '100m water resistance',
          storage: '64GB',
        },
        features: ['Precision GPS', 'Cellular', 'Crash Detection', 'Dive Computer', 'Ultra Wideband'],
        stockCount: 30,
        badge: 'FEATURED',
        rating: 4.7,
        reviewCount: 432,
      },
    }),

    // Tablet
    prisma.product.create({
      data: {
        name: 'iPad Pro 12.9" M2',
        slug: createSlug('iPad Pro 12.9" M2'),
        description: 'The ultimate iPad experience with M2 chip',
        price: 1099.00,
        originalPrice: 1299.00,
        sku: 'IPADPRO129M2',
        categoryId: subcategories[1].id,
        brandId: brands[0].id,
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
          'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        ],
        specifications: {
          display: '12.9-inch Liquid Retina XDR',
          chip: 'Apple M2',
          storage: '256GB',
          camera: '12MP Wide + 10MP Ultra Wide',
          connectivity: 'Wi-Fi 6E + 5G',
        },
        features: ['ProMotion 120Hz', 'Face ID', 'Apple Pencil Support', 'Magic Keyboard Compatible'],
        stockCount: 18,
        badge: 'PRO',
        rating: 4.9,
        reviewCount: 678,
      },
    }),

    // Home Tech - Smart Speaker
    prisma.product.create({
      data: {
        name: 'Amazon Echo Show 15',
        slug: createSlug('Amazon Echo Show 15'),
        description: 'Smart display for family organization and entertainment',
        price: 249.99,
        originalPrice: 299.99,
        sku: 'ECHOSHOW15',
        categoryId: categories[2].id,
        brandId: brands[0].id, // Placeholder
        images: [
          'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800',
        ],
        specifications: {
          display: '15.6-inch Full HD',
          processor: 'Amazon AZ2 Neural Edge',
          speakers: '2 x 1.6" full-range drivers',
          camera: '5MP',
        },
        features: ['Alexa Built-in', 'Smart Home Hub', 'Video Calling', 'Photo Frame Mode'],
        stockCount: 40,
        badge: 'POPULAR',
        rating: 4.4,
        reviewCount: 892,
      },
    }),

    // Fashion - Shoes
    prisma.product.create({
      data: {
        name: 'Nike Air Jordan 1 Retro High OG',
        slug: createSlug('Nike Air Jordan 1 Retro High OG'),
        description: 'Iconic basketball shoes with premium leather',
        price: 180.00,
        originalPrice: 200.00,
        sku: 'AIRJORDAN1-RETRO',
        categoryId: subcategories[2].id,
        brandId: brands[3].id,
        images: [
          'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
          'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800',
        ],
        specifications: {
          material: 'Premium Leather Upper',
          sole: 'Rubber',
          closure: 'Lace-up',
          style: 'High-top',
        },
        features: ['Air-Sole Unit', 'Perforated Toe Box', 'Nike Swoosh Logo', 'Padded Collar'],
        stockCount: 15,
        badge: 'TRENDING',
        rating: 4.8,
        reviewCount: 2134,
      },
    }),

    // Fashion - Women's Clothing
    prisma.product.create({
      data: {
        name: 'Lululemon Align High-Rise Pant',
        slug: createSlug('Lululemon Align High-Rise Pant'),
        description: 'Buttery-soft yoga pants with four-way stretch',
        price: 128.00,
        sku: 'LULU-ALIGN-PANT',
        categoryId: subcategories[3].id,
        brandId: brands[3].id, // Placeholder
        images: [
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
        ],
        specifications: {
          fabric: 'Nulu™ fabric',
          rise: 'High-rise 28"',
          features: 'Hidden waistband pocket',
          care: 'Machine wash cold',
        },
        features: ['Buttery Soft', 'Four-way Stretch', 'Breathable', 'Sweat-wicking'],
        stockCount: 25,
        badge: 'BESTSELLER',
        rating: 4.9,
        reviewCount: 3456,
      },
    }),

    // Sports Equipment
    prisma.product.create({
      data: {
        name: 'Peloton Bike+',
        slug: createSlug('Peloton Bike+'),
        description: 'Premium indoor cycling bike with rotating screen',
        price: 2495.00,
        originalPrice: 2795.00,
        sku: 'PELOTON-BIKEPLUS',
        categoryId: categories[3].id,
        brandId: brands[3].id, // Placeholder
        images: [
          'https://images.unsplash.com/photo-1520877745935-616158eb7fcc?w=800',
        ],
        specifications: {
          screen: '23.8" HD Rotating Touchscreen',
          resistance: 'Auto-follow digital resistance',
          speakers: '2.2 channel front-facing stereo',
          dimensions: '59" L x 22" W x 59" H',
        },
        features: ['Live Classes', 'On-demand Workouts', 'Auto-resistance', 'Apple GymKit'],
        stockCount: 8,
        badge: 'PRO',
        rating: 4.7,
        reviewCount: 1234,
      },
    }),

    // Kitchen Appliances
    prisma.product.create({
      data: {
        name: 'Ninja Foodi 11-in-1 Pro',
        slug: createSlug('Ninja Foodi 11-in-1 Pro'),
        description: 'Pressure cooker and air fryer that steams, bakes and more',
        price: 199.99,
        originalPrice: 249.99,
        sku: 'NINJAFOODI11',
        categoryId: categories[2].id,
        brandId: brands[0].id, // Placeholder
        images: [
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
        ],
        specifications: {
          capacity: '8-quart',
          functions: '11 cooking functions',
          pressure: 'Up to 15 psi',
          wattage: '1760 watts',
        },
        features: ['TenderCrisp Technology', 'Dishwasher Safe Parts', 'Recipe Book Included', 'Digital Display'],
        stockCount: 22,
        badge: 'POPULAR',
        rating: 4.6,
        reviewCount: 987,
      },
    }),

    // Books - Additional
    prisma.product.create({
      data: {
        name: 'Atomic Habits',
        slug: createSlug('Atomic Habits'),
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
        price: 27.00,
        originalPrice: 29.00,
        sku: 'BOOK-ATOMICHABITS',
        categoryId: categories[4].id,
        brandId: brands[0].id, // Placeholder
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        ],
        specifications: {
          author: 'James Clear',
          pages: '320',
          publisher: 'Avery',
          language: 'English',
          isbn: '9780735211292',
        },
        features: ['#1 New York Times Bestseller', 'Self-improvement', 'Hardcover', 'Over 10 million copies sold'],
        stockCount: 200,
        badge: 'BESTSELLER',
        rating: 4.9,
        reviewCount: 4567,
      },
    }),

    // Furniture
    prisma.product.create({
      data: {
        name: 'Herman Miller Aeron Chair',
        slug: createSlug('Herman Miller Aeron Chair'),
        description: 'Ergonomic office chair with PostureFit SL',
        price: 1395.00,
        originalPrice: 1795.00,
        sku: 'HERMANMILLER-AERON',
        categoryId: categories[2].id,
        brandId: brands[5].id, // Using IKEA as placeholder
        images: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
        ],
        specifications: {
          size: 'Size B (Medium)',
          material: '8Z Pellicle Mesh',
          warranty: '12 years',
          adjustments: 'Fully adjustable arms, lumbar support',
        },
        features: ['PostureFit SL', 'Tilt Limiter', 'Forward Tilt', 'Harmonic Tilt'],
        stockCount: 10,
        badge: 'PRO',
        rating: 4.8,
        reviewCount: 789,
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

  // Create Sample Product Views for Trending Calculation
  console.log('👁️ Creating sample product views...');
  
  // Add views for popular products to make them trending
  const popularProducts = [
    { product: products[0], views: 150 }, // iPhone 15 Pro Max
    { product: products[1], views: 120 }, // Samsung Galaxy S24 Ultra
    { product: products[2], views: 100 }, // MacBook Pro 16"
    { product: products[13], views: 80 }, // Professional Camera Lens
    { product: products[14], views: 90 }, // PlayStation 5
    { product: products[15], views: 70 }, // Apple Watch Ultra 2
  ];

  const viewsData = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 3); // 3 days ago

  for (const { product, views } of popularProducts) {
    for (let i = 0; i < views; i++) {
      const viewDate = new Date(baseDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
      viewsData.push({
        productId: product.id,
        userId: testUser.id,
        sessionId: `session_${product.id}_${i}`,
        createdAt: viewDate,
      });
    }
  }

  // Create product views in one batch
  await prisma.productView.createMany({
    data: viewsData,
  });

  console.log('✅ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Categories: ${categories.length + subcategories.length}`);
  console.log(`- Brands: ${brands.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Product Views: ${viewsData.length}`);
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