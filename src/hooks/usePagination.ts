import { useState, useEffect } from 'react';

interface UsePaginationProps {
  itemsPerPage?: number;
  resetTriggers?: any[];
}

interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  getPaginatedItems: <T>(items: T[]) => T[];
  getTotalPages: (totalItems: number) => number;
}

export const usePagination = ({ 
  itemsPerPage = 10, 
  resetTriggers = [] 
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when dependencies change (e.g., search query, filters)
  useEffect(() => {
    setCurrentPage(1);
  }, resetTriggers);

  const getPaginatedItems = <T>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number): number => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    getPaginatedItems,
    getTotalPages
  };
};

export default usePagination;
