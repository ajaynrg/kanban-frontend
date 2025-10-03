import { apiClient } from '../config/apiClient';
import { API_CONFIG } from '../config/api';
import type { ICard } from '../interfaces/card.model';

const createCard = async (data: ICard) => {
    const response = await apiClient.post(`${API_CONFIG.BASE_URL}/cards`, data);
    return response.data;
};

export { createCard };

