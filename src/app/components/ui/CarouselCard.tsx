"use client";
import Link from 'next/link';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const CarouselCard: React.FC = () => {
    return (
                <div className='Slider-container main-container'>
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
                // Ajustes para pantallas grandes
                1024: {
                slidesPerView: 5,
                },
                // Ajustes para pantallas medianas
                768: {
                slidesPerView: 3,
                },
                // Ajustes para pantallas pequeñas (por debajo de 768px)
                576: {
                slidesPerView: 2,
                },
                // Ajustes para pantallas muy pequeñas (por debajo de 576px)
                0: {
                slidesPerView: 2 ,
                },
            }}
            className="mySwiper"
            >
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='card'>
                        <div className='image-box' style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <Image 
                                src="/images/PC8320.webp"
                                alt="Producto 1"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className='description'>
                            <h4 className='title-producto'>
                                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Procesador Intel® Core™ i3-10100F 4,30 GHz
                                </Link>
                            </h4>
                            <div style={{ marginTop: '5em' }}></div>
                            <div className='price-product' style={{ textAlign: 'center', padding: '0px 10px' }}>
                                <div className='price'>$29.000</div>
                                <div className='price-context' style={{ fontSize: '9px', margin: '2px 0' }}>
                                    <p>Precio especial</p>
                                </div>
                            </div>
                            <div className='price-bottom'>
                                <Link href="#" style={{ textDecoration: 'none', width: '88%', display: 'block', textAlign: 'center', padding: '3px 0px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#25D366', color: 'black', margin: '5px auto auto' }}>
                                    Ver más
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default CarouselCard;
