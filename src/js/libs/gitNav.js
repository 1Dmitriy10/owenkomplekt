export function gitNav() {
    let block = document.querySelector(".git-nav-box");
    let check = true;
    
    block.addEventListener("click", function() {
        block.classList.toggle("show");
    })

    if(check) {
        block.style.cssText=`right:-100%`;    }
    };
    gitNav();