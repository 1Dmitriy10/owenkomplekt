export function hiddenStickyBlock() {
      // Настройки (можно менять под свои нужды)
    const STICKY_SELECTOR = '.basket-sticky-block'; // Селектор прилипающего блока
    const TARGET_ID = 'aside-block-basket';       // ID целевого блока
    const HIDE_CLASS = 'hidden';      // Класс для скрытия
    const OFFSET = 20;                       // Отступ в пикселях

    // Получаем элементы
    const stickyElement = document.querySelector(STICKY_SELECTOR);
    const targetElement = document.getElementById(TARGET_ID);

    // Проверяем наличие элементов
    if (!stickyElement || !targetElement) return;

    // Основная функция проверки позиции
    const checkStickyPosition = () => {
        // Получаем координаты элементов
        const stickyRect = stickyElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        // Вычисляем позицию, когда нужно скрывать
        const shouldHide = stickyRect.bottom + OFFSET >= targetRect.top;
        
        // Добавляем/удаляем класс
        stickyElement.classList.toggle(HIDE_CLASS, shouldHide);
    };

    // Оптимизация производительности
    let isTicking = false;
    const updateOnScroll = () => {
        if (!isTicking) {
            requestAnimationFrame(() => {
                checkStickyPosition();
                isTicking = false;
            });
            isTicking = true;
        }
    };

    // Слушаем события
    window.addEventListener('scroll', updateOnScroll);
    window.addEventListener('resize', updateOnScroll);
};
hiddenStickyBlock()