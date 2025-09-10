const API_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BACKEND_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error',
      0,
      { error: error.message }
    );
  }
}

export const clientApi = {
  // Get guild data
  async getGuildData() {
    return apiRequest('/api/data');
  },

  // Get filtered and paginated guild data
  async getFilteredGuildData(params = {}) {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/data${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get missing enchants statistics
  async getMissingEnchantsStats() {
    try {
      const response = await fetch('/api/stats/missing-enchants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching missing enchants statistics:', error)
      throw error
    }
  },

  // Get top PvP players
  async getTopPvPPlayers() {
    try {
      const response = await fetch('/api/stats/top-pvp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching top PvP players:', error)
      throw error
    }
  },

  // Get top PvE (Mythic+) players
  async getTopPvEPlayers() {
    try {
      const response = await fetch('/api/stats/top-pve', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching top PvE players:', error)
      throw error
    }
  },

  // Start guild update
  async startGuildUpdate(dataTypes = ['raid', 'mplus', 'pvp']) {
    return apiRequest('/api/update', {
      method: 'POST',
      body: JSON.stringify({ dataTypes }),
    });
  },

  // Get status of active processes
  async getStatus() {
    return apiRequest('/api/status');
  },

  // Health check
  async healthCheck() {
    return apiRequest('/api/health');
  },

  // Get role count statistics
  async getRoleCounts() {
    try {
      const response = await fetch('/api/stats/role-counts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching role counts:', error)
      throw error
    }
  },

  // Season 3 API methods
  async getSeason3Data() {
    try {
      const response = await fetch('/api/season3/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching season 3 data:', error)
      throw error
    }
  },

  async submitSeason3Signup(formData) {
    try {
      const response = await fetch('/api/season3/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error submitting season 3 signup:', error)
      throw error
    }
  },
};

export { ApiError }; 