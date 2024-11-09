// src/components/ui/Breadcrumbs/Breadcrumbs.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Product } from '@prisma/client';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
  product?: Product;
}

// Función para capitalizar la primera letra de cada palabra
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ product }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const pathnames = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbNav main-container">
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link href="/">Home</Link>
        </li>
        {pathnames.map((name, index) => (
          <li key={`/${pathnames.slice(0, index + 1).join('/')}`} className={styles.breadcrumbItem}>
            <Link href={`/${pathnames.slice(0, index + 1).join('/')}`}>
              {capitalize(name.replace(/-/g, ' '))} {/* Reemplazar guiones y capitalizar */}
            </Link>
          </li>
        ))}
        {product && (
          <li className={styles.breadcrumbItem}>
            {capitalize(product.name)}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
