'use client'

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {startItem} to {endItem} of {totalItems} results
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={onFirstPage}
          disabled={!hasPreviousPage}
          size="small"
        >
          <FirstPageIcon />
        </IconButton>
        
        <IconButton
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          size="small"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                variant={currentPage === pageNum ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onPageChange(pageNum)}
                sx={{ minWidth: 40 }}
              >
                {pageNum}
              </Button>
            );
          })}
        </Box>

        <IconButton
          onClick={onNextPage}
          disabled={!hasNextPage}
          size="small"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
        
        <IconButton
          onClick={onLastPage}
          disabled={!hasNextPage}
          size="small"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Pagination; 