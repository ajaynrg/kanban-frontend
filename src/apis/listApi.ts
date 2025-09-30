import { apiClient } from '../config/apiClient';
import { API_CONFIG } from '../config/api';
import type { List } from '../interfaces/list.model';

async function fetchListsByBoardId(boardId: string) {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.LISTS}?boardId=${boardId}`);
    return response.data;
}

async function createList(data: List) {
    const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.LISTS}/${data.boardId}`, data);
    return response.data;
}

async function deleteList(listId: string) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.LISTS}/${listId}`);
    return response.data;
}

async function updateList(data: List) {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.LISTS}/${data._id}`, data);
    return response.data;
}

export { fetchListsByBoardId, createList, deleteList, updateList };