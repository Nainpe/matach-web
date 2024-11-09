"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import styles from './ProductCarousel.module.css';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface Product {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    brand: string;
    tags: string[];
}

interface ProductCarouselProps {
    currentProduct: Product;
    relatedProducts: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ currentProduct, relatedProducts }) => {
    return (
        <div className={styles.sliderContainer}>
            <Swiper
                spaceBetween={10}
                loop={true}
                navigation
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Navigation, Pagination]}
                breakpoints={{
                    1024: { slidesPerView: 5 },
                    768: { slidesPerView: 3 },
                    576: { slidesPerView: 2 },
                    0: { slidesPerView: 2 },
                }}
                className={styles.mySwiper}
            >
                {relatedProducts.map((product, index) => (
                    <SwiperSlide key={product.id}>
                        <div className={styles.card}>
                            <div className={styles.imageBox}>
                                <Image 
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.description}>
                                <h4 className={styles.titleProducto}>
                                    <Link href={`/producto/${product.id}`}>
                                        {product.name}
                                    </Link>
                                </h4>
                                <div className={styles.priceProduct}>
                                    <div className={styles.price}>${product.price.toLocaleString()}</div>
                                    <div className={styles.priceContext}>
                                        <p>Precio especial</p>
                                    </div>
                                </div>
                                <div className={styles.priceBottom}>
                                    <Link href={`/producto/${product.id}`} className={styles.verMasButton}>
                                        Ver más
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductCarousel;