const BASE_URL = 'https://nomoreparties.co/v1/wff-cohort-26/';
const AUTH_GUID = '62c3797c-4bc2-4e71-b432-c76d38431338';

//обработчик ответа
const handleResponse = response => {
    return response.ok 
    ? response.json() 
    : Promise.reject(`Ошибка: ${res.status}`);
}

//Универсальная функция запроса
const baseRequest = (url, opts) => {
    const baseParams = {
        headers: {
            'Content-Type': 'application/json',
            authorization: AUTH_GUID
        }
    }
    return fetch(url, baseParams);
}

//универсальный GET
export const get = (uri) => {
    const url = BASE_URL + uri;

    return baseRequest(url, {
        method: "GET" 
    }).then(handleResponse);  
}
