import { mestoApi } from "./api";
import { openModalWindow, closeModalWindow } from './modal.js';

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
function createCard({template, cardImagePopUp, cardName, cardLink, cardId, ownerId, userId, cardLikes = [], cardConfirmationPopUp,
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
        //cardDeleteButton.addEventListener('click', () => deleteCallback(cardElement));
        cardDeleteButton.addEventListener('click', () => deleteCallback(cardConfirmationPopUp, cardElement));
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

/*модальное окно - подтверждение на удаление карточки*/
function onRemoveCardClick(cardConfirmationPopUp, card) {
    const cardElement = card; //прокидываем константой дальше - иначе теряется dataset
    const cardConfirmationBtn = cardConfirmationPopUp.querySelector('.popup__button');
    
    cardConfirmationBtn.addEventListener('click', () => removeCard(cardElement, cardConfirmationPopUp));
    openModalWindow(cardConfirmationPopUp);
};

/**
 * новый метод удаления карточки со страницы - с окном подтверждения
 * @param {*} card
 * @param {*} win
 */
function removeCard(card, win) {    
    mestoApi.deleteCard(card.dataset.cardId)//удаялем карточку с сервера по айдишнику
    .then(() => card.remove())//удаляем из разметки
    .catch(err => {
        console.log('Ошибка: ', err);
    })
    .finally(() => {
        closeModalWindow(win)
    });
}

/**
 * метод для действия поставить-убрать лайк
 * @param {*} cardLikeBtn //кнопка лайка
 * @param {*} cardId //айдишник карточки
 * @param {*} likesCounter //счётчик лайков
 */
function onLikeCard(cardLikeBtn, {cardId, likesCounter}) {
    cardLikeBtn.classList.contains('card__like-button_is-active')
    ? mestoApi.dislikeCard(cardId).then((card) => like(cardLikeBtn, true, likesCounter, card.likes.length)) // если да - убираем его
    : mestoApi.likeCard(cardId).then((card) => like(cardLikeBtn, true, likesCounter, card.likes.length)); // иначе - ставим
}

export {createCard, onRemoveCardClick, onLikeCard}
