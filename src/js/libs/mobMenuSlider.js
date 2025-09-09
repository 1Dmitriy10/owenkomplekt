
/*
<div class="mob-slider">
        <div class="mob-slider-wrap">
            <div class="mob-menu-first-slide mob-slide">
            </div>
            <div class="mob-menu-second-slide mob-slide" style="min-width: 339px;">
            </div>
            <div class="mob-menu-thirt-slide mob-slide" style="min-width: 339px;">
            </div>
        </div>
    </div>
*/

export function mobMenuSlider(){
    // главный(внешний) блок слайдера
    let mobSlider = document.querySelector(".mob-slider");
    if(!mobSlider){return null}
    let width = mobSlider.clientWidth
    // кнопка вперед
    let btnCatalog = document.querySelector(".slider-menu-next");
    // Обертка слайдера
    let sliderTrack = document.querySelector(".mob-slider-wrap");
    // слайды
    let countSlide = sliderTrack.querySelectorAll(".mob-slide")
    let position = 0;
    // закрыть меню
    let closeBtn = document.querySelectorAll(".navi-box__close");
    // кнопка назад
    let backBtn = document.querySelectorAll(".navi-box__arrow");
    // кнопка открытия с липкого хедера
    let btnOpenMenuStiky = document.querySelector(".menu-open_second-sticky");
    // элементы меню
    let arrMenuItems = document.querySelectorAll(".mob-nav-list-products .mob-nav-item")
    // третий слайд
    let thirtSlide = document.querySelector(".mob-menu-thirt-slide")
    // блок третьего слайдера
    let thirtSlideWrap = thirtSlide.querySelector(".mob-menu-thirt-slide__munu-wrap")
 
    
    btnOpenMenuStiky.addEventListener("click", function(event) {
        let mob = document.querySelector(".mob-nav")
        mob.classList.add("active")
    })

    sliderTrack.style.width = `${width * 3}px`;
    countSlide.forEach(el=>{
        el.style.minWidth = `${width}px`;
    })

    btnCatalog.addEventListener("click", nextSlide)

    closeBtn.forEach(el=>{
        el.addEventListener("click", closeMenu)
        
    })

    backBtn.forEach(el=>{
        el.addEventListener("click", prevSlide)
    })

    arrMenuItems.forEach(el=>{
        if(el.querySelector(".sub-menu")) {
            el.addEventListener("click", function(event){
                getThirtSlide(event)
                nextSlide()
            })
        }
    })

    function nextSlide() {
        sliderTrack.style.transform = `translateX(${position-width}px)`
        position = position-width

    }

    function prevSlide() {
        if(position != 0) {
            sliderTrack.style.transform = `translateX(${position+width}px)`
            position = position+width
        }

    }

    function closeMenu() {
        let exit = document.querySelector('.mob-menu-close');
        exit.click();
        position = 0
        sliderTrack.style.transform = `translateX(${position})`
    }

    function getThirtSlide(event) {
        let menu = event.currentTarget.querySelector(".sub-menu");
        let menuСlone = menu.cloneNode(true);
        thirtSlideWrap.innerHTML="";
        thirtSlideWrap.insertAdjacentElement("beforeend", menuСlone)

    }
    
};
mobMenuSlider();