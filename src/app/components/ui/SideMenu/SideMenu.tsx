'use client';

import { useState } from 'react';
import styles from './SideMenu.module.css';
import Link from 'next/link'; 
import { useMenuStore } from '../../../../store/menuStore';

export default function Component() {
  const { isMenuOpen, toggleMenu } = useMenuStore();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null); // Estado para el submenú

  const toggleSubMenu = (menuTitle: string) => {
    setOpenSubMenu(openSubMenu === menuTitle ? null : menuTitle);
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isMenuOpen ? styles.active : ''}`} 
        onClick={toggleMenu}
      />
      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
        
        <div className={styles.closeButton} onClick={toggleMenu}>
        <h2>Menu</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#cdccd1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </div>
        <nav className={styles.menuItems}>
          <ul>
            <li className={styles.menuCategory}>
              <Link href="/perifericos">🖱️ Periféricos</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${openSubMenu === 'Periféricos' ? styles.rotate : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleSubMenu('Periféricos'); }} // Evita que el clic se propague
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </li>
            <ul className={`${styles.subMenu} ${openSubMenu === 'Periféricos' ? styles.open : ''}`}>
              {['Teclados', 'Mouses', 'Auriculares', 'Monitores', 'Joystick', 'Impresoras', 'Cámaras', 'Micrófonos', 'Alfombras', 'Kit gamers', 'Otros'].map((item) => (
                <li key={item}>
                  <Link href={`/perifericos/${encodeURIComponent(item.toLowerCase())}`}>{item}</Link>
                </li>
              ))}
            </ul>

            <li className={styles.menuCategory}>
              <Link href="/hardware">🖥️ Hardware PC</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${openSubMenu === 'Hardware PC' ? styles.rotate : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleSubMenu('Hardware PC'); }} // Evita que el clic se propague
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </li>
            <ul className={`${styles.subMenu} ${openSubMenu === 'Hardware PC' ? styles.open : ''}`}>
              {['Procesadores', 'Motherboard', 'Gabinetes', 'Placas de video', 'Discos Duros HDD', 'Discos Solidos SSD', 'Memorias RAM', 'Fuentes'].map((item) => (
                <li key={item}>
                  <Link href={`/hardware/${encodeURIComponent(item.toLowerCase())}`}>{item}</Link>
                </li>
              ))}
            </ul>

            <li className={styles.menuCategory}>
              <Link href="/consolas-y-juegos">🕹️ Consolas y juegos</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${openSubMenu === 'Consolas y juegos' ? styles.rotate : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleSubMenu('Consolas y juegos'); }} // Evita que el clic se propague
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </li>
            <ul className={`${styles.subMenu} ${openSubMenu === 'Consolas y juegos' ? styles.open : ''}`}>
              {['Consolas', 'Juegos de PS4', 'Juegos de PS5', 'Tarjetas de regalos', 'Accesorios', 'Juegos de XBOX'].map((item) => (
                <li key={item}>
                  <Link href={`/consolas-y-juegos/${encodeURIComponent(item.toLowerCase())}`}>{item}</Link>
                </li>
              ))}
            </ul>

            <li className={styles.menuCategory} onClick={toggleMenu}>
              <Link href="/cables-repuestos">🔌 Cables o repuestos</Link>
            </li>
            <li className={styles.menuCategory} onClick={toggleMenu}>
              <Link href="/sillas-gamers">Sillas gamers</Link>
            </li>
            <li className={styles.menuCategory} onClick={toggleMenu}>
              <Link href="/notebooks">💻 Notebooks</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
