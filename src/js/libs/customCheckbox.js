/*
<div class="custom-checkbox">
    <input type="checkbox">
    <div class="check-box"></div>
    <span>
        E-mail
    </span>
</div>
*/
export function customCheckbox() {
let checkboxWrap = document.querySelectorAll(".custom-checkbox");

checkboxWrap.forEach(el=>{
    el.addEventListener("click", transformCheckbox)
})

function transformCheckbox() {
    let customCheckbox = event.currentTarget.querySelector(".check-box");
    let checkbox = event.currentTarget.querySelector("input");

    console.log(customCheckbox)
    if(checkbox.checked) {
        customCheckbox.classList.add("active")
    }else{
        customCheckbox.classList.remove("active") 
    }
}
};
customCheckbox();
