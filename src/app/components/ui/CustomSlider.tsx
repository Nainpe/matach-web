// src/components/Slider/Slider.tsx
"use client";

import React from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomSlider: React.FC = () => {
  const settings: Settings = {
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
    <div className="slider-container">
      <Slider {...settings}>
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num}>
            <img 
              src={`https://via.placeholder.com/800x150?text=Imagen+${num}`} 
              alt={`Slide ${num}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CustomSlider;