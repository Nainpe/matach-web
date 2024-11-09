'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Cardlistview.module.css';

interface Image {
  url: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: Image[];
  price: number;
  stock?: number;
}

interface CardlistviewProps {
  products: Product[];
}

const Cardlistview: React.FC<CardlistviewProps> = ({ products }) => {
  return (
    <div className={styles.productview}>
      {products.map((product) => (
        <Link href={`/Products/${product.slug}`} key={product.id} className={styles.productCard}>
          {product.images.length > 0 && (
            <div className={styles.imageContainer}>
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                style={{ objectFit: 'contain' }} 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Ajusta los tamaños según tus necesidades
              />
            </div>
          )}
          <div className={styles.productInfo}>
            <h3 className={styles.productTitle}>{product.name}</h3>
            <p className={styles.stockStatus}>
              {product.stock && product.stock > 0 ? 'DISPONIBLE' : 'STOCK BAJO'}
            </p>
            <p className={styles.productPrice}>${product.price.toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cardlistview;
