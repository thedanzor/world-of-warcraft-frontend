'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronsLeft as FirstPageIcon,
  ChevronLeft as KeyboardArrowLeftIcon,
  ChevronRight as KeyboardArrowRightIcon,
  ChevronsRight as LastPageIcon
} from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  hasNextPage, 
  hasPreviousPage,
  onPageChange,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between p-4 border-t bg-background">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onFirstPage}
          disabled={!hasPreviousPage}
        >
          <FirstPageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
        >
          <KeyboardArrowLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="min-w-[40px]"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNextPage}
          disabled={!hasNextPage}
        >
          <KeyboardArrowRightIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onLastPage}
          disabled={!hasNextPage}
        >
          <LastPageIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
