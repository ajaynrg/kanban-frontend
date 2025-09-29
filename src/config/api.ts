// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    BOARDS: '/api/boards',
    LISTS: '/api/lists',
    // Add more endpoints as needed
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};