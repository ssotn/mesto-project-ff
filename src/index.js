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
const newCardName = newCardWindow.querySelector('.popup__input_type_card-name');
const newCardUrl = newCardWindow.querySelector('.popup__input_type_url');

const cardImagePopUp = document.querySelector('.popup_type_image');
const cardImagePopUpCaption = cardImagePopUp.querySelector('.popup__caption');
const cardImagePopUpImage = cardImagePopUp.querySelector('.popup__image');


const createCard = (name, link, deleteCallback, likeCallback, imgPopUpCallback) => {
    const cardElement = template.querySelector('.places__item').cloneNode(true);
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardImg = cardElement.querySelector('.card__image');
    
    cardElement.querySelector('.card__title').textContent = name;
    cardElement.querySelector('.card__image').src = link;
    cardElement.querySelector('.card__image').alt = name;
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCallback(cardElement));
    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton));
    cardImg.addEventListener('click', (e) => imgPopUpCallback(e, name, link, cardImagePopUp));

    return cardElement;
}

const removeCard = card => card.remove();
const onLikeCard = cardLike => cardLike.classList.toggle('card__like-button_is-active');
const onImgClick = (e, imgName, imgLink, cardPopUp) => {
    cardImagePopUpImage.src = imgLink;
    cardImagePopUpImage.alt = imgName;
    cardImagePopUpCaption.textContent = imgName;
 
    openModalWindow(cardPopUp);
 };

const addCards = () => initialCards.forEach(elem => cardsContainer.append(createCard(elem.name, elem.link, removeCard, onLikeCard, onImgClick)));

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

function handleFormAddCardSubmit(e) {
    e.preventDefault();
    cardsContainer.prepend(createCard(newCardName.value, newCardUrl.value, removeCard));
    
    document.forms['new-place'].reset();
    closeModalWindow();
}

profileEditButton.addEventListener('click', e => {
    editProfileWindow.addEventListener('submit', handleFormSubmit);
    nameInput.value = nameDisplay.textContent;
    jobInput.value = jobDisplay.textContent;

    openModalWindow(editProfileWindow);

});

profileAddButton.addEventListener('click', e => {
    newCardWindow.addEventListener('submit', handleFormAddCardSubmit);
    openModalWindow(newCardWindow);
});

