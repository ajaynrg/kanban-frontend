import { apiClient } from '../config/apiClient';
import { API_CONFIG } from '../config/api';

async function fetchAllBoards() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.BOARDS);
    return response.data;
}

async function createBoard(boardData: { title: string, description?: string }) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.BOARDS, boardData);
    return response.data;
}

async function deleteBoard(boardId: string) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.BOARDS}/${boardId}`);
    return response.data;
}

export { fetchAllBoards, createBoard, deleteBoard };