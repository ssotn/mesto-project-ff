import { get } from './baseApi.js';

const initMestoAPI = () => ({
    getCards: () => get("cards"), //получить список карточек
    getUser: () => get("users/me") //получить информацию о пользователе
});

export const mestoApi = initMestoAPI();