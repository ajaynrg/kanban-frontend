import { apiClient } from '../config/apiClient';
import { API_CONFIG } from '../config/api';

async function fetchAllLists() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.LISTS);
    return response.data;
}

async function createList(listData: { boardId: string, title: string, description?: string }) {
    const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.LISTS}/${listData.boardId}`, listData);
    return response.data;
}

async function deleteList(listId: string) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.LISTS}/${listId}`);
    return response.data;
}

async function updateList(listId: string, listData: { title: string, description?: string }) {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.LISTS}/${listId}`, listData);
    return response.data;
}

export { fetchAllLists, createList, deleteList, updateList };