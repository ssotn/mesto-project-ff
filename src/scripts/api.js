import { get } from './baseApi.js';

const initMestoAPI = () => ({
    getCards: () => get("cards"), //получить список карточек
});

export const mestoApi = initMestoAPI();