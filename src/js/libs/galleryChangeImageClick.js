export function galleryChangeImageClick() {
    let mainImg = document.querySelector(".detail-product-gallery__main-img");
    let arrImg = document.querySelectorAll(".detail-product-gallery__slide")

    arrImg.forEach(el=>{
        el.addEventListener("click", changSrc)
    })

    function changSrc() {
        let item = event.currentTarget;
        let itemSrc = event.currentTarget.querySelector("img").src;
        let mainSrc = mainImg.querySelector("img");

        mainSrc.src = itemSrc;
        arrImg.forEach(el=>{
            el.classList.remove("active")
        })
        item.classList.add("active")
    }
};
galleryChangeImageClick();