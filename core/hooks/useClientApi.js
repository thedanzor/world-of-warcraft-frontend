'use client'

import { useState, useCallback } from 'react';
import { clientApi, ApiError } from '@/lib/clientApi';

export function useGuildUpdate() {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [processId, setProcessId] = useState(null);

  const startUpdate = useCallback(async (dataTypes = ['raid', 'mplus', 'pvp']) => {
    try {
      setUpdating(true);
      setUpdateError(null);
      
      const response = await clientApi.startGuildUpdate(dataTypes);
      
      if (response.success) {
        setProcessId(response.processId);
        return response;
      } else {
        throw new ApiError('Failed to start update', 500, response);
      }
    } catch (err) {
      setUpdateError(err);
      console.error('Error starting guild update:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updating,
    updateError,
    processId,
    startUpdate,
  };
}

export function useGuildStatus() {
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setStatusLoading(true);
      setStatusError(null);
      
      const response = await clientApi.getStatus();
      
      if (response.success) {
        setStatus(response);
      } else {
        throw new ApiError('Failed to fetch status', 500, response);
      }
    } catch (err) {
      setStatusError(err);
      console.error('Error fetching status:', err);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  return {
    status,
    statusLoading,
    statusError,
    fetchStatus,
  };
} 