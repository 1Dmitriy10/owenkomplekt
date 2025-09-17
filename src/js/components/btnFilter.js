export function btnFilter() {
    let btn = document.querySelector(".asside-filter-btn");
    let body = document.querySelector("body");
    let filter = document.querySelector(".asside-filter");

    if(!btn) {return null};

    btn.addEventListener("click",function(){
        
        filter.classList.toggle('active')
    })

    body.addEventListener("click", function(){
        if(!filter.contains(event.target) && !btn.contains(event.target)) {
            filter.classList.remove('active')
        }
    })
};
btnFilter();