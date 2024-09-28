/**
 * метод открытия модального окна - popUp'а, экспортируемый
 * @param {*} win 
 */
export function openModalWindow(win) {
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onOverlayClick);
    win.classList.add('popup_is-animated');
    setTimeout(() => win.classList.add('popup_is-opened'), 1);
}
/**
 * метод закрытия модального окна, экспортируемый
 * @param {*} win 
 */
export function closeModalWindow(win) {
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onOverlayClick);
    win.classList.remove('popup_is-opened');
}
/**
 * метод закрытия модального окна по клику вне модального окна
 * @param {*} e 
 */
function onOverlayClick(e) {
    const win = document.querySelector('.popup_is-opened');

    if(e.target.classList.contains('popup')) {
        closeModalWindow(win);
    }
}
/**
 * метод закрытия модального окна по нажатию Esc
 * @param {*} e 
 */
function onEscPress(e) {
    const win = document.querySelector('.popup_is-opened');

    if (e.key === 'Escape') {
        closeModalWindow(win);
    }
}
