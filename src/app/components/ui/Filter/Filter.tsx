// src/components/ui/Filter/Filter.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Filter.module.css'; // Asegúrate de tener tu CSS aquí

interface FilterProps {
  brands: { id: string; name: string }[];
  maxPrice: number | null;
  subcategories: { id: string; name: string; slug: string }[]; // Agregar subcategorías aquí
  parentCategories?: { id: string; name: string; slug: string }[]; // Propiedad opcional
  onFilterChange: (filters: { marca?: string[]; precioMin?: number; precioMax?: number; categoria?: string; }) => void;
  searchTerm?: string; // Hacer searchTerm opcional
}

const Filter: React.FC<FilterProps> = ({ brands, maxPrice, subcategories, parentCategories, onFilterChange }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(maxPrice || 10000);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandId)
        ? prevSelected.filter((id) => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value));
  };

  const handleFilterApply = () => {
    onFilterChange({
      marca: selectedBrands,
      precioMax: priceRange,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <h2 className={styles.filterTitle}>Filtros</h2>

      {/* Filtro de categorías padre, solo si parentCategories está presente */}
      {parentCategories && parentCategories.length > 0 && (
        <div className={styles.filterSection}>
          <h3>Categorías</h3>
          <ul className={styles.categoryList}>
            {parentCategories.map((category) => (
              <li key={category.id} className={styles.subcategoryList}>
                <Link href={`/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filtro de subcategorías, si están presentes */}
      {subcategories && subcategories.length > 0 && (
        <div className={styles.filterSection}>
          <h3>Subcategorías</h3>
          <ul className={styles.categoryList}>
            {subcategories.map((subcategory) => (
              <li key={subcategory.id} className={styles.subcategoryList}>
                <Link href={`/${subcategory.slug}`}>{subcategory.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filtro de marcas */}
      <div className={styles.filterSection}>
        <h3>Marcas</h3>
        <div className={styles.brandFilter}>
          {brands.map((brand) => (
            <label key={brand.id}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                onChange={() => handleBrandChange(brand.id)}
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      {/* Filtro de precio con slider */}
      <div className={styles.filterSection}>
        <h3>Rango de Precio</h3>
        <div className={styles.priceFilter}>
          <input
            type="range"
            min="0"
            max={maxPrice || 10000}
            value={priceRange}
            onChange={handlePriceChange}
            className={styles.priceSlider}
          />
          <span>{priceRange} ARS</span>
        </div>
      </div>

      <button className={styles.applyButton} onClick={handleFilterApply}>Aplicar Filtros</button>
    </div>
  );
};

export default Filter;
