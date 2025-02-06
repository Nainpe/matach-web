import { PrismaClient } from '@prisma/client';
import ProductGallery from '@/app/components/ui/ProductGallery';
import { Navbar } from '@/app/components/ui/Navbar';
import Breadcrumbs from '@/app/components/ui/breadcrumbs/Breadcrumbs';
import Footer from '@/app/components/ui/Footer';
import AddToCartSection from '@/app/components/ui/AddToCarSection/AddToCarSection';
import ProductDetails from '@/app/components/ui/ProductDetails/ProductDetails';
import CardPayment from '@/app/components/ui/card-payment/page';
import CarruselItem from '@/app/components/ui/CarouselItem/CarouselItem';
import ProductGalleryMobile from '@/app/components/ui/product-gallery/ProductGalleryMobile';
import MobileNavbar from '@/app/components/ui/MobileNavbar/MobileNavbar';
import { TbTruckDelivery } from "react-icons/tb";


const prisma = new PrismaClient();

async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: true,
      tags: {
        include: { tag: true },
      },
    },
  });
  return product;
}

// Función para formatear el precio con separadores de miles
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const getStockMessage = () => {
    if (product.stock <= 1) {
      return <span className="low-stock">STOCK BAJO</span>;
    } else if (product.stock > 5) {
      return <span className="high-stock">DISPONIBLE</span>;
    } else {
      return <span className="medium-stock">Stock medio</span>;
    }
  };

  return (
    <div>
      <header className='header'>
      <div className='show-on-mobile'>
          <MobileNavbar />
        </div>
         
         <div className='show-on-desktop'>
          <Navbar/>
        </div> 
        
      </header>
      <main>
      <Breadcrumbs product={product} />
      <div className='screen-product main-container'>
       
        <div className="show-on-desktop">
          <ProductGallery product={product} />
        </div>

        <div className="show-on-mobile">
          <ProductGalleryMobile product={product} />
        </div>

        <div className='information-product'>
          <h1 className='product-name'>{product.name}</h1>
          <div className='infoContainer'>
            <ul className='infoContainer'>
              <li className='infoItem'>
                <h3>ID</h3>
                <p className='text-info text-id'>#{product.id}</p>
              </li>
              <li className='infoItem'>
                <h3>Marca</h3>
                <p className='brand-info'>{product.brand?.name}</p>
              </li>
              <li className='infoItem'>
                <h3>Stock</h3>
                <p className='text-info'>{getStockMessage()}</p>
              </li>
            </ul>
          </div>

          <div className='product-tag'>
            {product.tags.map((productTag) => (
              <li className='tag-container' key={productTag.tag.id}>
                {productTag.tag.name}
              </li>
            ))}
          </div>

          <hr className="divider" />
          
          {/* Formateo del precio */}
          <div className='product-price-container'>
            <span className='product-price'>{formatPrice(product.price)}</span>
          </div>

          <hr className="divider" />
          
          <CardPayment />
          <div className='product-container-buy'>
            <div className='delivery-info'>

            <TbTruckDelivery  className='delivery-icon'/>

              <div className="shipping-methods">
                <h2 className="shipping-title">Métodos de envío y tarifas</h2>
                <p className="shipping-description">Tarifas de envíos y métodos de envíos</p>
              </div>
            </div>
          </div>
          <hr className="divider" />
          <AddToCartSection productId={product.id} stock={product.stock} slug={product.slug} />
          <button className='whatsapp-btn'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="whatsapp-icon">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Enviar mensaje
          </button>
        </div>
      </div>
      <ProductDetails slug={slug} />
      <div className='card-container main-container'>
        <div className='productos-relacionados-container'>
          <h2>Productos relacionados</h2>
        </div>
        <CarruselItem slug={slug} />
      </div>
      <Footer />
      </main>
    </div>
  );
};

export default ProductPage;
