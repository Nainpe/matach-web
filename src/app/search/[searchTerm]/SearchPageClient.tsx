// src/app/search/[searchTerm]/SearchPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Cardlistview from '../../components/ui/Cardlistview/Cardlistview';
import Filter from '../../components/ui/Filter/Filter';
import { Product, Brand } from '../../../types/index';
import styles from './SearchPageClient.module.css';
import MobileFilter from '../../components/ui/MobileFilter/MobileFilter';
import Breadcrumbs from '../../components/ui/breadcrumbs/Breadcrumbs';
import ResultCount from '../../components/ui/ResultCount/ResultCount';

// Asegúrate de incluir la definición de subcategorías en las props
interface SearchPageClientProps {
  products: Product[];
  brands: Brand[];
  maxPrice: number | null;
  searchTerm?: string; // Hacer que searchTerm sea opcional
  subcategories: { id: string; name: string; slug: string }[]; // Añadir subcategorías aquí
}

const SearchPageClient: React.FC<SearchPageClientProps> = ({ products, brands, maxPrice, searchTerm, subcategories }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm || '');

  useEffect(() => {
    // Filtrar productos automáticamente con base en el término de búsqueda al cargar
    const filteredBySearchTerm = products.filter(product =>
      product.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
    setFilteredProducts(filteredBySearchTerm);
  }, [products, currentSearchTerm]);

  const handleFilterChange = async (filters: { marca?: string[]; precioMin?: number; precioMax?: number }) => {
    // Primero filtrar los productos que coincidan con el término de búsqueda
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
    );
  
    // Aplicar filtros de marcas si están presentes
    if (filters.marca && filters.marca.length > 0) {
      filtered = filtered.filter((product) => filters.marca?.includes(product.brandId));
    }
  
    // Aplicar filtros de precio si están presentes
    if (typeof filters.precioMin === 'number') {
      filtered = filtered.filter((product) => product.price >= filters.precioMin!);
    }
    if (typeof filters.precioMax === 'number') {
      filtered = filtered.filter((product) => product.price <= filters.precioMax!);
    }
  
    setFilteredProducts(filtered);
  };

  return (
    <>
      <main className={styles.mainSearch}>
        <div className={styles.mobileFilterShow}>
          <MobileFilter
            brands={brands} 
            maxPrice={maxPrice} 
            onFilterChange={handleFilterChange}
            searchTerm={currentSearchTerm} // Pasar el término de búsqueda al componente MobileFilter
            // subcategories={subcategories} // Pasar las subcategorías aquí
          />
        </div>
        <Breadcrumbs />
        <div className={styles.pageContainer}>
          <div className={styles.filterContainer}>
            <Filter 
              brands={brands} 
              maxPrice={maxPrice} 
              subcategories={subcategories} // Pasar las subcategorías al componente Filter
              onFilterChange={handleFilterChange}  
              searchTerm={currentSearchTerm} // Pasar el término de búsqueda al componente Filter
            />
          </div>
          <div className={styles.cardlistContainer}>
            <ResultCount
              totalItems={filteredProducts.length}
              currentPage={1}
              itemsPerPage={filteredProducts.length}
            />
            <Cardlistview products={filteredProducts} />
          </div>
        </div>
      </main>
    </>
  );
};

export default SearchPageClient;
