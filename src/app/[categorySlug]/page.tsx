// app/[categorySlug]/page.tsx
import prisma from '@/lib/prisma';
import CategoryPageClient from './CategoryPageClient'; // Importa el componente de cliente
import { Navbar } from '../components/ui/Navbar';
import Footer from '../components/ui/Footer'; // Cambiado a importación por defecto
import Breadcrumbs from '../components/ui/breadcrumbs/Breadcrumbs';
import MobileNavbar from '../components/ui/MobileNavbar/MobileNavbar';

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  // Encuentra la categoría con sus subcategorías
  const category = await prisma.category.findUnique({
    where: { slug: params.categorySlug },
    include: {
      products: {
        include: {
          images: true,
          tags: true,
          brand: true, // Incluye la marca asociada a cada producto
        },
      },
      subcategories: {
        include: {
          products: {
            include: {
              images: true,
              tags: true,
              brand: true, // Incluye la marca asociada a cada producto de subcategorías
            },
          },
        },
      },
    },
  });

  if (!category) {
    return <div>Categoria no encontrada.</div>; // Maneja el caso donde no se encuentra la categoría
  }

  // Combina los productos de la categoría con los productos de las subcategorías
  const allProducts = [
    ...category.products,
    ...(category.subcategories?.flatMap(sub => sub.products) || []),
  ];

  // Encuentra las marcas únicas que están asociadas con los productos de la categoría y subcategorías
  const uniqueBrands = Array.from(new Set(allProducts.map(product => product.brand?.id)))
    .map((brandId) => {
      // Retorna solo las marcas que están asociadas con al menos un producto
      return allProducts.find(product => product.brand?.id === brandId)?.brand;
    })
    .filter((brand): brand is NonNullable<typeof brand> => brand !== undefined); // Asegura que no haya undefined

  // Encuentra el precio máximo en esta categoría o sus subcategorías
  const maxPrice = await prisma.product.aggregate({
    where: {
      OR: [
        { categoryId: category.id },
        { categoryId: { in: category.subcategories.map(sub => sub.id) } },
      ],
    },
    _max: {
      price: true,
    },
  });

  return (
    <>     
    <header className='header'>
    <div className='show-on-mobile'>
          <MobileNavbar />
        </div>
        
        <div className='show-on-desktopw'>
          <Navbar/>
        </div>
            </header>
      <div className='main-container'>
        <CategoryPageClient 
        category={{ ...category, products: allProducts, categoryId: category.id }}
        subcategories={category.subcategories.map(sub => ({ ...sub, categoryId: sub.id }))} // Asegura que las subcategorías incluyan categoryId
        brands={uniqueBrands} // Solo marcas únicas y no undefined
        maxPrice={maxPrice._max.price || 0}
      />
      </div>
      <Footer/>
    </>
  );
}
