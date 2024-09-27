/**
 * метод создания карточки
 * @param {*} params
 * @argument {*} template шаблон карточки
 * @argument {*} cardImagePopUp элемент картинка popUp
 * @argument {*} name наименование места
 * @argument {*} link url картинки в карточке
 * @argument {*} deleteCallback метод удаления кароточки со страницы
 * @argument {*} likeCallback метод для действия поставить-убрать лайк
 * @argument {*} imgPopUpCallback метод открытия картинки карточки в модальном окне
 * @returns cardElement
 */
function createCard({template, cardImagePopUp, cardName, carLink, deleteCallback, likeCallback, imgPopUpCallback}) {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardImg = cardElement.querySelector('.card__image');
    
    cardElement.querySelector('.card__title').textContent = cardName;
    cardImg.src = carLink;
    cardImg.alt = cardName;

    cardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCallback(cardElement));
    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton));
    cardImg.addEventListener('click', () => imgPopUpCallback(cardName, carLink, cardImagePopUp));

    return cardElement;
}
/**
 * метод удаления кароточки со страницы
 * @param {*} card 
 */
function removeCard(card) {
    card.remove();
}
/**
 * метод для действия поставить-убрать лайк
 * @param {*} cardLike 
 */
function onLikeCard(cardLike) {
    cardLike.classList.toggle('card__like-button_is-active');
}

export {createCard, removeCard, onLikeCard}
