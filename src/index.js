import './pages/index.css';
import initialCards from './scripts/cards.js';
import { openModalWindow, closeModalWindow } from './scripts/modal.js';
import { createCard } from './scripts/card.js';

/*шаблон карточки, контейнер карточек*/
const template = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');

/*кнопка редактирования профиля на странице*/
const profileEditButton = document.querySelector('.profile__edit-button');
const nameDisplay = document.querySelector(".profile__title");
const jobDisplay = document.querySelector(".profile__description");

/*кнопка добавления новой карточки*/
const profileAddButton = document.querySelector('.profile__add-button');

/*окно редактирования профиля и поля*/
const editProfileWindow = document.querySelector('.popup_type_edit');
const nameInput = editProfileWindow.querySelector('.popup__input_type_name');
const jobInput = editProfileWindow.querySelector('.popup__input_type_description');

/*окно добавления новой карточки и поля*/
const newCardWindow = document.querySelector('.popup_type_new-card');
const newCardName = newCardWindow.querySelector('.popup__input_type_card-name');
const newCardUrl = newCardWindow.querySelector('.popup__input_type_url');

/*модальное окно - картинка карточки и поля*/
const cardImagePopUp = document.querySelector('.popup_type_image');
const cardImagePopUpCaption = cardImagePopUp.querySelector('.popup__caption');
const cardImagePopUpImage = cardImagePopUp.querySelector('.popup__image');

/*метод удаления карточки - передаём как коллбэк в createCard*/
const removeCard = card => card.remove();
/*метод для действия поставить-убрать лайк карточки - передаём как коллбэк в createCard*/
const onLikeCard = cardLike => cardLike.classList.toggle('card__like-button_is-active');
/*метод для открытия картинки карточки в модальном окне - передаём как коллбэк в createCard*/
const onImgClick = (imgName, imgLink, cardPopUp) => {
    cardImagePopUpImage.src = imgLink;
    cardImagePopUpImage.alt = imgName;
    cardImagePopUpCaption.textContent = imgName;
 
    openModalWindow(cardPopUp);
};

/*метод отправки  - коллбэк для кнопки "Сохранить" на форме Редактирования профиля*/
const handleFormSubmit = e => {
    e.preventDefault();
    nameDisplay.textContent = nameInput.value;
    jobDisplay.textContent = jobInput.value;

    closeModalWindow();
}

/*метод добавления новой карточки - коллбэк для кнопки "Сохранить" на форме Создания*/
const handleFormAddCardSubmit = e => {
    e.preventDefault();
    cardsContainer.prepend(createCard(template, cardImagePopUp, newCardName.value, newCardUrl.value, removeCard, onLikeCard, onImgClick));
    
    document.forms['new-place'].reset();
    closeModalWindow();
}

/*обработчик клика кнопки Редактировать*/
profileEditButton.addEventListener('click', e => {
    editProfileWindow.addEventListener('submit', handleFormSubmit);
    nameInput.value = nameDisplay.textContent;
    jobInput.value = jobDisplay.textContent;

    openModalWindow(editProfileWindow);

});

/*обработчик клика кнопки Создать*/
profileAddButton.addEventListener('click', e => {
    newCardWindow.addEventListener('submit', handleFormAddCardSubmit);
    openModalWindow(newCardWindow);
});

/*метод заполнения контейнера карточек при загрузке страницы*/
const addCards = () => initialCards.forEach(elem => cardsContainer.append(createCard(template, cardImagePopUp, elem.name, elem.link, removeCard, onLikeCard, onImgClick)));

addCards();
