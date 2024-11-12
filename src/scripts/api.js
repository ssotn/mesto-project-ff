import { get, post } from './baseApi.js';

const initMestoAPI = () => ({
    getCards: () => get('cards'), //получить список карточек
    getUser: () => get('users/me'), //получить информацию о пользователе
    updateProfile: (data) => post('users/me', data, 'PATCH'), //обновить данные о пользователе

    createCard: (data) => post('cards', data), //добавить новую карточку
    deleteCard: (id) => post(`cards/${id}`, {}, 'DELETE'), //добавить новую карточку
    likeCard: (id) => post(`cards/likes/${id}`, {}, 'PUT'), //поставить лайк карточке
    dislikeCard: (id) => post(`cards/likes/${id}`, {}, 'DELETE'), //убрать свой лайк с карточки
});

export const mestoApi = initMestoAPI();