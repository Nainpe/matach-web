import { notFound } from "next/navigation";
import { getOrderStatus } from "../../../../../../actions/order/getOrderStatus";
import { getPaymentDetails } from "../../../../../../actions/order/paymentAction";
import prisma from "../../../../../../lib/prisma";
import DetailsOrder from "../../../../../compra/[id]/ui/DetailsOrder";
import InfoOrder from "../../../../../compra/[id]/ui/InfoOrder";
import InfoPayment from "../../../../../compra/[id]/ui/InfoPayment";
import TimeLineOrder from "../../../../../compra/[id]/ui/TimeLineOrder";
import UploadImage from "../../../../../compra/[id]/ui/UploadImage";

type Params = Promise<{ id: string }>;


export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  // Validar el ID de la orden
  if (!id) return notFound();

  // Obtener la orden de la base de datos
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

  // Si la orden no existe, mostrar 404
  if (!order) return notFound();

  // Formatear la orden para la UI
  const formattedOrder = {
    id: order.id,
    status: order.status,
    shippingAddress: order.shippingAddress,
    isPickup: order.isPickup,
    products: order.products.map((p) => ({
      id: p.product.id,
      name: p.product.name,
      imageUrl: p.product.images[0]?.url || "/default-image.jpg",
      quantity: p.quantity,
      price: p.product.price,
    })),
    address: order.address,
    totalPrice: order.totalPrice, // Asegurar que esta propiedad existe
  };

  // Obtener detalles del pago
  const { paymentType, paymentStatus } = await getPaymentDetails(formattedOrder.id);

  // Obtener el estado de la orden
  const orderStatus = await getOrderStatus(formattedOrder.id);

  return (
    <div>
      <div className="main-container">
        <h1>Orden #{formattedOrder.id}</h1>
        <TimeLineOrder orderStatus={orderStatus} />
        <div className="compra-container">
          <div className="compra-left">
            <DetailsOrder order={formattedOrder} />
            <UploadImage />
          </div>
          <div className="compra-container-payment">
            <InfoOrder
              address={formattedOrder.address}
              isPickup={formattedOrder.isPickup}
            />
            <InfoPayment
              orderId={order.id}
              paymentStatus={paymentStatus}
              totalPrice={order.totalPrice}
              paymentType={paymentType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}