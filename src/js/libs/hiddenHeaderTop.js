export function hiddenHeaderTop() {
    let headerTop = document.querySelector(".header");
    let hiddenHeader = document.querySelector(".header-top");
    let heigtHiddenHeader = hiddenHeader.clientHeight;

    window.addEventListener("scroll", function () {
        let position = pageYOffset;

        if (position > 0) {
            headerTop.style.cssText = `top: -${heigtHiddenHeader}px;`
        } else {
            headerTop.style.cssText = `top: 0;`
        }
    })
};
hiddenHeaderTop();