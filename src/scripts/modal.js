/**
 * метод открытия модального окна - popUp'а, экспортируемый
 * @param {*} win 
 */
export function openModalWindow(win) {
    const closeWinBtn = win.querySelector('.popup__close');    
    
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onOverlayClick);
    closeWinBtn?.addEventListener('click', closeModalWindow);

    if (!win.classList.contains('popup_is-animated')){
        win.classList.add('popup_is-animated');
    }
        
    win.classList.add('popup_is-opened');
}
/**
 * метод закрытия модального окна, экспортируемый
 */
export function closeModalWindow() {
    const win = document.querySelector('.popup_is-opened');
    
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onOverlayClick);
    win.classList.remove('popup_is-opened');
}
/**
 * метод закрытия модального окна по клику вне модального окна
 * @param {*} e 
 */
function onOverlayClick(e) {
    if(e.target.classList.contains('popup')) {
        closeModalWindow();
    }
}
/**
 * метод закрытия модального окна по нажатию Esc
 * @param {*} e 
 */
function onEscPress(e) {    
    if (e.key === 'Escape') {        
        closeModalWindow();
    }
}

