import { apiClient } from '../config/apiClient';
import { API_CONFIG } from '../config/api';
import type { ICard } from '../interfaces/card.model';

const createCard = async (data: ICard) => {
    const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.CARDS}/${data.listId}`, data);
    return response.data;
};

const deleteCard = async (cardId: string) => {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.CARDS}/${cardId}`);
    return response.data;
};

export { createCard, deleteCard };

