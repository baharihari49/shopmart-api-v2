import prisma from '../src/config/database';

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

async function addProductSlugs() {
  try {
    console.log('🔄 Starting to add slugs to products...');

    // First, let's add the slug column without unique constraint
    await prisma.$executeRaw`ALTER TABLE products ADD COLUMN slug VARCHAR(255) NULL`;
    console.log('✅ Added slug column');

    // Add index on slug for better performance
    await prisma.$executeRaw`CREATE INDEX idx_products_slug ON products(slug)`;
    console.log('✅ Added index on slug column');

    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`📦 Found ${products.length} products to update`);

    // Update each product with a slug
    for (const product of products) {
      let baseSlug = createSlug(product.name);
      let slug = baseSlug;
      let counter = 1;

      // Check for duplicate slugs and make them unique
      while (true) {
        const existing = await prisma.product.findFirst({
          where: {
            slug: slug,
            NOT: { id: product.id },
          },
        });

        if (!existing) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { slug },
      });

      console.log(`✅ Updated product: ${product.name} -> ${slug}`);
    }

    // Now add the unique constraint
    await prisma.$executeRaw`ALTER TABLE products ADD CONSTRAINT unique_product_slug UNIQUE (slug)`;
    console.log('✅ Added unique constraint on slug column');

    // Make slug column NOT NULL
    await prisma.$executeRaw`ALTER TABLE products MODIFY COLUMN slug VARCHAR(255) NOT NULL`;
    console.log('✅ Made slug column required');

    console.log('🎉 Successfully added slugs to all products!');
  } catch (error) {
    console.error('❌ Error adding product slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addProductSlugs();