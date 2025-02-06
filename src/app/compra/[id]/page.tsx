import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import MobileNavbar from '@/app/components/ui/MobileNavbar/MobileNavbar';
import { Navbar } from '@/app/components/ui/Navbar';
import TimeLineOrder from './ui/TimeLineOrder';
import DetailsOrder from './ui/DetailsOrder';
import InfoOrder from './ui/InfoOrder';
import Footer from '@/app/components/ui/Footer';
import InfoPayment from './ui/InfoPayment';
import { getPaymentDetails } from '@/actions/order/paymentAction';
import UploadImage from './ui/UploadImage';
import { getOrderStatus } from '@/actions/order/getOrderStatus';

interface CheckoutPageProps {
  params: { id: string };
  searchParams: { method?: string };
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { id }  = await params;
  const { method } = await searchParams;

  if (!id) {
    return notFound();
  }

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
  };

  // Obtener detalles del pago
  const { paymentType, paymentStatus } = await getPaymentDetails(formattedOrder.id);

  // Obtener el estado de la orden directamente en el servidor
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
          <h1>Orden #{formattedOrder.id}</h1>
          <TimeLineOrder orderStatus={orderStatus} />
          <div className="compra-container">
            <div className="compra-left">
              <DetailsOrder order={formattedOrder} />
              <UploadImage />
            </div>
            <div className="compra-container-payment">
              <InfoOrder address={formattedOrder.address} isPickup={formattedOrder.isPickup} />
              <InfoPayment
                orderId={order.id}
                paymentStatus={paymentStatus}
                totalPrice={order.totalPrice}
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
