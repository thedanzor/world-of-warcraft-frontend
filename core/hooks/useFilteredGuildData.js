'use client'

import { useState, useEffect, useCallback } from 'react';
import { clientApi, ApiError } from '@/lib/clientApi';

export function useFilteredGuildData(initialParams = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    filter: 'all',
    page: 1,
    limit: 80,
    search: '',
    rankFilter: 'all',
    classFilter: '',
    specFilter: 'all',
    minItemLevel: 0,
    ...initialParams
  });

  const fetchData = useCallback(async (fetchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await clientApi.getFilteredGuildData(fetchParams);
      
      if (response.success) {
        setData(response);
      } else {
        throw new ApiError('Failed to fetch data', 500, response);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching filtered guild data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when params change
  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  // Update specific parameter
  const updateParam = useCallback((key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change
      ...(key !== 'page' && { page: 1 })
    }));
  }, []);

  // Update multiple parameters at once
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when filters change
      ...(Object.keys(newParams).some(key => key !== 'page') && { page: 1 })
    }));
  }, []);

  // Navigate to specific page
  const goToPage = useCallback((page) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  // Next page
  const nextPage = useCallback(() => {
    if (data?.statistics?.hasNextPage) {
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [data?.statistics?.hasNextPage]);

  // Previous page
  const prevPage = useCallback(() => {
    if (data?.statistics?.hasPreviousPage) {
      setParams(prev => ({ ...prev, page: prev.page - 1 }));
    }
  }, [data?.statistics?.hasPreviousPage]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setParams({
      filter: 'all',
      page: 1,
      limit: 80,
      search: '',
      rankFilter: 'all',
      classFilter: '',
      specFilter: 'all',
      minItemLevel: 0
    });
  }, []);

  return {
    data,
    loading,
    error,
    params,
    updateParam,
    updateParams,
    goToPage,
    nextPage,
    prevPage,
    resetFilters,
    refetch: () => fetchData(params)
  };
} 