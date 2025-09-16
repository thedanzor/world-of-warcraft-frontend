const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

export const api = {
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
    
    // Now that we have 10MB cache limit, we can use caching again
    return apiRequest(endpoint);
  },

  // Get missing enchants statistics
  async getMissingEnchantsStats() {
    return apiRequest('/api/stats/missing-enchants')
  },

  // Get top PvP players
  async getTopPvPPlayers() {
    return apiRequest('/api/stats/top-pvp')
  },

  // Get top PvE (Mythic+) players
  async getTopPvEPlayers() {
    return apiRequest('/api/stats/top-pve')
  },

  // Get status of active processes
  async getStatus() {
    return apiRequest('/api/status')
  },

  // Health check
  async healthCheck() {
    return apiRequest('/api/health')
  },

  async getSeason3Data() {
    return apiRequest('/api/season3/data');
  },

  // Get role count statistics
  async getRoleCounts() {
    return apiRequest('/api/stats/role-counts')
  },

  // Get character seasonal statistics
  async getCharacterSeasonalStats(realm, character) {
    return apiRequest(`/api/seasonal-stats/character/${realm}/${character}`)
  },

  // Get seasonal statistics
  async getSeasonalStats(season = null) {
    const endpoint = season ? `/api/seasonal-stats?season=${season}` : '/api/seasonal-stats'
    return apiRequest(endpoint)
  },

  // Get seasonal leaderboard
  async getSeasonalLeaderboard(type = 'players', limit = 20) {
    return apiRequest(`/api/seasonal-stats/leaderboard?type=${type}&limit=${limit}`)
  },

  // Get complete character data from fetch endpoint
  async getCharacterData(realm, character, dataTypes = 'raid,mplus,pvp') {
    return apiRequest(`/api/fetch/${realm}/${character}?dataTypes=${dataTypes}`)
  },
};

export { ApiError };