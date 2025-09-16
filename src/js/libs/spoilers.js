//   ===================================================Спойлеры=======================================================
{/* <details>
    <summary class="_spoiler-js">Заголовок 1</summary>
        <div class="spoiler-content">
            Контент 1
        </div>
</details> */}
// -----------------------------------------------------------------------------------------------

import { Spoilers } from "../vendor/spoilers.js";

export const spoilers = new Spoilers({
    item: '_spoiler-js', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: true,    /*Режим аккордиона*/
    firstOpen: true    /*Первый элемент всегда открыт*/
})

export const filterSpoilers = new Spoilers({
    item: 'filter__spoiler-js', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: false,    /*Режим аккордиона*/
    firstOpen: false    /*Первый элемент всегда открыт*/
})



