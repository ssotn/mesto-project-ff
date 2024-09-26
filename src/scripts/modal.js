export function openModalWindow(e, win) {
    const closeWinBtn = win.querySelector('.popup__close');    
    
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onOverlayClick);
    closeWinBtn?.addEventListener('click', closeModalWindow);

    win.classList.add('popup_is-opened');
    win.classList.add('popup_is-animated');
}

export function closeModalWindow(e) {
    const win = document.querySelector('.popup_is-opened');
    
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onOverlayClick);
    win.classList.remove('popup_is-opened');
}

function onOverlayClick(e) {
    if(e.target.classList.contains('popup')) {
        closeModalWindow(e);
    }
}

function onEscPress(e) {    
    if (e.key === 'Escape') {        
        closeModalWindow(e);
    }
}

