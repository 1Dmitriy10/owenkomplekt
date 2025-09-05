export function fixedHeader() {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    let header = document.querySelector(".header__row_white");
    let row = document.querySelector(".header__row");
    let itemTop = header.getBoundingClientRect().top;

    window.addEventListener("scroll", getFixedHeader);

    function getFixedHeader() {
        if (mediaQuery.matches) {
            row.style.cssText = `display: none`
        } else {
            if (pageYOffset > itemTop && pageYOffset > 0) {
                // header.style.cssText = `position: fixed; top:0`
                row.style.cssText = `display: none`
            } else if (pageYOffset == 0) {
                // header.style.cssText = `position: static;`
                row.style.cssText = `display: flex`
            }
            else {
                // header.style.cssText = `position: static;`
                row.style.cssText = `display: flex`
            }
        }
    }
}
fixedHeader()