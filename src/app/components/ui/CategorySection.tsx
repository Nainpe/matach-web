"use client"; // Asegúrate de que este componente se renderice en el cliente

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  href: string;
  src: string;
  alt: string;
  label: string;
}

const categories: CategoryItem[] = [
  { href: "#", src: "/images/PC8320.webp", alt: "Auriculares", label: "Auriculares" },
  { href: "#", src: "/images/n82e16814500583.webp", alt: "Placas de video", label: "Placas de video" },
  { href: "#", src: "/images/redragonk512manual.webp", alt: "Teclados", label: "Teclados" },
  { href: "#", src: "/images/h525.webp", alt: "Monitores", label: "Monitores" },
  { href: "#", src: "/images/g502-lightspeed-gallery-1.webp", alt: "Mouses", label: "Mouses" },
  { href: "#", src: "/images/hwccwb11boocaaca_setting_xxx_0_90_end_800.webp", alt: "Gabinetes", label: "Gabinetes" },
];

const CategorySection: React.FC = () => {
  return (
    <div className="category-main main-container">
      <div className="category-items">
        {categories.map((category, index) => (
          <div className="category-box" key={index}>
            <Link href={category.href}>
              {/* No uses <a> dentro de Link, solo el contenido directo */}
              <Image src={category.src} alt={category.alt} width={150} height={200} />
              <span>{category.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
