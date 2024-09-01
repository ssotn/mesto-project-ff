// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу


const template = document.querySelector('#card-template').content;
const cardList = document.querySelector('.places__list');
const addCardButton = document.querySelector('.profile__add-button');
const deleteCardButton = document.querySelector('.card__delete-button');

const createCard = (name, link, deleteCallback) => {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    cardElement.querySelector('.card__title').textContent = name;
    cardElement.querySelector('.card__image').src = link;

    cardElement.querySelector('.card__delete-button').addEventListener('click', deleteCallback)

    return cardElement;
}

const removeCard = e => e.target.closest('.places__item').remove();

const addCards = () => initialCards.forEach(elem => cardList.append(createCard(elem.name, elem.link, removeCard)));

addCards();