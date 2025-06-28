import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  showSummary?: boolean;
  summaryText?: string;
}

/**
 * Reusable Pagination Component with smart page number display
 * 
 * Features:
 * - Smart pagination algorithm (never shows more than 7 page buttons)
 * - Responsive design (stacks on mobile)
 * - Ellipsis handling for large page counts
 * - Customizable summary text
 * - Accessible navigation controls
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  className = '',
  showSummary = true,
  summaryText
}) => {
  // Don't render if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  // Calculate the range of items currently displayed
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Smart pagination algorithm
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination for many pages
      if (currentPage <= 4) {
        // Near beginning: 1 2 3 4 5 ... last
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... -4 -3 -2 -1 last
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: 1 ... current-1 current current+1 ... last
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-3 ${className}`}>
      {/* Results Summary */}
      {showSummary && (
        <div className="text-sm text-gray-700">
          {summaryText || (
            <>
              Showing{' '}
              <span className="font-medium">{startItem}</span>{' '}
              to{' '}
              <span className="font-medium">{endItem}</span>{' '}
              of{' '}
              <span className="font-medium">{totalItems}</span>{' '}
              results
            </>
          )}
        </div>
      )}
      
      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronDown className="h-4 w-4 rotate-90" />
        </button>
        
        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => (
          pageNum === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500"
              aria-label="More pages"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum as number)}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          )
        ))}
        
        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronDown className="h-4 w-4 -rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
