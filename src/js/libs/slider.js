// ========================= Подключение слайдера =============================================
//подключение в gulp 
import Swiper from 'swiper/bundle';
import "swiper/swiper-bundle.css";


export const casesPrevSlider = new Swiper('.cases-prev-slider', {
    // Стрелки
    navigation: {
        nextEl: '.slider-btn-next',
        prevEl: '.slider-btn-prev',
    },
    grabCursor: true,
    speed: 700,
});

export const slider = new Swiper('.swiper', {
    // Стрелки
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    /*Скорость переключения слайдов*/
    // speed: 700,
    /*Отступ у карточек*/
    // spaceBetween: 22,
    /*Показывать по n карточек*/
    // slidesPerView: 1,
    /* При достижении конца, перепрыгнуть в начало */
    // rewind: true,
    /*Увеличение при наведении курсора мыши */
    // zoom: true,
    /*Ленивая подгрузка */
    // lazy: true,
    /*Бесконечная прокрутка */
    // loop: true,
    /*Ориентация */
    // direction: 'vertical',
    /*Авто высота*/
    // autoHeight: true,
    /*иконка захвата при наведении на слайд*/
    grabCursor: true,
    /*Автоматическое перелистывание*/
    // autoplay: {
    // delay: 3000,          // Интервал между слайдами (3 сек)
    // disableOnInteraction: false, // Не отключать автопрокрутку после ручного перелистывания
    // pauseOnMouseEnter: true,     // Пауза при наведении (по умолчанию false в новых версиях)
  // },
    /*Брек-поинты*/
    // breakpoints: {
    //     1220: {
    //         slidesPerView: 4,
    //         spaceBetween: 30,
    //     },
    //     992: {
    //         slidesPerView: 3,
    //         spaceBetween: 15,
    //     },
    //     575: {
    //         slidesPerView: 2,
    //         spaceBetween: 15,
    //     }
    // },

});

export const detailProductGallerySlider = new Swiper('.detail-product-gallery__slider', {
    // Стрелки
    navigation: {
        nextEl: '.slider-btn-next',
        prevEl: '.slider-btn-prev',
    },
    grabCursor: true,
    speed: 700,
    /*Отступ у карточек*/
    spaceBetween: 10,
    /*Показывать по n карточек*/
    slidesPerView: 2,
    /*Брек-поинты*/
    breakpoints: {
        1000: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
    },
});





