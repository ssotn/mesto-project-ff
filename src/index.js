import './pages/index.css';
import initialCards from './scripts/cards.js';
import { openModalWindow, closeModalWindow } from './scripts/modal.js';

const template = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');

const profileEditButton = document.querySelector('.profile__edit-button');
const nameDisplay = document.querySelector(".profile__title");
const jobDisplay = document.querySelector(".profile__description");

const profileAddButton = document.querySelector('.profile__add-button');
const places = document.querySelector('.places__list');

const editProfileWindow = document.querySelector('.popup_type_edit');
const nameInput = editProfileWindow.querySelector('.popup__input_type_name');
const jobInput = editProfileWindow.querySelector('.popup__input_type_description');

const newCardWindow = document.querySelector('.popup_type_new-card');
const certanCardImage = document.querySelector('.popup__content_content_image');


const createCard = (name, link, deleteCallback) => {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    
    cardElement.querySelector('.card__title').textContent = name;
    cardElement.querySelector('.card__image').src = link;
    cardElement.querySelector('.card__image').alt = name;
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCallback(cardElement));

    return cardElement;
}

const removeCard = card => card.remove();

const addCards = () => initialCards.forEach(elem => cardsContainer.append(createCard(elem.name, elem.link, removeCard)));

addCards();

function handleFormSubmit(e) {
    e.preventDefault();
    // Получите значение полей jobInput и nameInput из свойства value
    // Выберите элементы, куда должны быть вставлены значения полей
    // Вставьте новые значения с помощью textContent
    nameDisplay.textContent = nameInput.value;
    jobDisplay.textContent = jobInput.value;

    closeModalWindow();
}

profileEditButton.addEventListener('click', (e) => {
    editProfileWindow.addEventListener('submit', handleFormSubmit);
    nameInput.value = nameDisplay.textContent;
    jobInput.value = jobDisplay.textContent;

    openModalWindow(e, editProfileWindow);

});



profileAddButton.addEventListener('click', (e) => openModalWindow(e, newCardWindow));
//places.addEventListener('click', (e) => openModalWindow(e, certanCardImage));

