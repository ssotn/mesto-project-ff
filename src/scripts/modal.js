export function openModalWindow(e, win) {
    win.classList.add('popup_is-opened');

    const closeBtn = win.querySelector('.popup__close');
    closeBtn.addEventListener('click', () => closeModalWindow({win}));
}

function closeModalWindow(params) {
    const { win } = params;
    win.classList.remove('popup_is-opened');
}

function onOverlayClick(e){

}

function onEscClick(e){

}

