export function btnUnderline() {
    let btns = document.querySelectorAll("._btn-underline-js");

    btns.forEach(el => {
        let text = el.innerText;
        el.innerHTML = "";
        el.insertAdjacentHTML("beforeend", `
        <span class = "_underline-js">${text}</span>
        `);
    })
}
btnUnderline()