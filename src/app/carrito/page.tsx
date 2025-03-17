import { cookies } from 'next/headers';
import CartSummary from '../components/ui/CartSummary/CartSummary';
import { Navbar } from '../components/ui/Navbar';
import MobileNavbar from '../components/ui/MobileNavbar/MobileNavbar';
import Footer from '../components/ui/Footer';
import MobileCartSummary from '../components/ui/MobileCartSummary/MobileCartSummary';
import { CartProduct } from '../../types';
import prisma from '../../lib/prisma';

const Carrito = async () => {
  const cartCookie = (await cookies()).get('cart');
  const cartItems: CartProduct[] = [];
  let discount = 0;

  if (cartCookie) {
    // Obtén los IDs de los productos en el carrito desde las cookies
    const cartData = JSON.parse(cartCookie.value);
    const productIds = cartData.map((item: { id: string }) => item.id).filter(Boolean);

    // Consulta a Prisma para obtener los productos por sus IDs, incluyendo el stock
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true, // Asegúrate de incluir el stock aquí
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    // Agrega cada producto al carrito con la cantidad obtenida desde las cookies
    products.forEach((product) => {
      const cartItem = cartData.find((item: { id: string }) => item.id === product.id);
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0]?.url || '/path/to/default-image.jpg',
        quantity: cartItem?.quantity || 1, // Asumimos 1 si no hay cantidad especificada
        stock: product.stock, // Esto debe ser correcto
      });
    });

    // Validación del cupón
    const couponCode = cartData.couponCode; // Suponiendo que el código de cupón esté en las cookies o se pase de alguna forma
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && new Date() <= new Date(coupon.expiresAt)) {
        discount = coupon.discountValue;
      }
    }
  }



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
      <main className='page-carrito-main'>
    
        <div className='main-container'>
    

        <div className='show-on-mobile'>
           <MobileCartSummary />
        </div>

        <div className='show-on-desktop'>
        <CartSummary cartItems={cartItems} discount={discount} />
        </div> 

      

        </div>
      </main>
      
      <Footer/>
    </div>
  );
};

export default Carrito;
