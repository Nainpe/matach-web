export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string | null;
  images: { url: string }[];
  brandId: string;
  categoryId: string; // Este es el ID de la categoría a la que pertenece el producto
  tags: { tagId: string }[];

}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string; // O string | undefined, asegúrate de que sea consistente
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  categoryId: string; // Este es el ID de la categoría padre si existe
  products: Product[];
}

export interface Brand {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string; // Este es el ID de la categoría padre
}

export interface Filter {
  marca?: string[];
  precioMin?: number;
  precioMax?: number;
  categoria?: string; // Añadir aquí la propiedad categoria
}
