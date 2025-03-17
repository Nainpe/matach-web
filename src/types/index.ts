import type { Swiper as SwiperType } from 'swiper';

export interface ProductImage {
  url: string;
  id?: string; // Adding an optional id for better identification if needed
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string | null;
  images: ProductImage[];
  brandId: string;
  categoryId: string;
  tags: { tagId: string }[];
  stock: number; // Added stock as it's used in CartProduct
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string; // Changed from categoryId to parentCategoryId for clarity
  products: Product[];
}

export interface Brand {
  id: string;
  name: string;
  slug?: string; // Added optional slug for consistency with other entities
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId: string; // Changed from categoryId to parentCategoryId for clarity
}

export interface Filter {
  marca?: string[];
  precioMin?: number;
  precioMax?: number;
  categoria?: string;
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  pong: () => void;
  adminNotification: (notification: { type: string; message: string; data: unknown }) => void; // Cambiado `any` por `unknown`
  newOrder: (orderData: { orderId: string; totalPrice: number; status: string }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  ping: () => void;
  newOrder: (orderData: { orderId: string; totalPrice: number; status: string }) => void;
}

// Añadir este tipo si no lo has definido previamente
export interface Notification {
  type: string;
  message: string;
  data?: unknown;  // Cambiado `any` por `unknown`
}

export type SwiperInstance = SwiperType | null;

export type ErrorType = 'CredentialsSignin' | 'UnknownError' | 'EmailNotVerified';