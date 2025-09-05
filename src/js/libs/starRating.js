export function starRating() {
    // найти блок
    let ratingBox = document.querySelector("#starRating");
    if(!ratingBox) return null
    // найти элементы
    let arrItems = ratingBox.querySelectorAll("svg");

    arrItems.forEach(el => {
     el.addEventListener("click", changeRating)   
    })

    // по клику закрашивать звезды
    function changeRating() {
        let item = event.currentTarget;
        item.classList.toggle("active")
    }
};
starRating();