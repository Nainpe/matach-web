'use server';

import { io } from "socket.io-client";
import { auth } from "../../auth.config";
import prisma from "../../lib/prisma";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
}

interface ShippingData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dni: string;
    address: string;
    province: string;
    city: string;
    postalCode: string;
    additionalInfo: string;
}

interface PickupData {
    pickupName: string;
    pickupDni: string;
}

interface OrderCreateData {
    userId: string;
    totalPrice: number;
    status: "PENDING" | "APPROVED" | "DELIVERED" | "CANCELLED";
    isPickup: boolean;
    paymentType: "CUOTAS" | "TRANSFERENCIA";
    products: { create: { productId: string; quantity: number; price: number }[] };
    shippingAddress: string;
    pickupName?: string;
    pickupDni?: string;
}

const generateRandomOrderId = (): string => {
    const min = 10000;
    const max = 99999;
    return String(Math.floor(Math.random() * (max - min + 1) + min));
};

export const order = async (
    cartItems: CartItem[],
    orderData: ShippingData | PickupData,
    isPickup: boolean,
    paymentMethod: "cuota" | "transferencia",
) => {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return { ok: false, message: "No hay sesión de usuario" };
    }

    if (!cartItems.length) {
        return { ok: false, message: "El carrito está vacío" };
    }

    try {
        const totalPrice = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const newOrder = await prisma.$transaction(async (tx) => {
            for (const item of cartItems) {
                const product = await tx.product.findUnique({
                    where: { id: item.id },
                    select: { stock: true },
                });

                if (!product || product.stock < item.quantity) {
                    throw new Error(
                        `El producto ${item.id} no tiene stock suficiente`
                    );
                }

                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: product.stock - item.quantity },
                });
            }

            let shippingAddress = "";
            const orderCreateData: OrderCreateData = {
                userId,
                totalPrice,
                status: "PENDING",
                isPickup,
                paymentType: paymentMethod === "cuota" ? "CUOTAS" : "TRANSFERENCIA",
                products: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
                shippingAddress: "",
            };

            if (isPickup) {
                const pickupData = orderData as PickupData;
                shippingAddress = "Retiro en tienda";
                orderCreateData.pickupName = pickupData.pickupName;
                orderCreateData.pickupDni = pickupData.pickupDni;
            } else {
                const shippingData = orderData as ShippingData;
                shippingAddress = [
                    shippingData.address,
                    shippingData.city,
                    shippingData.province,
                    shippingData.postalCode,
                    shippingData.additionalInfo,
                ].filter(Boolean).join(", ");
            }

            orderCreateData.shippingAddress = shippingAddress;

            const orderId = generateRandomOrderId();

            const createdOrder = await tx.order.create({
                data: {
                    id: orderId,
                    ...orderCreateData,
                    address: !isPickup ? {
                        create: {
                            street: (orderData as ShippingData).address,
                            locality: (orderData as ShippingData).city,
                            province: (orderData as ShippingData).province,
                            postalCode: (orderData as ShippingData).postalCode,
                        }
                    } : undefined,
                },
                include: { products: true, address: true },
            });

            await tx.notification.create({
                data: {
                    message: `Nueva orden #${createdOrder.id}`,
                    read: false,
                },
            });

            const socket = io('http://localhost:3001');
            socket.emit('nuevaOrden', {
                mensaje: '¡Nueva orden creada!',
                ordenId: createdOrder.id,
            });

            return createdOrder;
        });

        return { ok: true, redirectUrl: `/compra/${newOrder.id}?method=${paymentMethod}` };
    } catch (error: unknown) {
        console.error("Error al procesar la orden:", error);
        return { 
            ok: false, 
            message: error instanceof Error 
                ? error.message 
                : "Error desconocido al procesar la orden"
        };
    }
};