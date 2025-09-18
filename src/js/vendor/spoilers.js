export class Spoilers {
    constructor(spoiler) {
        let check = document.querySelectorAll(`.${spoiler.item}`);
        if (check.length > 0) {
            this.spoiler = spoiler;
            this.class = [...document.querySelectorAll(`.${this.spoiler.item}`)];
            this.choice();
        } else {
            return null;
        }
    }

    choice() {
        if (!this.class || !this.class.length) {
            return;
        }

        // Если allOpen: true, открываем все спойлеры
        if (this.spoiler.allOpen) {
            this.openAllSpoilers();
            return; // Прекращаем выполнение, так как все спойлеры должны быть открыты
        }

        // Аналог slideUp() и удаление атрибута open (только если не allOpen)
        document.querySelectorAll(`.${this.spoiler.item}`).forEach(item => {
            const content = item.nextElementSibling;
            if (content && content.classList.contains('spoiler-content')) {
                content.style.display = 'none';
            }
            item.parentElement.removeAttribute('open');
            item.classList.remove('active');
        });

        if (this.spoiler.firstOpen) {
            this.getOpenFirstSpoiler();
        }

        for (const el of this.class) {
            el.addEventListener("click", (event) => {
                if (this.spoiler.accordion) {
                    this.getAccordionSpoiler(event);
                } else {
                    this.getSpoiler(event);
                }
            });
        }
    }

    // Метод для открытия всех спойлеров
    openAllSpoilers() {
        this.class.forEach(item => {
            const parent = item.parentElement;
            const content = item.nextElementSibling;
            
            if (content && content.classList.contains('spoiler-content')) {
                parent.setAttribute("open", '');
                item.classList.add('active');
                content.style.display = 'block';
                content.style.height = 'auto';
                content.style.overflow = '';
                content.style.transition = '';
            }
        });

        // Удаляем обработчики кликов, так как все спойлеры должны оставаться открытыми
        for (const el of this.class) {
            el.removeEventListener("click", this.getSpoiler);
            el.removeEventListener("click", this.getAccordionSpoiler);
            
            // Делаем спойлеры неактивными (некликабельными)
            el.style.cursor = 'default';
            el.style.pointerEvents = 'none';
        }
    }

    getOpenFirstSpoiler() {
        const firstItem = this.class[0];
        firstItem.parentElement.setAttribute("open", '');
        firstItem.classList.add('active');
        const firstContent = firstItem.nextElementSibling;
        if (firstContent && firstContent.classList.contains('spoiler-content')) {
            this.slideDown(firstContent, this.spoiler.timeAnimation);
        }
    }

    getAccordionSpoiler(event) {
        const target = event.currentTarget;
        const parent = target.parentElement;
        const content = target.nextElementSibling;

        if (parent.hasAttribute('open')) {
            event.preventDefault();
            setTimeout(() => {
                parent.removeAttribute('open');
            }, this.spoiler.timeAnimation);
            target.classList.remove('active');
            this.slideUp(content, this.spoiler.timeAnimation);
        } else {
            // Закрываем все спойлеры
            document.querySelectorAll(`.${this.spoiler.item}`).forEach(item => {
                const itemParent = item.parentElement;
                const itemContent = item.nextElementSibling;
                if (itemContent && itemContent.classList.contains('spoiler-content')) {
                    itemParent.removeAttribute('open');
                    item.classList.remove('active');
                    this.slideUp(itemContent, this.spoiler.timeAnimation);
                }
            });

            // Открываем текущий
            this.slideDown(content, this.spoiler.timeAnimation);
            target.classList.add('active');
        }
    }

    getSpoiler(event) {
        const target = event.currentTarget;
        const parent = target.parentElement;
        const content = target.nextElementSibling;

        if (parent.hasAttribute('open')) {
            event.preventDefault();
            target.classList.remove('active');
            this.slideUp(content, this.spoiler.timeAnimation);
            setTimeout(() => {
                parent.removeAttribute('open');
            }, this.spoiler.timeAnimation);
        } else {
            this.slideDown(content, this.spoiler.timeAnimation);
            target.classList.add('active');
        }
    }

    // Анимация slideDown (аналог jQuery)
    slideDown(element, duration) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0';
        element.style.transition = `height ${duration}ms ease`;

        setTimeout(() => {
            element.style.height = `${height}px`;
        }, 10);

        setTimeout(() => {
            element.style.display = 'block';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration + 10);
    }

    // Анимация slideUp (аналог jQuery)
    slideUp(element, duration) {
        const height = element.scrollHeight;
        element.style.overflow = 'hidden';
        element.style.height = `${height}px`;
        element.style.transition = `height ${duration}ms ease`;

        setTimeout(() => {
            element.style.height = '0';
        }, 10);

        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration + 10);
    }
}