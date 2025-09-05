export function galleryChangeImageClick() {
    let mainImg = document.querySelector(".project-detail__gallery-main-img");
    let arrImg = document.querySelectorAll(".project-detail__gallery-prev-item")

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