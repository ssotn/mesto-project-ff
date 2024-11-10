import './pages/index.css';
import initialCards from './scripts/cards.js';
import { openModalWindow, closeModalWindow } from './scripts/modal.js';
import { createCard, removeCard, onLikeCard } from './scripts/card.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { mestoApi } from './scripts/api.js';

/*шаблон карточки, контейнер карточек, ВСЕ "крестики закрытия" модальных окон, формы*/
const template = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');
const closeButtons = document.querySelectorAll('.popup__close');
const profileForm = document.forms['edit-profile']
const newPlaceForm = document.forms['new-place'];

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

/*метод для открытия картинки карточки в модальном окне - передаём как коллбэк в createCard*/
const onImgClick = (imgName, imgLink, cardPopUp) => {
    cardImagePopUpImage.src = imgLink;
    cardImagePopUpImage.alt = imgName;
    cardImagePopUpCaption.textContent = imgName;
 
    openModalWindow(cardPopUp);
};

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
}

/*метод отправки  - коллбэк для кнопки "Сохранить" на форме Редактирования профиля*/
const handleFormProfileSubmit = e => {
    e.preventDefault();    
    const win = e.submitter.closest('.popup');

    nameDisplay.textContent = nameInput.value;
    jobDisplay.textContent = jobInput.value;

    closeModalWindow(win);
}

/*метод добавления новой карточки - коллбэк для кнопки "Сохранить" на форме Создания*/
const handleFormAddCardSubmit = e => {
    e.preventDefault();
    const win = e.submitter.closest('.popup');

    cardsContainer.prepend(
        createCard({
            template: template,
            cardImagePopUp: cardImagePopUp,
            cardName: newCardName.value,
            carLink: newCardUrl.value,
            deleteCallback: removeCard,
            likeCallback: onLikeCard,
            imgPopUpCallback: onImgClick
        })
    );

    newPlaceForm.reset();
    closeModalWindow(win);
}

/*пробежались по всем "крестикам закрытия" на странице и навесили на них слушатель*/
closeButtons.forEach(button => {
    // находим 1 раз ближайший к крестику попап 
    const win = button.closest('.popup');
    // устанавливаем обработчик закрытия на крестик
    button.addEventListener('click', () => closeModalWindow(win));
});

/*обработчик клика кнопки Редактировать*/
profileEditButton.addEventListener('click', () => {    
    nameInput.value = nameDisplay.textContent;
    jobInput.value = jobDisplay.textContent;

    openModalWindow(editProfileWindow);
    clearValidation(editProfileWindow, validationConfig);
});

/*обработчик клика кнопки Создать*/
profileAddButton.addEventListener('click', () => {
    openModalWindow(newCardWindow);
    newPlaceForm.reset();
    clearValidation(newCardWindow, validationConfig);
});

/*листенеры на submit форм*/
profileForm.addEventListener('submit', handleFormProfileSubmit);
newPlaceForm.addEventListener('submit', handleFormAddCardSubmit);

/*метод заполнения контейнера карточек при загрузке страницы*/
const addCards = () => {
    mestoApi.getCards() //дёрнули эндпоинт получения карточек
    .then(data => {     //получили массив карточек
        
        data.forEach(elem => cardsContainer.append( //собираем и отображаем карточки
            createCard({
                template: template,
                cardImagePopUp: cardImagePopUp,
                cardName: elem.name,
                carLink: elem.link,
                deleteCallback: removeCard,
                likeCallback: onLikeCard,
                imgPopUpCallback: onImgClick
            })
        ));
    })
    //старый метод заполнения карточек из константного массива
    /*initialCards.forEach(elem => cardsContainer.append(
        createCard({
            template: template,
            cardImagePopUp: cardImagePopUp,
            cardName: elem.name,
            carLink: elem.link,
            deleteCallback: removeCard,
            likeCallback: onLikeCard,
            imgPopUpCallback: onImgClick
        })
    ));*/
}

addCards();

enableValidation(validationConfig);
