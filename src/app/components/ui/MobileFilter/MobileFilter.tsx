// src/components/ui/MobileFilter/MobileFilter.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './MobileFilter.module.css';

interface MobileFilterProps {
  brands: { id: string; name: string }[];
  maxPrice: number | null;
  subcategories?: { id: string; name: string; slug: string; categoryId: string }[]; // subcategories opcional
  onFilterChange: (filters: { marca?: string[]; precioMin?: number; precioMax?: number; categoria?: string; searchTerm?: string }) => void;
  searchTerm?: string; // Hacer searchTerm opcional
}

const MobileFilter: React.FC<MobileFilterProps> = ({ brands, maxPrice, subcategories, onFilterChange, searchTerm }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(maxPrice || 10000); // Valor inicial para el rango de precios

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter(id => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      marca: selectedBrands.length > 0 ? selectedBrands : undefined, // No filtra marcas si está vacío
      precioMin: 0,
      precioMax: priceRange, // Usar el valor del rango de precios
      categoria: selectedCategory || undefined,
      searchTerm: searchTerm || undefined, // Asegúrate de que searchTerm sea opcional
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value)); // Actualizar el estado del rango de precios
  };

  return (
    <>
      <div className={styles.filterContainer}>
        <h2 className={styles.filterTitle}>Filtros</h2>

        {/* Filtro de categorías, solo si subcategories está presente */}
        {subcategories && (
          <div className={styles.filterSection}>
            <h3>Categorías</h3>
            <ul className={styles.categoryList}>
              {subcategories.map((subcategory) => (
                <li key={subcategory.id} className={styles.subcategoryList}>
                  <Link href={`/categoria/${subcategory.slug}`} onClick={() => setSelectedCategory(subcategory.id)}>
                    {subcategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Filtro de marcas */}
        <div className={styles.filterSection}>
          <h3>Marcas</h3>
          {brands.map((brand) => (
            <label key={brand.id} className={styles.brandItem}>
              <input type="checkbox" checked={selectedBrands.includes(brand.id)} onChange={() => handleBrandChange(brand.id)} />
              {brand.name}
            </label>
          ))}
        </div>

        {/* Filtro de Rango de Precios */}
        <div className={styles.filterSection}>
          <h3>Rango de Precios</h3>
          <input
            type="range"
            min={0}
            max={maxPrice || 10000}
            value={priceRange} // Valor actual del rango
            onChange={handlePriceChange} // Cambia el estado al mover el slider
            className={styles.priceSlider}
          />
          <p>Precio máximo: ${priceRange}</p> {/* Mostrar el precio actual */}
        </div>

        <button className={styles.applyButton} onClick={handleApplyFilters}>
          Aplicar Filtros
        </button>
      </div>
    </>
  );
};

export default MobileFilter;
