import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // IDs de los tags
  const memoriaRamTagId = 'cm14qck6d0002ggzl2o3kg4ic';
  const hardwareTagId = 'cm164tzs30000ltwro3nsbr0x';

  // IDs de las marcas
  const intelBrandId = 'cm12v1skz00007fnsaufsm5xr';
  const corsairBrandId = 'cm12v1suc00017fns6yjm3c46';
  const asusBrandId = 'cm12v1suh00027fnsc8o2tg2z';
  const nvidiaBrandId = 'cm12v1suh00037fnsqdejzpxi';
  const amdBrandId = 'cm12v1sv700047fnscvt9q6tb';

  // Category ID (puedes cambiarlo según tus datos)
  const categoryId = 'cm12v1sxz00057fnsr543iua1'; // Asegúrate de tener un ID de categoría válido

  // Crear productos
  const products = [
    { name: 'Producto Intel 1', slug: 'producto-intel-1', price: 100, stock: 10, brandId: intelBrandId, sku: 'SKU_INTEL_001', categoryId },
    { name: 'Producto Intel 2', slug: 'producto-intel-2', price: 120, stock: 15, brandId: intelBrandId, sku: 'SKU_INTEL_002', categoryId },
    { name: 'Producto Corsair 1', slug: 'producto-corsair-1', price: 80, stock: 5, brandId: corsairBrandId, sku: 'SKU_CORSAIR_001', categoryId },
    { name: 'Producto Corsair 2', slug: 'producto-corsair-2', price: 90, stock: 8, brandId: corsairBrandId, sku: 'SKU_CORSAIR_002', categoryId },
    { name: 'Producto ASUS 1', slug: 'producto-asus-1', price: 150, stock: 12, brandId: asusBrandId, sku: 'SKU_ASUS_001', categoryId },
    { name: 'Producto ASUS 2', slug: 'producto-asus-2', price: 170, stock: 20, brandId: asusBrandId, sku: 'SKU_ASUS_002', categoryId },
    { name: 'Producto NVIDIA 1', slug: 'producto-nvidia-1', price: 200, stock: 18, brandId: nvidiaBrandId, sku: 'SKU_NVIDIA_001', categoryId },
    { name: 'Producto NVIDIA 2', slug: 'producto-nvidia-2', price: 220, stock: 22, brandId: nvidiaBrandId, sku: 'SKU_NVIDIA_002', categoryId },
    { name: 'Producto AMD 1', slug: 'producto-amd-1', price: 130, stock: 14, brandId: amdBrandId, sku: 'SKU_AMD_001', categoryId },
    { name: 'Producto AMD 2', slug: 'producto-amd-2', price: 140, stock: 9, brandId: amdBrandId, sku: 'SKU_AMD_002', categoryId }
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        tags: {
          create: [
            { tag: { connect: { id: hardwareTagId } } },
            { tag: { connect: { id: memoriaRamTagId } } }
          ]
        }
      }
    });

    console.log(`Producto creado: ${createdProduct.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
