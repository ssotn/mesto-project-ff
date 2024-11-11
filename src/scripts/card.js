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
 * @argument {*} ownerId айдишник пользователя
 * @argument {*} deleteCallback метод удаления кароточки со страницы
 * @argument {*} likeCallback метод для действия поставить-убрать лайк
 * @argument {*} imgPopUpCallback метод открытия картинки карточки в модальном окне
 * @returns cardElement
 */

function createCard({template, cardImagePopUp, cardName, cardLink, cardId, ownerId, userId, deleteCallback, likeCallback, imgPopUpCallback}) {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardImg = cardElement.querySelector('.card__image');
    
    cardElement.querySelector('.card__title').textContent = cardName;
    cardImg.src = cardLink;
    cardImg.alt = cardName;
    cardElement.dataset.cardId = cardId; //добавили айдишник нашей карточке

    if (ownerId !== userId){ //оставляем кнопку удаления только у своих карточек
        cardDeleteButton.remove();
    } else {        
        cardDeleteButton.addEventListener('click', () => deleteCallback(cardElement));
    }

    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton));
    cardImg.addEventListener('click', () => imgPopUpCallback(cardName, cardLink, cardImagePopUp));

    return cardElement;
}
/**
 * метод удаления кароточки со страницы
 * @param {*} card 
 */
function removeCard(card) {
    mestoApi.deleteCard(card.dataset.cardId)//удаялем карточку с сервера по айдишнику
    .then(() => card.remove())//удаляем из разметки
}
/**
 * метод для действия поставить-убрать лайк
 * @param {*} cardLike 
 */
function onLikeCard(cardLike) {
    cardLike.classList.toggle('card__like-button_is-active');
}

export {createCard, removeCard, onLikeCard}
