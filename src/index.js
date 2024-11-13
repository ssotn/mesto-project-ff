import './pages/index.css';
import { openModalWindow, closeModalWindow } from './scripts/modal.js';
import { createCard, removeCard, onLikeCard } from './scripts/card.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { mestoApi } from './scripts/api.js';

let USER_ID;

/*шаблон карточки, контейнер карточек, ВСЕ "крестики закрытия" модальных окон, формы*/
const template = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');
const closeButtons = document.querySelectorAll('.popup__close');
const profileForm = document.forms['edit-profile'];
const newPlaceForm = document.forms['new-place'];
const avatarForm = document.forms['edit-avatar'];

/*элементы на странице - имя, деятельность, аватарка*/
const nameDisplay = document.querySelector(".profile__title");
const jobDisplay = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

/*кнопка редактирования аватара*/
const editAvatarButton = document.querySelector('.profile__image');

/*кнопка редактирования профиля на странице*/
const profileEditButton = document.querySelector('.profile__edit-button');

/*кнопка добавления новой карточки*/
const profileAddButton = document.querySelector('.profile__add-button');

/*окно редактирования автара и поля url*/
const editAvatarWindow = document.querySelector('.popup_type_avatar-edit');
const newAvatarUrl = editAvatarWindow.querySelector('.popup__input_type_avatar-url');

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

/*метод отправки  - коллбэк для кнопки "Сохранить" на форме Редактирования аватара*/
const handleFormAvatarSubmit = e => {
    e.preventDefault();
    const win = e.submitter.closest('.popup');    
    const dataToSend = { 
        avatar: newAvatarUrl.value,
    }

    mestoApi.updateAvatar(dataToSend) //отсылаем отредактированные поля профиля
    .then(newUserData => {
        profileAvatar.style.backgroundImage = `url('${newUserData.avatar}')`;
    }).finally(()=>closeModalWindow(win));  
  
}

/*метод отправки  - коллбэк для кнопки "Сохранить" на форме Редактирования профиля*/
const handleFormProfileSubmit = e => {
    e.preventDefault();
    const win = e.submitter.closest('.popup');
    const dataToSend = {
        name: nameInput.value,
        about: jobInput.value
    }

    mestoApi.updateProfile(dataToSend) //отсылаем отредактированные поля профиля
    .then(newProfileData => {
        nameDisplay.textContent = newProfileData.name;
        jobDisplay.textContent = newProfileData.about;
    }).finally(()=>closeModalWindow(win));
}

/*метод добавления новой карточки - коллбэк для кнопки "Сохранить" на форме Создания*/
const handleFormAddCardSubmit = e => {
    e.preventDefault();
    const win = e.submitter.closest('.popup');
    const dataToSend = { //отсылаем поля для новой карточки
        name: newCardName.value,
        link: newCardUrl.value
    }

    mestoApi.createCard(dataToSend)//отсылаем поля для новой карточки
    .then(newCard => { //собираем новую карточку из возвращенного объекта
        cardsContainer.prepend(
            createCard({
                template: template,
                cardImagePopUp: cardImagePopUp,
                cardName: newCard.name,
                cardLink: newCard.link,
                cardId: newCard._id,
                ownerId: newCard.owner._id,
                userId: USER_ID,
                cardLikes: newCard.likes,
                deleteCallback: removeCard,
                likeCallback: onLikeCard,
                imgPopUpCallback: onImgClick
            })
        );
        newPlaceForm.reset();        
    }).finally(() => closeModalWindow(win));    
}

/*пробежались по всем "крестикам закрытия" на странице и навесили на них слушатель*/
closeButtons.forEach(button => {
    // находим 1 раз ближайший к крестику попап 
    const win = button.closest('.popup');
    // устанавливаем обработчик закрытия на крестик
    button.addEventListener('click', () => closeModalWindow(win));
});

/*обработчик клика на Аватар*/
editAvatarButton.addEventListener('click', () => {
    
    openModalWindow(editAvatarWindow);
    avatarForm.reset();
    clearValidation(editAvatarWindow, validationConfig);
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
avatarForm.addEventListener('submit', handleFormAvatarSubmit);

/*метод заполнения контейнера карточек при загрузке страницы*/
const addCards = cards => { //получили массив карточек   
    cards.forEach(card => cardsContainer.append( //собираем и отображаем карточки
        createCard({
            template: template,
            cardImagePopUp: cardImagePopUp,
            cardName: card.name,
            cardLink: card.link,
            cardId: card._id,
            ownerId: card.owner._id,
            userId: USER_ID,
            cardLikes: card.likes,
            deleteCallback: removeCard,
            likeCallback: onLikeCard,
            imgPopUpCallback: onImgClick
        })
    ));
}

const updateProfileInfo = user => {
    nameDisplay.textContent = user.name;
    jobDisplay.textContent = user.about;
    profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
}

Promise.all([mestoApi.getUser(), mestoApi.getCards()]) //вызываем методы отрисовки карточек и профиля после получения всех данных с сервера
.then(([user, cards]) => {
    USER_ID = user._id;
    updateProfileInfo(user);
    addCards(cards);    
}).catch(err => {
    console.log('Ошибка: ', err);
});

enableValidation(validationConfig);
