/**
 * @file Authentication hook for protected routes
 * @module core/hooks/useAuth
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for admin authentication
 * @returns {Object} Authentication state and functions
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('settings_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/install/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Login failed',
        };
      }

      // Store authentication state
      sessionStorage.setItem('settings_authenticated', 'true');
      setIsAuthenticated(true);
      
      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Error logging in:', error);
      return {
        success: false,
        error: 'Failed to login. Please try again.',
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('settings_authenticated');
    setIsAuthenticated(false);
    router.push('/settings');
  };

  return {
    isAuthenticated,
    isChecking,
    login,
    logout,
    loginCredentials,
    setLoginCredentials,
  };
}

