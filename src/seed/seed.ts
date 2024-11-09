import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createBrands() {
  const brands = [
    { name: 'AMD' },
    { name: 'Intel' },
    { name: 'NVIDIA' },
    { name: 'ASUS' },
    { name: 'Corsair' }
  ];

  const createdBrands = await Promise.all(
    brands.map(brand => prisma.brand.create({ data: brand }))
  );

  console.log('Brands created:', createdBrands);
  return createdBrands;
}

async function createCategories() {
  const categories = [
    { name: 'Processors', description: 'CPU components' },
    { name: 'Graphics Cards', description: 'GPU components' },
    { name: 'Motherboards', description: 'Main circuit boards' },
    { name: 'RAM', description: 'Random Access Memory modules' }
  ];
  const createdCategories = await Promise.all(
    categories.map(category => prisma.category.create({ 
      data: { 
        name: category.name, 
        description: category.description, 
        slug: category.name.toLowerCase().replace(/ /g, '-') 
      } 
    }))
  );

  console.log('Categories created:', createdCategories);
  return createdCategories;
}

async function createProducts(brands: any[], categories: any[]) {
  const products = [
    {
      name: 'AMD Ryzen 5 5600X',
      slug: 'amd-ryzen-5-5600x',
      description: 'High-performance 6-core processor',
      sku: 'AMD5600X',
      price: 299.99,
      stock: 100,
      brandId: brands.find(b => b.name === 'AMD').id,
      categoryId: categories.find(c => c.name === 'Processors').id,
      specifications: {
        create: [
          { key: 'Cores', value: '6' },
          { key: 'Threads', value: '12' },
          { key: 'Base Clock', value: '3.7 GHz' },
          { key: 'Boost Clock', value: '4.6 GHz' }
        ]
      }
    },
    {
      name: 'Intel Core i7-11700K',
      slug: 'intel-core-i7-11700k',
      description: 'Powerful 8-core processor for gaming and productivity',
      sku: 'INTELI711700K',
      price: 399.99,
      stock: 75,
      brandId: brands.find(b => b.name === 'Intel').id,
      categoryId: categories.find(c => c.name === 'Processors').id,
      specifications: {
        create: [
          { key: 'Cores', value: '8' },
          { key: 'Threads', value: '16' },
          { key: 'Base Clock', value: '3.6 GHz' },
          { key: 'Boost Clock', value: '5.0 GHz' }
        ]
      }
    },
    {
      name: 'NVIDIA GeForce RTX 3080',
      slug: 'nvidia-geforce-rtx-3080',
      description: 'High-end graphics card for 4K gaming',
      sku: 'NVRTX3080',
      price: 699.99,
      stock: 50,
      brandId: brands.find(b => b.name === 'NVIDIA').id,
      categoryId: categories.find(c => c.name === 'Graphics Cards').id,
      specifications: {
        create: [
          { key: 'CUDA Cores', value: '8704' },
          { key: 'Memory', value: '10GB GDDR6X' },
          { key: 'Boost Clock', value: '1.71 GHz' }
        ]
      }
    },
    {
      name: 'ASUS ROG Strix B550-F Gaming',
      slug: 'asus-rog-strix-b550-f-gaming',
      description: 'Feature-rich ATX motherboard for AMD Ryzen processors',
      sku: 'ASUSB550F',
      price: 189.99,
      stock: 60,
      brandId: brands.find(b => b.name === 'ASUS').id,
      categoryId: categories.find(c => c.name === 'Motherboards').id,
      specifications: {
        create: [
          { key: 'Socket', value: 'AM4' },
          { key: 'Form Factor', value: 'ATX' },
          { key: 'Memory Support', value: 'DDR4 4400MHz' }
        ]
      }
    },
    {
      name: 'Corsair Vengeance LPX 16GB',
      slug: 'corsair-vengeance-lpx-16gb',
      description: 'High-performance DDR4 memory kit',
      sku: 'CORSVEN16GB',
      price: 89.99,
      stock: 120,
      brandId: brands.find(b => b.name === 'Corsair').id,
      categoryId: categories.find(c => c.name === 'RAM').id,
      specifications: {
        create: [
          { key: 'Capacity', value: '16GB (2x8GB)' },
          { key: 'Speed', value: '3200MHz' },
          { key: 'Latency', value: 'CL16' }
        ]
      }
    },
    {
      name: 'AMD Radeon RX 6700 XT',
      slug: 'amd-radeon-rx-6700-xt',
      description: 'High-performance graphics card for 1440p gaming',
      sku: 'AMDRX6700XT',
      price: 479.99,
      stock: 40,
      brandId: brands.find(b => b.name === 'AMD').id,
      categoryId: categories.find(c => c.name === 'Graphics Cards').id,
      specifications: {
        create: [
          { key: 'Stream Processors', value: '2560' },
          { key: 'Memory', value: '12GB GDDR6' },
          { key: 'Game Clock', value: '2424 MHz' }
        ]
      }
    },
    {
      name: 'Intel Core i5-11600K',
      slug: 'intel-core-i5-11600k',
      description: 'Mid-range 6-core processor for gaming',
      sku: 'INTELI511600K',
      price: 269.99,
      stock: 90,
      brandId: brands.find(b => b.name === 'Intel').id,
      categoryId: categories.find(c => c.name === 'Processors').id,
      specifications: {
        create: [
          { key: 'Cores', value: '6' },
          { key: 'Threads', value: '12' },
          { key: 'Base Clock', value: '3.9 GHz' },
          { key: 'Boost Clock', value: '4.9 GHz' }
        ]
      }
    },
    {
      name: 'ASUS TUF Gaming X570-Plus',
      slug: 'asus-tuf-gaming-x570-plus',
      description: 'Durable ATX motherboard for AMD Ryzen processors',
      sku: 'ASUSX570PLUS',
      price: 189.99,
      stock: 55,
      brandId: brands.find(b => b.name === 'ASUS').id,
      categoryId: categories.find(c => c.name === 'Motherboards').id,
      specifications: {
        create: [
          { key: 'Socket', value: 'AM4' },
          { key: 'Form Factor', value: 'ATX' },
          { key: 'Memory Support', value: 'DDR4 4400MHz (O.C)' }
        ]
      }
    },
    {
      name: 'Corsair Dominator Platinum RGB 32GB',
      slug: 'corsair-dominator-platinum-rgb-32gb',
      description: 'High-end RGB DDR4 memory kit',
      sku: 'CORSDOM32GB',
      price: 199.99,
      stock: 70,
      brandId: brands.find(b => b.name === 'Corsair').id,
      categoryId: categories.find(c => c.name === 'RAM').id,
      specifications: {
        create: [
          { key: 'Capacity', value: '32GB (2x16GB)' },
          { key: 'Speed', value: '3600MHz' },
          { key: 'Latency', value: 'CL18' }
        ]
      }
    },
    {
      name: 'NVIDIA GeForce RTX 3070',
      slug: 'nvidia-geforce-rtx-3070',
      description: 'High-performance graphics card for 1440p and 4K gaming',
      sku: 'NVRTX3070',
      price: 499.99,
      stock: 60,
      brandId: brands.find(b => b.name === 'NVIDIA').id,
      categoryId: categories.find(c => c.name === 'Graphics Cards').id,
      specifications: {
        create: [
          { key: 'CUDA Cores', value: '5888' },
          { key: 'Memory', value: '8GB GDDR6' },
          { key: 'Boost Clock', value: '1.73 GHz' }
        ]
      }
    }
  ];

  const createdProducts = await Promise.all(
    products.map(product => prisma.product.create({ data: product }))
  );

  console.log('Products created:', createdProducts);
}

async function main() {
  const brands = await createBrands();
  const categories = await createCategories();
  await createProducts(brands, categories);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });