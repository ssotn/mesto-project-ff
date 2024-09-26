
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
export function createCard(template, cardImagePopUp, name, link, deleteCallback, likeCallback, imgPopUpCallback) {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardImg = cardElement.querySelector('.card__image');
    
    cardElement.querySelector('.card__title').textContent = name;
    cardElement.querySelector('.card__image').src = link;
    cardElement.querySelector('.card__image').alt = name;

    cardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCallback(cardElement));
    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton));
    cardImg.addEventListener('click', () => imgPopUpCallback(name, link, cardImagePopUp));

    return cardElement;
}

/**НЕ понятно задание в ТЗ: "...Функции, обрабатывающие события лайка и удаления карточки, также должны находиться в этом файле и экспортироваться из него."
 * зачем сюда переносить удаление и лайк карточки, если метод выше принимает их как коллбэки. Оставлю в index.js пока.
 * 
 * НЕ понятно, почему в ТЗ не упоминается третий коллбэк открытия картинки карточки в попАпе. Его тоже сюда?
 * -но в таком случае мне потребуется импортировать в этот модуль метод открытия модального окна из module.js
 * -импортировать модуль в модуль звучит неразумно - оставлю также в index.js
 */

/*
function onDelete(card) {
    card.remove();
}

function onLikeCard (cardLike) {
    cardLike.classList.toggle('card__like-button_is-active');
}
*/