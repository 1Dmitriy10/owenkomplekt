export class Masonry {

    constructor(wrap) {

        let check = document.querySelector(`.${wrap.class}`)
        if (!check) {
            return null;
        }
        // обертка
        this.wrap = document.querySelector(`.${wrap.class}`);
        // массив элементов
        this.arrItems = [...this.wrap.children];
        // Кол-во колонок 
        this.cols = wrap.cols;
        // Кол-во колонок 
        this.countCols = 0;
        // отступ по горизонтали
        this.rowGap = wrap.rowGap;
        // отступ по вертикали
        this.colGap = wrap.colGap;
        // брейкпоинты
        this.breakpoints = wrap.breakpoints;
        // первая строчка
        this.firstRow = [];

        this.setStyle()
        this.checkMediaWidth()
    }

    setStyle() {
        this.wrap.style.display = 'flex';
        this.wrap.style.flexWrap = `wrap`;


        this.arrItems.forEach(el => {
            el.classList.add("fit-content")
        })

    }

    checkMediaWidth() {
        let count = Object.keys(this.breakpoints).length;
        let arrBreakpoints = [];
        let nowBreakpoint = "";

        for (const key in this.breakpoints) {
            arrBreakpoints.push(key)
        }

        arrBreakpoints = arrBreakpoints.reverse();

        arrBreakpoints.forEach(el => {
            var media = window.matchMedia(`(max-width: ${el}px)`)

            if (media.matches) { // Если медиа запрос совпадает
                nowBreakpoint = el;
            }
        });

        if (!this.breakpoints[nowBreakpoint]) {
            this.countCols = this.cols;
        } else {
            this.countCols = this.breakpoints[nowBreakpoint];
        }

        this.switchCols()
    }

    switchCols() {
        if (this.countCols == 1) {
            this.arrItems.forEach(el => {
                el.style.cssText = `flex:0 1 calc(100%);`
            })
            this.wrap.style.rowGap = `${this.rowGap}px`;
            this.wrap.style.columnGap = `${this.colGap}px`;
        } else {
            this.wrap.style.rowGap = `${this.rowGap}px`;
            this.wrap.style.columnGap = `${this.colGap}px`;
            this.arrItems.forEach(el => {
                el.style.cssText = `flex:0 1 calc((100% - ${this.countCols - 1} * ${this.colGap}px) / ${this.countCols});`
            })

            this.renderMasonry();
        }
    }

    renderMasonry() {

        for (let index = 0; index < this.countCols; index++) {
            this.firstRow.push(this.wrap.children[index])
        }

        this.firstRow.forEach(el => {
            el.dataset.height = `${el.offsetTop + el.offsetHeight}`;
        })

        for (let index = this.countCols; index < this.arrItems.length; index++) {
            let oldHeight = this.arrItems[index - this.countCols].dataset.height
            let newHeight = this.arrItems[index].offsetTop

            this.arrItems[index].style.cssText = `margin-top:${(oldHeight - newHeight) + this.rowGap}px;
                flex:0 1 calc((100% - ${this.countCols - 1} * ${this.colGap}px) / ${this.countCols});
             `

            this.arrItems[index].dataset.height = `${this.arrItems[index].offsetTop + this.arrItems[index].offsetHeight}`;
        }
    }
}