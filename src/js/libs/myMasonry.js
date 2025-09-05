/*
    <div class="_mansonry-js">
        <div ></div>
        <div ></div>
        <div ></div>
    </div>
*/

import { Masonry } from "../vendor/masonry.js";

export const myMasonry = new Masonry({
    class: '.masonry', /*класс споилера*/
    cols: 4, /*колличество колонок*/
    rowGap: 20,    /*отступ по горизонтали*/
    colGap: 10,   /*отступ по вертикали*/
    breakpoints: { /*Брейкпоинты / кол-во колонок*/
        "1220": 3,
        "768": 2,
        "576": 1,
    }
})