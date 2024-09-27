import './pages/index.css';
import initialCards from './scripts/cards.js';
import { openModalWindow, closeModalWindow } from './scripts/modal.js';
import { createCard, removeCard, onLikeCard } from './scripts/card.js';

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

/*метод отправки  - коллбэк для кнопки "Сохранить" на форме Редактирования профиля*/
const handleFormProfileSubmit = e => {
    e.preventDefault();    
    const win = e.submitter.closest('.popup');

    nameDisplay.textContent = nameInput.value;
    jobDisplay.textContent = jobInput.value;

    closeModalWindow(win);
}

/*метод добавления новой карточки - коллбэк для кнопки "Сохранить" на форме Создания*/
const handleFormAddCardSubmit = () => {
    e.preventDefault();
    const win = e.submitter.closest('.popup');

    cardsContainer.prepend(createCard(template, cardImagePopUp, newCardName.value, newCardUrl.value, removeCard, onLikeCard, onImgClick));    
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
    profileForm.addEventListener('submit', handleFormProfileSubmit);
    /*не понял как воспроизвести утечку памяти. Несколько раз прощёлкал кнопку с дебаггером в этой строке.
     каждый раз getEventListeners(profileForm) выдаёт массив листенеров с длиной = 1;
    */
    nameInput.value = nameDisplay.textContent;
    jobInput.value = jobDisplay.textContent;

    openModalWindow(editProfileWindow);
});

/*обработчик клика кнопки Создать*/
profileAddButton.addEventListener('click', () => {
    newPlaceForm.addEventListener('submit', handleFormAddCardSubmit);
    /*здесь также не смог воспроизвести утечку getEventListeners(newPlaceForm) */
    openModalWindow(newCardWindow);
});


/*метод заполнения контейнера карточек при загрузке страницы*/
const addCards = () => initialCards.forEach(elem => cardsContainer.append(createCard(template, cardImagePopUp, elem.name, elem.link, removeCard, onLikeCard, onImgClick)));

addCards();
