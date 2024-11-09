// src/app/[categorySlug]/CategoryPageClient.tsx
'use client';

import { useState } from 'react';
import Cardlistview from '../components/ui/Cardlistview/Cardlistview';
import Filter from '../components/ui/Filter/Filter';
import { Category, Brand, Subcategory } from '../../types/index';
import styles from './CategoryPageClient.module.css'; // Importa el CSS del módulo
import MobileFilter from '../components/ui/MobileFilter/MobileFilter';
import Breadcrumbs from '../components/ui/breadcrumbs/Breadcrumbs';
import ResultCount from '../components/ui/ResultCount/ResultCount';

interface CategoryPageClientProps {
  category: Category;
  subcategories: Subcategory[];
  brands: Brand[];
  maxPrice: number | null;
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ category, subcategories, brands, maxPrice }) => {
  const [filteredProducts, setFilteredProducts] = useState(category.products);

  const handleFilterChange = async (filters: { marca?: string[]; precioMin?: number; precioMax?: number; categoria?: string }) => {
    const query = new URLSearchParams();
    
    // Verificamos si hay marcas seleccionadas
    if (filters.marca && filters.marca.length > 0) {
      query.append('marca', filters.marca.join(','));
    }
    
    // Filtros de precios
    if (filters.precioMin) query.append('precioMin', String(filters.precioMin));
    if (filters.precioMax) query.append('precioMax', String(filters.precioMax));
    
    // Filtro de categoría
    if (filters.categoria) query.append('categoria', filters.categoria);
    
    query.append('categorySlug', category.slug); // Siempre incluimos el slug de la categoría
  
    // Petición a la API con los filtros aplicados
    const response = await fetch(`/api/Products/filter?${query.toString()}`);
    
    if (response.ok) {
      const filteredData = await response.json();
      setFilteredProducts(filteredData);
    } else {
      console.error('Error al obtener productos:', response.statusText);
    }
  };

  return (
  <>
      <main className={styles.mainCategory}>
        <div className={styles.mobileFilterShow}>
          <MobileFilter
            brands={brands} 
            maxPrice={maxPrice} 
            subcategories={subcategories}  
            onFilterChange={handleFilterChange} 
          />
        </div>
        <Breadcrumbs/>
        <div className={styles.pageContainer}>
          <div className={styles.filterContainer}>
          <Filter 
              brands={brands} 
              maxPrice={maxPrice} 
              subcategories={subcategories} 
              onFilterChange={handleFilterChange} 
          />
          </div>
          <div className={styles.cardlistContainer}>
            <ResultCount
              totalItems={filteredProducts.length}
              currentPage={1} // Solo hay una "página", así que siempre es la primera
              itemsPerPage={filteredProducts.length} // Mostramos todos los productos
            />
            <Cardlistview products={filteredProducts} />
          </div>
        </div>
      </main>
  </>
  );
};

export default CategoryPageClient;
