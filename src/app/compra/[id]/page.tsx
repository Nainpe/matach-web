import { notFound } from 'next/navigation';
import TimeLineOrder from './ui/TimeLineOrder';
import DetailsOrder from './ui/DetailsOrder';
import InfoOrder from './ui/InfoOrder';
import InfoPayment from './ui/InfoPayment';
import UploadImage from './ui/UploadImage';
import prisma from '../../../lib/prisma';
import { getPaymentDetails } from '../../../actions/order/paymentAction';
import { getOrderStatus } from '../../../actions/order/getOrderStatus';
import MobileNavbar from '../../components/ui/MobileNavbar/MobileNavbar';
import { Navbar } from '../../components/ui/Navbar';
import Footer from '../../components/ui/Footer';
import CancelOrderModal from './ui/CancelOrderModal';
import CancelOrderButton from './ui/CancelOrderButton';

type Params = Promise<{ id: string }>;


export default async function CheckoutPage({ params }: { params: Params }) {
  const {  id } = await params;


  // Validación temprana del ID
  if (!id) return notFound();

  // Consulta a la base de datos
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      payment: true,
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: { select: { url: true } },
            },
          },
        },
      },
    },
  });

  if (!order) return notFound();

  // Formatear datos
  const formattedOrder = {
    id: order.id,
    status: order.status,
    shippingAddress: order.shippingAddress,
    isPickup: order.isPickup,
    products: order.products.map((p) => ({
      id: p.product.id,
      name: p.product.name,
      imageUrl: p.product.images[0]?.url || '/default-image.jpg',
      quantity: p.quantity,
      price: p.product.price,
    })),
    address: order.address,
    totalPrice: order.totalPrice,
  };

  // Obtener detalles de pago
  const { paymentType, paymentStatus } = await getPaymentDetails(formattedOrder.id);
  const orderStatus = await getOrderStatus(formattedOrder.id);

  return (
    <div>
      <header className="header">
        <div className="show-on-mobile">
          <MobileNavbar />
        </div>
        <div className="show-on-desktop">
          <Navbar />
        </div>
      </header>

      <main>
        <div className="main-container">
          <div className="order-header">
            <h1>Orden #{formattedOrder.id}</h1>
          </div>

          <CancelOrderModal orderId={formattedOrder.id} />

          <TimeLineOrder orderStatus={orderStatus} />
          
          <div className="compra-container">
            <div className="compra-left">
              <DetailsOrder order={formattedOrder} />
              <UploadImage />
              <CancelOrderButton 
                orderId={formattedOrder.id}
                orderStatus={order.status}
              />
            </div>
            
            <div className="compra-container-payment">
              <InfoOrder 
                address={formattedOrder.address} 
                isPickup={formattedOrder.isPickup} 
              />
              <InfoPayment
                orderId={order.id}
                paymentStatus={paymentStatus}
                totalPrice={formattedOrder.totalPrice}
                paymentType={paymentType}
              />
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}