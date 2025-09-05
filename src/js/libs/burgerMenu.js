import { BurgerMenu } from "../vendor/burgerMenu.js";

export const mobMenu = new BurgerMenu({
    /*---Класс кнопки для открывания меню---*/
    openBtn: ".mob-nav-btn",
    /*---Класс кнопки для закрытия меню (если кнопка для откр/закр одна - то оставить пустой)---*/
    closeBtn: "",
    /*---Иконка стрелки спойлера (svg или <i>)---*/
    arrowIcon: `
    <svg width="10" height="10" viewBox="0 0 52 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.20711 1.70711L25.2929 25.7929C25.6834 26.1834 26.3166 26.1834 26.7071 25.7929L50.7929 1.70711C51.4229 1.07714 50.9767 1.57952e-06 50.0858 1.57952e-06H1.91422C1.02331 1.57952e-06 0.577144 1.07714 1.20711 1.70711Z" fill="black"/>
    </svg>
    `,
    /*---Скорость анимации появления меню (0.3)---*/
    menuAnimationTime: "",
    /*---Скорость анимации спойлеров (0.3)---*/
    spoilersAnimationTime: "",
    /*---Режим аккордиона---*/
    spoilersAccordion: false,
    /*---Сторона открывания меню horizontal/vertical---*/
    openingSide: "horizontal",
    /*---Разрешение при котором появиться меню---*/
    mediaShow: "768px"

})