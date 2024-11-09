'use client';

import { useEffect, useState } from 'react';
import styles from './ProductDetails.module.css';

interface Product {
  id: string;
  description?: string;
}

interface ProductDetailsProps {
  slug: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ slug }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/Products/${slug}`, { next: { revalidate: 3600 } });
        if (!response.ok) {
          throw new Error(`Error al obtener el producto: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Datos del producto:", data); // <---- Log para verificar la respuesta
        setProduct(data.product); // Asegúrate de acceder correctamente al producto
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError(err instanceof Error ? err.message : 'Se produjo un error desconocido');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [slug]);
  

  if (loading) return <p className={styles.loadingText}>Cargando...</p>;
  if (error) return <p className={styles.errorText}>Error: {error}</p>;
  if (!product) return <p className={styles.notFoundText}>Producto no encontrado</p>;

  return (
    <div className={`${styles.productDetailsContainer} main-container`}>
      <h1>Detalles del producto</h1>
      <div className={styles.productDetailsContent}>
        <p>{product.description || 'No hay descripción disponible.'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
