export class BurgerMenu {
    constructor(menu) {
        if (!document.querySelector(".mob-nav")) return null;

        this.mediaShow = menu.mediaShow || '';
        this.openBtn = menu.openBtn;
        this.closeBtn = menu.closeBtn || menu.openBtn;
        this.menuAnimationTime = menu.menuAnimationTime || 0.5;
        this.spoilersAnimationTime = menu.spoilersAnimationTime || 0.3;
        this.spoilersAccordion = menu.spoilersAccordion || false;
        this.openingSide = menu.openingSide || "horizontal";
        this.arrowIcon = menu.arrowIcon;
        this.menu = document.querySelector(".mob-nav");

        this.init();
    }

    init() {
        this.setEvents();
        this.getIconForSpoilers();
        this.setTimeAnimations();
        this.getSpoilersMenu();
        this.showMenu();
    }

    setEvents() {
        const openBtn = document.querySelector(`${this.openBtn}`);
        const closeBtn = document.querySelector(`${this.closeBtn}`);

        if (closeBtn.className === openBtn.className) {
            openBtn.addEventListener("click", () => this.toggleMenu(openBtn));
        } else {
            openBtn.addEventListener("click", () => this.openMenu(openBtn));
            closeBtn.addEventListener("click", () => this.closeMenu());
        }
    }

    openMenu(openBtn) {
        this.menu.classList.add("active");
        openBtn.style.zIndex = '0';
    }

    closeMenu() {
        this.menu.classList.remove("active");
    }

    toggleMenu(openBtn) {
        openBtn.style.zIndex = '101';
        openBtn.classList.toggle("active");
        this.menu.classList.toggle("active");
    }

    getIconForSpoilers() {
        document.querySelectorAll(".mob-nav-item").forEach(el => {
            if (el.querySelector(".spoiler-content-menu")) {
                el.insertAdjacentHTML("beforeend", this.renderArrow());
            }
        });
    }

    renderArrow() {
        return `<btn class='_spoiler-js-menu'>${this.arrowIcon}</btn>`;
    }

    setTimeAnimations() {
        this.menu.style.transition = `${this.menuAnimationTime}s`;
        this.setOpeningSide();
    }

    setOpeningSide() {
        this.menu.classList.add(this.openingSide === "horizontal" ? "horizontal" : "vertical");
    }

    getSpoilersMenu() {
        const timeAnimation = this.spoilersAnimationTime * 1000;
        const spoilers = document.querySelectorAll('._spoiler-js-menu');

        document.querySelectorAll('.spoiler-content-menu').forEach(content => {
            this.slideUp(content, timeAnimation);
        });

        spoilers.forEach(spoiler => {
            spoiler.addEventListener('click', () => {
                const content = spoiler.parentElement.querySelector(".spoiler-content-menu");
                
                if (this.spoilersAccordion) {
                    this.handleAccordion(spoiler, content, timeAnimation);
                } else {
                    this.handleDefault(spoiler, content, timeAnimation);
                }
            });
        });
    }

    handleAccordion(spoiler, content, timeAnimation) {
        const isActive = spoiler.classList.contains('active');
        
        document.querySelectorAll('.spoiler-content-menu').forEach(item => {
            this.slideUp(item, timeAnimation);
            if (isActive) item.style.display = 'none';
        });
        
        document.querySelectorAll('._spoiler-js-menu').forEach(item => {
            item.classList.remove('active');
        });
        
        if (!isActive) {
            this.slideDown(content, timeAnimation);
            spoiler.classList.add('active');
        }
    }

    handleDefault(spoiler, content, timeAnimation) {
        if (spoiler.classList.contains('active')) {
            spoiler.classList.remove('active');
            this.slideUp(content, timeAnimation);
        } else {
            this.slideDown(content, timeAnimation);
            spoiler.classList.add('active');
        }
    }

    slideUp(element, duration) {
        const height = element.scrollHeight;
        element.style.cssText = `
            overflow: hidden;
            height: ${height}px;
            transition: height ${duration}ms ease;
        `;

        setTimeout(() => {
            element.style.height = '0';
        }, 10);

        setTimeout(() => {
            element.style.cssText = 'display: none';
        }, duration + 10);
    }

    slideDown(element, duration) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.cssText = `
            overflow: hidden;
            height: 0;
            transition: height ${duration}ms ease;
        `;

        setTimeout(() => {
            element.style.height = `${height}px`;
        }, 10);

        setTimeout(() => {
            element.style.cssText = 'display: block';
        }, duration + 10);
    }

    showMenu() {
        if (!this.mediaShow) return;

        const checkVisibility = () => {
            const btn = document.querySelector(`${this.openBtn}`);
            btn?.classList.toggle("show", window.matchMedia(`(max-width: ${this.mediaShow})`).matches);
        };

        checkVisibility();
        window.addEventListener('resize', checkVisibility);
    }
}

