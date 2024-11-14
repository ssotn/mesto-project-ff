import { mestoApi } from "./api";

/**
 * метод создания карточки
 * @param {*} params
 * @argument {*} template шаблон карточки
 * @argument {*} cardImagePopUp элемент картинка popUp
 * @argument {*} name наименование места
 * @argument {*} link url картинки в карточке
 * @argument {*} cardId айдишник карточки
 * @argument {*} ownerId айдишник владельца карточки
 * @argument {*} userId айдишник пользователя
 * @argument {*} cardLikes массив пользователей, поставивших лайки
 * @argument {*} deleteCallback метод удаления кароточки со страницы
 * @argument {*} likeCallback метод для действия поставить-убрать лайк
 * @argument {*} imgPopUpCallback метод открытия картинки карточки в модальном окне
 * @returns cardElement
 */
function createCard({template, cardImagePopUp, cardName, cardLink, cardId, ownerId, userId, cardLikes = [], 
     deleteCallback, likeCallback, imgPopUpCallback}) {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardImg = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likesCounter = cardElement.querySelector('.card__likes');
    
    cardTitle.textContent = cardName;
    cardImg.src = cardLink;
    cardImg.alt = cardName;
    cardElement.dataset.cardId = cardId; //добавили айдишник нашей карточке

    if (ownerId !== userId){ //оставляем кнопку удаления только у своих карточек
        cardDeleteButton.remove();
    } else {        
        cardDeleteButton.addEventListener('click', () => deleteCallback(cardElement));
    }

    likesCounter.textContent = cardLikes.length; //выставили кол-во лайков при создании карточки
    if (cardLikes.some(user => user._id === userId)) { //если с сервака подгрузилась карточка с нашим лайком - выставим нужный стиль
        like(cardLikeButton);
    }

    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton, {cardId, likesCounter}));
    cardImg.addEventListener('click', () => imgPopUpCallback(cardName, cardLink, cardImagePopUp));

    return cardElement;
}

/*метод обновления лайка в вёрстке. меняем картинку сердечка и выставляем кол-во лайков*/
function like(cardLikeBtn, updateLikesCount = false, likesCounter, count) {
    cardLikeBtn.classList.toggle('card__like-button_is-active');
    
    if (updateLikesCount) {
        likesCounter.textContent = count;
    }
}

/**
 * метод для действия поставить-убрать лайк
 * @param {*} cardLikeBtn //кнопка лайка
 * @param {*} cardId //айдишник карточки
 * @param {*} likesCounter //счётчик лайков
 */
function onLikeCard(cardLikeBtn, {cardId, likesCounter}) {
    cardLikeBtn.classList.contains('card__like-button_is-active') //проверяем, есть ли у элемента кнопки класс
    ? mestoApi.dislikeCard(cardId)
        .then((card) => like(cardLikeBtn, true, likesCounter, card.likes.length)) // если да - убираем его
        .catch(err => {
            console.log('Ошибка: ', err);
        })
    : mestoApi.likeCard(cardId)
        .then((card) => like(cardLikeBtn, true, likesCounter, card.likes.length)) // иначе - ставим
        .catch(err => {
            console.log('Ошибка: ', err);
        });
}

export {createCard, onLikeCard}

/** 1. попробовал codeium - пока не смог оценить. Плагин подчищает лишнее, комментарии и описание параметров пишет менее очевидные.
 * Оставлю как есть, может еще почитаю, как верно писать JSDOC.
 * 
 * 2. Спасибо за коммент со связанностью модулей. выпилил modal.js из card.js. Но изначально отказался от такой реализации,
 * т.к. в предыдущем спринте явно указывалось, что нужно метод удаления реализовывать в card.js. Сейчас его не осталось - только callback
 * 
 * 3. нужно ли таким же образом выпиливать отсюда onLikeCard и избавляться от связанности с "./api"?
 * **/