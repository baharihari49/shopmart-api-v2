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

    // First, let's check if slug column exists
    try {
      await prisma.$executeRaw`ALTER TABLE products ADD COLUMN slug VARCHAR(255) NULL`;
      console.log('✅ Added slug column');
    } catch (error) {
      console.log('ℹ️  Slug column already exists or error adding it');
    }

    // Get all products
    const products = await prisma.$queryRaw<Array<{id: string, name: string}>>`
      SELECT id, name FROM products
    `;

    console.log(`📦 Found ${products.length} products to update`);

    // Update each product with a slug
    for (const product of products) {
      let baseSlug = createSlug(product.name);
      let slug = baseSlug;
      let counter = 1;

      // Check for duplicate slugs
      while (true) {
        const existing = await prisma.$queryRaw<Array<{id: string}>>`
          SELECT id FROM products WHERE slug = ${slug} AND id != ${product.id}
        `;

        if (existing.length === 0) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.$executeRaw`
        UPDATE products SET slug = ${slug} WHERE id = ${product.id}
      `;

      console.log(`✅ Updated product: ${product.name} -> ${slug}`);
    }

    // Add index
    try {
      await prisma.$executeRaw`CREATE INDEX idx_products_slug ON products(slug)`;
      console.log('✅ Added index on slug column');
    } catch (error) {
      console.log('ℹ️  Index already exists or error adding it');
    }

    // Add unique constraint
    try {
      await prisma.$executeRaw`ALTER TABLE products ADD CONSTRAINT unique_product_slug UNIQUE (slug)`;
      console.log('✅ Added unique constraint on slug column');
    } catch (error) {
      console.log('ℹ️  Unique constraint already exists or error adding it');
    }

    console.log('🎉 Successfully added slugs to all products!');
  } catch (error) {
    console.error('❌ Error adding product slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addProductSlugs();