import { apiClient } from '../config/apiClient';
import { API_CONFIG } from '../config/api';

async function fetchAllBoards() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOARDS);
    return response.data;
}

export { fetchAllBoards };