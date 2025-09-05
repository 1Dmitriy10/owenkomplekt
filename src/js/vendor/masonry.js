export class Masonry {
    constructor(wrap) {
        this.wrap = document.querySelector(`${wrap.class}`);
        if (!this.wrap) return null;

        // Инициализация свойств
        this.arrItems = Array.from(this.wrap.children);
        this.cols = wrap.cols || 3;
        this.countCols = 0;
        this.rowGap = wrap.rowGap || 0;
        this.colGap = wrap.colGap || 0;
        this.breakpoints = wrap.breakpoints || {};
        this.firstRow = [];
        this.resizeObserver = null;

        this.init();
    }

    init() {
        this.setStyles();
        this.setupResponsiveBehavior();
    }

    setStyles() {
        this.wrap.style.display = 'flex';
        this.wrap.style.flexWrap = 'wrap';
        this.wrap.style.rowGap = `${this.rowGap}px`;
        this.wrap.style.columnGap = `${this.colGap}px`;

        this.arrItems.forEach(el => {
            el.classList.add('fit-content');
        });
    }

    setupResponsiveBehavior() {
        this.updateColumnsCount();
        
        // Используем ResizeObserver для отслеживания изменений размеров
        this.resizeObserver = new ResizeObserver(() => {
            this.updateColumnsCount();
        });
        
        this.resizeObserver.observe(this.wrap);
    }

    updateColumnsCount() {
        const breakpoints = Object.keys(this.breakpoints)
            .map(Number)
            .sort((a, b) => b - a); // Сортируем по убыванию

        let activeBreakpoint = null;
        
        // Находим первый подходящий брейкпоинт
        for (const breakpoint of breakpoints) {
            if (window.innerWidth <= breakpoint) {
                activeBreakpoint = breakpoint;
            }
        }

        this.countCols = activeBreakpoint 
            ? this.breakpoints[activeBreakpoint] 
            : this.cols;

        this.applyLayout();
    }

    applyLayout() {
        if (this.countCols === 1) {
            this.arrItems.forEach(el => {
                el.style.flex = '0 1 100%';
                el.style.marginTop = '';
            });
        } else {
            this.arrItems.forEach(el => {
                el.style.flex = `0 1 calc((100% - ${this.countCols - 1} * ${this.colGap}px) / ${this.countCols})`;
                el.style.marginTop = '';
            });
            this.applyMasonryLayout();
        }
    }

    applyMasonryLayout() {
        // Очищаем предыдущие данные
        this.firstRow = [];
        
        // Получаем первую строку элементов
        for (let i = 0; i < this.countCols && i < this.arrItems.length; i++) {
            this.firstRow.push(this.arrItems[i]);
            this.arrItems[i].dataset.height = `${this.arrItems[i].offsetHeight}`;
        }

        // Применяем masonry эффект для остальных элементов
        for (let i = this.countCols; i < this.arrItems.length; i++) {
            const targetIndex = i - this.countCols;
            const targetHeight = parseFloat(this.arrItems[targetIndex].dataset.height);
            const currentTop = this.arrItems[i].offsetTop;
            
            // Вычисляем разницу в высоте и применяем margin-top
            const marginTop = (targetHeight - currentTop) + this.rowGap;
            this.arrItems[i].style.marginTop = `${marginTop}px`;
            
            // Сохраняем новую высоту с учетом margin
            this.arrItems[i].dataset.height = `${this.arrItems[i].offsetHeight + marginTop}`;
        }
    }

    // Метод для ручного обновления при динамическом изменении содержимого
    update() {
        this.arrItems = Array.from(this.wrap.children);
        this.updateColumnsCount();
    }

    // Очистка при уничтожении
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

