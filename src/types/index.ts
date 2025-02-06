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

export type SwiperInstance = SwiperType | null;

export type ErrorType = 'CredentialsSignin' | 'UnknownError' | 'EmailNotVerified';