"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'; 
import Image from 'next/image';

// Importar los estilos de Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductGallery = ({ product }: { product: any }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className='product-photo'>
      {product.images && product.images.length > 0 && (
        <>
          <Swiper
            loop={true}
            spaceBetween={20}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
            className="product-gallery"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {product.images.map((image: any) => (
              <SwiperSlide key={image.id}>
                <Image
                  className='image-photo'
                  src={image.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Añadido sizes para optimización
                  style={{ objectFit: 'contain' }}
                  loading="eager"
                  priority 
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={20}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="product-thumbs"
          >
            {product.images.map((image: any) => (
              <SwiperSlide key={image.id}>
                <Image
                  className='image-thumbs'
                  src={image.url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw" // Añadido sizes para optimización de las miniaturas
                  style={{ objectFit: 'contain' }}
                  loading="eager"
                  priority 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default ProductGallery;
