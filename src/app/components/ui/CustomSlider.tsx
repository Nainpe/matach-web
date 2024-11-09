// src/components/Slider/Slider.tsx
"use client"; // Asegúrate de que sea un componente de cliente

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Definir la interfaz para los ajustes del slider
interface SliderSettings {
  infinite: boolean;
  slidesToShow: number;
  slidesToScroll: number;
  arrows: boolean;
  dots: boolean;
  autoplay: boolean;
  autoplaySpeed: number;
  responsive: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
      infinite?: boolean;
      dots?: boolean;
    };
  }>;
}

const CustomSlider: React.FC = () => {
  const settings: SliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider">
      <Slider {...settings}>
        <div><img src="https://via.placeholder.com/800x150?text=Imagen+1" alt="Imagen 1" /></div>
        <div><img src="https://via.placeholder.com/800x150?text=Imagen+2" alt="Imagen 2" /></div>
        <div><img src="https://via.placeholder.com/800x150?text=Imagen+3" alt="Imagen 3" /></div>
        <div><img src="https://via.placeholder.com/800x150?text=Imagen+4" alt="Imagen 4" /></div>
        <div><img src="https://via.placeholder.com/800x150?text=Imagen+5" alt="Imagen 5" /></div>
      </Slider>
    </div>
  );
};

export default CustomSlider;
