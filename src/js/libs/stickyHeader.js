export function stickyHeader() {
    let btnOpen = document.querySelector('#sticky-menu-open');
    let mobMenu = document.querySelector('#mob-menu');
    let stickyHeader = document.querySelector('.sticky-header');

    if(!stickyHeader) {
        return null
    }

    window.addEventListener("scroll", getStickyHeader)
    
    btnOpen.addEventListener("click", function() {
        mobMenu.classList.toggle("active");
    })
    
    function getStickyHeader() {
        let x = pageYOffset;
        if(x > 150) {
            stickyHeader.classList.add("show")
        }else{
            stickyHeader.classList.remove("show")
        }
    }
    };
    stickyHeader();