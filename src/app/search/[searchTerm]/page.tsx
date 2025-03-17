
import prisma from '../../../lib/prisma';
import Footer from '../../components/ui/Footer';
import MobileNavbar from '../../components/ui/MobileNavbar/MobileNavbar';
import { Navbar } from '../../components/ui/Navbar';
import SearchPageClient from './SearchPageClient';

type Params = Promise<{ searchTerm: string }>;


export default async function SearchPage({ params }: { params: Params }) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: (await params).searchTerm, mode: 'insensitive' } },
        { description: { contains: (await params).searchTerm, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: (await params).searchTerm, mode: 'insensitive' } } } } },
      ],
    },
    include: {
      images: true,
      tags: true,
      brand: true,
    },
  });

  const uniqueBrands = Array.from(new Set(products.map(product => product.brand?.id)))
    .map((brandId) => {
      return products.find(product => product.brand?.id === brandId)?.brand;
    })
    .filter((brand): brand is NonNullable<typeof brand> => brand !== undefined);

  const maxPrice = await prisma.product.aggregate({
    where: {
      OR: [
        { name: { contains: (await params).searchTerm, mode: 'insensitive' } },
        { description: { contains: (await params).searchTerm, mode: 'insensitive' } },
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
