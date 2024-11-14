import './pages/index.css';
import { openModalWindow, closeModalWindow } from './scripts/modal.js';
import { createCard, onLikeCard } from './scripts/card.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { mestoApi } from './scripts/api.js';

let USER_ID;
let cardToDelete, cardIdToDelete; //в глобальные переменные пишем нужные параметры для удаления карточки. получаем их в коллбэке в createCard

/*конфиг для валидирования форм*/
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
}

/*меняем текст кнопки "Сохранить" на "Сохранение..."*/
const loading = {
    start: btn => btn.textContent = "Сохранение...",
    stop: btn => btn.textContent = "Сохранить"
}

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

/*модальное окно редактирования автара и поля url*/
const editAvatarWindow = document.querySelector('.popup_type_avatar-edit');
const newAvatarUrl = editAvatarWindow.querySelector('.popup__input_type_avatar-url');

/*модальное окно редактирования профиля и поля*/
const editProfileWindow = document.querySelector('.popup_type_edit');
const nameInput = editProfileWindow.querySelector('.popup__input_type_name');
const jobInput = editProfileWindow.querySelector('.popup__input_type_description');

/*модальное окно добавления новой карточки и поля*/
const newCardWindow = document.querySelector('.popup_type_new-card');
const newCardName = newCardWindow.querySelector('.popup__input_type_card-name');
const newCardUrl = newCardWindow.querySelector('.popup__input_type_url');

/*модальное окно - картинка карточки и поля*/
const cardImagePopUp = document.querySelector('.popup_type_image');
const cardImagePopUpCaption = cardImagePopUp.querySelector('.popup__caption');
const cardImagePopUpImage = cardImagePopUp.querySelector('.popup__image');

/*модальное окно - подтверждение на удаление карточки и кнопка подтверждения*/
const cardConfirmationPopUp = document.querySelector('.popup_type_confirmation');
const cardConfirmationBtn = cardConfirmationPopUp.querySelector('.popup__button');

/*вешаем слушатели событий только после того, как HTML документ будет полностью загружен и разобран*/
document.addEventListener('DOMContentLoaded', () => {
    /*листенеры на submit форм и кнопки подтверждения удаления карточки*/
    profileForm.addEventListener('submit', handleFormProfileSubmit);
    newPlaceForm.addEventListener('submit', handleFormAddCardSubmit);
    avatarForm.addEventListener('submit', handleFormAvatarSubmit);
    cardConfirmationBtn.addEventListener('click', handleCardDeleteSubmit);

    /*пробежались по всем "крестикам закрытия" на странице и навесили на них слушатель*/
    closeButtons.forEach(button => {        
        const win = button.closest('.popup');// находим 1 раз ближайший к крестику попап         
        button.addEventListener('click', () => closeModalWindow(win));// устанавливаем обработчик закрытия на крестик
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
});

/*метод для открытия картинки карточки в модальном окне - передаём как коллбэк в createCard*/
const onImgClick = (...args) => {
    const [imgName, imgLink, cardPopUp] = args;
    
    cardImagePopUpImage.src = imgLink;
    cardImagePopUpImage.alt = imgName;
    cardImagePopUpCaption.textContent = imgName;
    openModalWindow(cardPopUp);
};

/*метод открытия модального окна для подтверждения удаления - передаём как коллбэк в createCard*/
const onRemoveCard = (...args) => {
    const [ cardElement ] = args; 
    const { cardId } = cardElement.dataset;

    cardToDelete = cardElement;
    cardIdToDelete = cardId;
    openModalWindow(cardConfirmationPopUp);
}

/*метод удаления карточки - коллбэк для кнопки "Да" в диалоговом окне подтверждения удаления*/
const handleCardDeleteSubmit = e => {    
    const win = e.target.closest('.popup'); 

    mestoApi.deleteCard(cardIdToDelete)//удаляем карточку с сервера по айдишнику
    .then(() => cardToDelete.remove())//удаляем из разметки
    .catch(err => {
        console.log('Ошибка: ', err);
    })
    .finally(() => {
        closeModalWindow(win)
    });
}

/*метод отправки - коллбэк для кнопки "Сохранить" на форме Редактирования аватара*/
const handleFormAvatarSubmit = e => {
    loading.start(e.submitter);
    e.preventDefault();
    const win = e.submitter.closest('.popup');    
    const dataToSend = { 
        avatar: newAvatarUrl.value,
    }

    mestoApi.updateAvatar(dataToSend) //отсылаем отредактированные поля профиля
    .then(newUserData => {
        profileAvatar.style.backgroundImage = `url('${newUserData.avatar}')`;
    })
    .catch(err => {
        console.log('Ошибка: ', err);
    })
    .finally(()=> {
        loading.stop(e.submitter);
        closeModalWindow(win)
    });  
}

/*метод отправки  - коллбэк для кнопки "Сохранить" на форме Редактирования профиля*/
const handleFormProfileSubmit = e => {
    loading.start(e.submitter);
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
    })
    .catch(err => {
        console.log('Ошибка: ', err);
    })
    .finally(()=>{
        loading.stop(e.submitter);
        closeModalWindow(win)
    });
}

/*метод добавления новой карточки - коллбэк для кнопки "Сохранить" на форме Создания*/
const handleFormAddCardSubmit = e => {
    loading.start(e.submitter);
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
                cardConfirmationPopUp: cardConfirmationPopUp,
                deleteCallback: onRemoveCard,
                likeCallback: onLikeCard(mestoApi), //вызываем метод прокидывая mestoApi в card.js/ либо, еще вариант - прокидывать mestoApi еще одним параметром в createCard
                imgPopUpCallback: onImgClick
            })
        );
        newPlaceForm.reset();        
    })
    .catch(err => {
        console.log('Ошибка: ', err);
    })
    .finally(() => {
        loading.stop(e.submitter);
        closeModalWindow(win)
    });    
}

/*метод заполнения в вёрске контейнера карточек при загрузке страницы*/
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
            cardConfirmationPopUp: cardConfirmationPopUp,
            deleteCallback: onRemoveCard,
            likeCallback: onLikeCard(mestoApi),
            imgPopUpCallback: onImgClick
        })
    ));
}

/*метод обновления элементов в вёрстке после инициализации страницы и загрузки данных с сервера*/
const updateProfileInfo = user => {
    nameDisplay.textContent = user.name;
    jobDisplay.textContent = user.about;
    profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
}

/*вызываем методы отрисовки карточек и профиля после получения всех данных с сервера*/
Promise.all([mestoApi.getUser(), mestoApi.getCards()]) 
.then(([user, cards]) => {
    USER_ID = user._id;
    updateProfileInfo(user);
    addCards(cards);    
}).catch(err => {
    console.log('Ошибка: ', err);
});

enableValidation(validationConfig);
