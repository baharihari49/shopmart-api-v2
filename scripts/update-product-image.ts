import prisma from '../src/config/database';

async function updateProductImage() {
  const productId = 'a23ceb19-c819-480b-88b9-439344c416d5';
  
  try {
    // First, let's check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        images: true,
      },
    });

    if (!existingProduct) {
      console.error(`❌ Product with ID ${productId} not found`);
      return;
    }

    console.log(`📦 Found product: ${existingProduct.name}`);
    console.log(`📷 Current images:`, existingProduct.images);

    // Update with new images
    const newImages = [
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
      'https://images.unsplash.com/photo-1618478047375-2a5f5e01ea7f?w=800',
      'https://images.unsplash.com/photo-1586253634026-8cb574908d1e?w=800',
    ];

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        images: newImages,
      },
      select: {
        id: true,
        name: true,
        images: true,
      },
    });

    console.log(`✅ Successfully updated product images!`);
    console.log(`📷 New images:`, updatedProduct.images);
  } catch (error) {
    console.error('❌ Error updating product:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateProductImage();