'use client';

import React, { useState, useEffect } from 'react'
import { useCartStore } from '../../../../store/cartStore';
import { useRouter } from 'next/navigation'; 
import styles from './MobileNavbar.module.css';
import SideMenu from '../SideMenu/SideMenu';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useSearchStore } from '../../../../store/searchStore';
import { useMenuStore } from '../../../../store/menuStore';

export default function MobileNavbar() {
  const { isSearchVisible, toggleSearch } = useSearchStore();
  const { toggleMenu } = useMenuStore();
  const cartItems = useCartStore((state) => state.cartItems)
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Hook para manejar la navegación

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      const formattedSearch = searchTerm.trim().replace(/\s+/g, '-').toLowerCase();
      const searchUrl = `/search/${formattedSearch}`; // URL de búsqueda simplificada
      router.push(searchUrl); // Redirigir a la nueva URL
      toggleSearch(); // Cierra el modal de búsqueda
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <>
      <div className={styles.Navbar}>
        <div className="main-container">
          <div className={styles.containerIcons}>
            <div className={styles.menuIcon} onClick={toggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-menu-2"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 18l16 0" />
              </svg>
            </div>
            <div className={styles.searchIcon} onClick={toggleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-search"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
            </div>
            <h3>Logo marca de Mateo</h3>
            <div className={styles.userIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-user"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className={styles.cartIcon}>
            <Link href="/carrito">
                {isClient && totalQuantity > 0 && (
                  <div className={styles.cartCounter}>
                    {totalQuantity}
                  </div>
                )}
                <ShoppingCart className="icon" size={30} color="#fff" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SideMenu />

      <div className={`${styles.searchContainer} ${isSearchVisible ? styles.show : ''}`}>
        <div className={styles.searchHeader}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown} // Detectamos cuando se presiona "Enter"
            />
            <div className={styles.searchIconInInput}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cdccd1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-search"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
            </div>
          </div>
          <div className={styles.closeIcon} onClick={toggleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cdccd1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
