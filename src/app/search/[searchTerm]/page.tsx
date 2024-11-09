import prisma from '@/lib/prisma';
import Footer from '@/app/components/ui/Footer';
import { Navbar } from '@/app/components/ui/Navbar';
import SearchPageClient from './SearchPageClient';
import MobileNavbar from '@/app/components/ui/MobileNavbar/MobileNavbar';

export default async function SearchPage({ params }: { params: { searchTerm: string } }) {
  // Busca productos que coincidan con el término de búsqueda
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: params.searchTerm, mode: 'insensitive' } },
        { description: { contains: params.searchTerm, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: params.searchTerm, mode: 'insensitive' } } } } },
      ],
    },
    include: {
      images: true,
      tags: true,
      brand: true,
    },
  });

  // Encuentra las marcas únicas que están asociadas con los productos
  const uniqueBrands = Array.from(new Set(products.map(product => product.brand?.id)))
    .map((brandId) => {
      return products.find(product => product.brand?.id === brandId)?.brand;
    })
    .filter((brand): brand is NonNullable<typeof brand> => brand !== undefined);

  // Encuentra el precio máximo entre los productos buscados
  const maxPrice = await prisma.product.aggregate({
    where: {
      OR: [
        { name: { contains: params.searchTerm, mode: 'insensitive' } },
        { description: { contains: params.searchTerm, mode: 'insensitive' } },
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
        
        <div className='show-on-desktop'>
          <Navbar/>
        </div>
        
      </header>
      <div className='main-container'>
        <SearchPageClient 
          products={products}
          brands={uniqueBrands}
          maxPrice={maxPrice._max.price || 0} 
          subcategories={[]}       
           />
      </div>
      <Footer />
    </>
  );
}
