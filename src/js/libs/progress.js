export function progressPage() {
    let heightDocument = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let maxVal = heightDocument;
    let minVal = 0;
    let progress = document.querySelector(".progress")
    if(!progress) {return null}

    window.onload = () => {
        let x = pageYOffset

        let val = -100 + (Math.ceil((x / maxVal) * 100))
        progress.style.cssText = `
    left: ${val}%;
  `;
    };

    window.addEventListener("scroll", function (e) {
        let x = pageYOffset

        let val = -100 + (Math.ceil((x / maxVal) * 100))
        progress.style.cssText = `
    left: ${val}%;
  `;
    })
};
progressPage();