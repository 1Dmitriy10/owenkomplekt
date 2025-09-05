// ============================================Плавный скролл===================================

/*
К ссылкам добавить класс _scroll-js
*/

export function anchorScroll() {
    //получаем все ссылки навигации
    let links = document.querySelectorAll('._scroll-js');
    for (const el of links) {
        el.addEventListener("click", getScroll);
    }
    function getScroll(ev) {
        ev.preventDefault();
        let anchor = ev.target.hash
        let block = document.querySelector(`${anchor}`);
        block.scrollIntoView({
            behavior: 'smooth'
        });
    }
}
anchorScroll()