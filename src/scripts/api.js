import { get, post } from './baseApi.js';

const initMestoAPI = () => ({
    getCards: () => get("cards"), //получить список карточек
    getUser: () => get("users/me"), //получить информацию о пользователе
    createCard: (data) => post("cards", data), //добавить новую карточку
    updateProfile: (data) => post("users/me", data, "PATCH") //обновить данные о пользователе
});

export const mestoApi = initMestoAPI();