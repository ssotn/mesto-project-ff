/**
 * метод создания карточки
 * @param {*} template шаблон карточки
 * @param {*} cardImagePopUp элемент картинка popUp
 * @param {*} name наименование места
 * @param {*} link url картинки в карточке
 * @param {*} deleteCallback метод удаления кароточки со страницы
 * @param {*} likeCallback метод для действия поставить-убрать лайк
 * @param {*} imgPopUpCallback метод открытия картинки карточки в модальном окне
 * @returns cardElement
 */
function createCard(template, cardImagePopUp, name, link, deleteCallback, likeCallback, imgPopUpCallback) {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardImg = cardElement.querySelector('.card__image');
    
    cardElement.querySelector('.card__title').textContent = name;
    cardImg.src = link;
    cardImg.alt = name;

    cardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCallback(cardElement));
    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton));
    cardImg.addEventListener('click', () => imgPopUpCallback(name, link, cardImagePopUp));

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
