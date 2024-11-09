'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Image from 'next/image'

// Importar estilos de Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// Importar CSS Modules
import styles from './CarouselItem.module.css'

interface Producto {
  id: string
  slug: string
  name: string
  price: string
  images: { url: string }[]
  brandId: string
  categoryId: string
  tags: { tagId: string }[]
}

interface PropiedadesCarruselItem {
  slug: string
}

const CarruselItem: React.FC<PropiedadesCarruselItem> = ({ slug }) => {
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([])
  const [productoActual, setProductoActual] = useState<Producto | null>(null)

  useEffect(() => {
    const obtenerProductosRelacionados = async () => {
      try {
        const respuesta = await fetch(`/api/Products/${slug}`)
        const datos = await respuesta.json()

        if (datos.product && datos.relatedProducts) {
          setProductoActual(datos.product)
          
          // Filtrar productos relacionados por tag, categoría y marca
          const productosFiltrados = datos.relatedProducts.filter((producto: Producto) => 
            producto.brandId === datos.product.brandId &&
            producto.categoryId === datos.product.categoryId &&
            producto.tags.some((tag: { tagId: string }) => 
              datos.product.tags.some((productTag: { tagId: string }) => 
                productTag.tagId === tag.tagId
              )
            )
          )

          setProductosRelacionados(productosFiltrados)
        }
      } catch (error) {
        console.error('Error al obtener productos relacionados:', error)
      }
    }

    obtenerProductosRelacionados()
  }, [slug])

  if (productosRelacionados.length === 0) {
    return null // No mostrar el carrusel si no hay productos relacionados
  }

  return (
    <div className={`${styles.SliderContainer} ${styles.mainContainer}`}>
      <Swiper
        spaceBetween={10}
        
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
        {productosRelacionados.map((producto) => (
          <SwiperSlide key={producto.id}>
            <div className={styles.card}>
              <div className={styles.imageBox} style={{ width: '100%', height: '220px', position: 'relative' }}>
              <Image 
                src={producto.images[0]?.url || "/imagen-por-defecto.webp"}
                alt={producto.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                priority
              />
              </div>
              <div className={styles.description}>
                <h4 className={styles.titleProducto}>
                  <Link href={`/Products/${producto.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {producto.name}
                  </Link>
                </h4>
                <div className={styles.priceProduct} style={{ textAlign: 'center', padding: '0px 10px' }}>
                  <div className={styles.price}>{producto.price}</div>
                  <div className={styles.priceContext} style={{ fontSize: '9px', margin: '2px 0' }}>
                    <p>Precio especial</p>
                  </div>
                </div>
                <div className={styles.priceBottom}>
                  <Link href={`/Products/${producto.slug}`} style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CarruselItem