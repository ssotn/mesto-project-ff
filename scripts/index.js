const template = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');

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
