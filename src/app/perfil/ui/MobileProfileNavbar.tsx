"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileProfileNavbar.module.css";

const MobileProfileNavbar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? styles.active : "";

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navScroll}>
        <Link href="/perfil" className={`${styles.navItem} ${isActive("/perfil")}`}>
          Mi Perfil
        </Link>
        <Link href="/perfil/Mispedidos" className={`${styles.navItem} ${isActive("/perfil/Mispedidos")}`}>
          Mis Pedidos
        </Link>
        <Link href="/perfil/TuInformacion" className={`${styles.navItem} ${isActive("/perfil/TuInformacion")}`}>
          Datos del Usuario
        </Link>
        <Link href="/perfil/salir" className={`${styles.navItem} ${isActive("/perfil/salir")}`}>
          Salir
        </Link>
      </div>
    </nav>
  );
};

export default MobileProfileNavbar;
