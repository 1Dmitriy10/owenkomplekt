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
    firstOpen: true,    /*Первый элемент всегда открыт*/
    allOpen: false    /*Все элементы открыты*/
})

export const filterSpoilers = new Spoilers({
    item: 'filter__spoiler-js', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: false,    /*Режим аккордиона*/
    firstOpen: false,    /*Первый элемент всегда открыт*/
    allOpen: true    /*Все элементы открыты*/
})

export const catalogDetailTabsSpoilers = new Spoilers({
    item: 'catalog-detail-tabs__spoilers', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: false,    /*Режим аккордиона*/
    firstOpen: true,    /*Первый элемент всегда открыт*/
    allOpen: false    /*Все элементы открыты*/
})

export const catalogDetailItemSpoilers = new Spoilers({
    item: 'catalog-detail-spoilers-item', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: false,    /*Режим аккордиона*/
    firstOpen: false,    /*Первый элемент всегда открыт*/
    allOpen: false    /*Все элементы открыты*/
})

export const propertyDetailSpoilers = new Spoilers({
    item: 'param-item__property-spoilers_1', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: false,    /*Режим аккордиона*/
    firstOpen: false,    /*Первый элемент всегда открыт*/
    allOpen: false    /*Все элементы открыты*/
})

// Функция для создания экземпляра Spoilers в зависимости от ширины экрана
const createPropertyDetailSpoilers = () => {
  const mediaQuery = window.matchMedia('(max-width: 767px)');
  
  const config = mediaQuery.matches 
    ? {
        item: `param-item__property-spoilers_2`,
        timeAnimation: 300,
        accordion: false,
        firstOpen: false,
        allOpen: false
      }
    : {
        item: `param-item__property-spoilers_2`,
        timeAnimation: 300,
        accordion: false,
        firstOpen: true,
        allOpen: true
      };


  return new Spoilers(config);
};

// Создаем экземпляр
// export const propertyDetailSpoilers = createPropertyDetailSpoilers();
export const propertyDetailSpoilers_2 = createPropertyDetailSpoilers();

export const lcNavMobSpoilers = new Spoilers({
    item: 'lc__nav-mob-spoilers', /*класс споилера*/
    timeAnimation: 300, /*время анимации*/
    accordion: false,    /*Режим аккордиона*/
    firstOpen: false,    /*Первый элемент всегда открыт*/
    allOpen: false    /*Все элементы открыты*/
})






