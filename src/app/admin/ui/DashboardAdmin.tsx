'use client';

import { useState } from 'react';
import styles from './DashboardAdmin.module.css'
import Link from 'next/link';
import React from 'react';

export default function DashboardAdmin() {
  const [activeSection, setActiveSection] = useState('');
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const sections = [
    { 
      name: 'Ventas', 
      path: '/admin/ventas', 
      subSections: [
        { name: 'Órdenes Pendientes', path: '/admin/ventas/ordenes-pendientes' },
        { name: 'Presupuestos', path: '/admin/ventas/presupuestos' }
      ]
    },
    { name: 'Estadísticas', path: '/admin/estadisticas' },
    { name: 'Productos', path: '/admin/productos' },
    { name: 'Categorías', path: '/admin/categorias' },
    { name: 'Banners', path: '/admin/banners' },
    { name: 'Usuarios', path: '/admin/usuarios' }
  ];

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menu}>
        {sections.map(({ name, path, subSections }) => (
          <li key={name} className={activeSection === name ? styles.active : ''}>
            <div onClick={() => {
              setActiveSection(name);
              if (subSections) {
                setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
              }
            }}>
              <Link href={path}>{name}</Link>
            </div>
            {subSections && expanded[name] && (
              <ul className={styles.subMenu}>
                {subSections.map(sub => (
                  <li key={sub.name}>
                    <Link href={sub.path}>{sub.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
