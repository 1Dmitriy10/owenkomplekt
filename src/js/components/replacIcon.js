export function replacIcon() {
let arrItems = document.querySelectorAll("._spoiler-js-menu");

arrItems.forEach(el=>{
    el.addEventListener("click", function(){
        if(el.classList.contains('active')){
            addArrow(el)
            
        }
        else{
            removeArrow(el)
        }
    })
})

function addArrow(el){
let svg = el.parentElement.querySelector('.mob-nav-item-svg');
svg.classList.add("hidden")
let arrow = el.parentElement.querySelector('.mob-nav-item-arrow');
arrow.classList.add("active")
}

function removeArrow(el){
let svg = el.parentElement.querySelector('.mob-nav-item-svg');
svg.classList.remove("hidden")
let arrow = el.parentElement.querySelector('.mob-nav-item-arrow');
arrow.classList.remove("active")
}

};
replacIcon();