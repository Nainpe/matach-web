// src/components/ui/ResultCount/ResultCount.tsx
import React from 'react';

interface ResultCountProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

const ResultCount: React.FC<ResultCountProps> = ({ totalItems, currentPage, itemsPerPage }) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div>
      <p>
        Mostrando {start} - {end} de {totalItems} resultados
      </p>
    </div>
  );
};

export default ResultCount;
