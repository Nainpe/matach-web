"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import styles from './ProductGalleryMobile.module.css';

// Import styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/autoplay';
import { Product, ProductImage } from '@/types';

interface ProductGalleryMobileProps {
  product: Product;
}

const ProductGalleryMobile: React.FC<ProductGalleryMobileProps> = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className={styles.productPhoto}>
      {product.images && product.images.length > 0 && (
        <>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={false}
            pagination={{ clickable: true }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Pagination, Thumbs, Autoplay]}
            className={styles.productGallery}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {product.images.map((image: ProductImage) => (
              <SwiperSlide key={image.id}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.imagePhoto}
                    src={image.url}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    alt={product.name}
                    loading="eager"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs]}
            className={styles.productThumbs}
          >
            {product.images.map((image: ProductImage) => (
              <SwiperSlide key={image.id}>
                <div className={styles.thumbWrapper}>
                  <Image
                    className={styles.imageThumbs}
                    src={image.url}
                    fill
                    sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw"
                    style={{ objectFit: 'cover' }}
                    alt={product.name}
                    loading="eager"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default ProductGalleryMobile;

