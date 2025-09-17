/*
<div class="filter-container">
    <h3>Ток Ном, А</h3>
    <div class="range-inputs">
        <input type="number" data-id="minValue" placeholder="От 3" value="3" min="3" max="170">
        <span>—</span>
        <input type="number" data-id="maxValue" placeholder="До 170" value="170" min="3" max="170">
    </div>
    <div class="slider-container">
        <div class="slider-track" style="width: 0%"></div>
        <div class="slider-handle" data-handle="min" style="left: 0%;"></div>
        <div class="slider-handle" data-handle="max" style="left: 100%;"></div>
    </div>
</div>
*/

export function filter() {
    const filterContainers = document.querySelectorAll('.filter-container');

    filterContainers.forEach(container => {
        const minValueInput = container.querySelector('[data-id="minValue"]');
        const maxValueInput = container.querySelector('[data-id="maxValue"]');
        const sliderContainer = container.querySelector('.slider-container');
        const sliderTrack = sliderContainer.querySelector('.slider-track');
        const minHandle = sliderContainer.querySelector('[data-handle="min"]');
        const maxHandle = sliderContainer.querySelector('[data-handle="max"]');

        // Безопасное получение значений диапазона
        const rangeMin = parseFloat(minValueInput.getAttribute('min')) || 3;
        const rangeMax = parseFloat(maxValueInput.getAttribute('max')) || 170;

        // Устанавливаем начальные значения, если они не установлены
        if (!minValueInput.value || isNaN(parseFloat(minValueInput.value))) {
            minValueInput.value = rangeMin;
        }
        if (!maxValueInput.value || isNaN(parseFloat(maxValueInput.value))) {
            maxValueInput.value = rangeMax;
        }

        let activeHandle = null;

        // Инициализация
        updateSlider();

        // Безопасная функция для парсинга чисел
        function safeParseFloat(value, defaultValue) {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? defaultValue : parsed;
        }

        // События для input полей
        minValueInput.addEventListener('input', updateFromInput);
        maxValueInput.addEventListener('input', updateFromInput);
        minValueInput.addEventListener('blur', validateInputs);
        maxValueInput.addEventListener('blur', validateInputs);

        function validateInputs() {
            let minVal = safeParseFloat(minValueInput.value, rangeMin);
            let maxVal = safeParseFloat(maxValueInput.value, rangeMax);

            // Валидация значений
            minVal = Math.max(rangeMin, Math.min(rangeMax, minVal));
            maxVal = Math.max(rangeMin, Math.min(rangeMax, maxVal));

            // Убеждаемся, что min <= max
            if (minVal > maxVal) {
                if (this === minValueInput) {
                    minVal = maxVal;
                } else {
                    maxVal = minVal;
                }
            }

            minValueInput.value = minVal;
            maxValueInput.value = maxVal;

            updateSlider();
        }

        function updateFromInput() {
            validateInputs();
        }

        function updateSlider() {
            const minVal = safeParseFloat(minValueInput.value, rangeMin);
            const maxVal = safeParseFloat(maxValueInput.value, rangeMax);

            const minPos = ((minVal - rangeMin) / (rangeMax - rangeMin)) * 100;
            const maxPos = ((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100;

            minHandle.style.left = `${minPos}%`;
            maxHandle.style.left = `${maxPos}%`;

            sliderTrack.style.width = `${maxPos - minPos}%`;
            sliderTrack.style.left = `${minPos}%`;
        }

        // Функция для обработки Pointer Events
        function handlePointerDown(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const handle = e.target;
            activeHandle = handle.dataset.handle;
            
            handle.setPointerCapture(e.pointerId);
            handle.classList.add('active');
            
            // Добавляем обработчики
            handle.addEventListener('pointermove', handlePointerMove);
            handle.addEventListener('pointerup', handlePointerUp);
            handle.addEventListener('pointercancel', handlePointerUp);
            
            // Обновляем позицию сразу при нажатии
            updateHandlePosition(e);
        }

        function handlePointerMove(e) {
            if (!activeHandle) return;
            e.preventDefault();
            updateHandlePosition(e);
        }

        function handlePointerUp(e) {
            if (!activeHandle) return;
            
            const handle = e.target;
            handle.classList.remove('active');
            handle.releasePointerCapture(e.pointerId);
            
            // Убираем обработчики
            handle.removeEventListener('pointermove', handlePointerMove);
            handle.removeEventListener('pointerup', handlePointerUp);
            handle.removeEventListener('pointercancel', handlePointerUp);
            
            activeHandle = null;
        }

        function updateHandlePosition(e) {
            const rect = sliderContainer.getBoundingClientRect();
            let clientX = e.clientX;
            
            // Для touch событий
            if (e.touches && e.touches[0]) {
                clientX = e.touches[0].clientX;
            }
            
            const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const value = rangeMin + (percent / 100) * (rangeMax - rangeMin);
            const roundedValue = parseFloat(value.toFixed(2));

            if (activeHandle === 'min') {
                const maxVal = safeParseFloat(maxValueInput.value, rangeMax);
                const newValue = Math.max(rangeMin, Math.min(maxVal, roundedValue));
                minValueInput.value = newValue;
            } else {
                const minVal = safeParseFloat(minValueInput.value, rangeMin);
                const newValue = Math.min(rangeMax, Math.max(minVal, roundedValue));
                maxValueInput.value = newValue;
            }

            updateSlider();
        }

        // Добавляем обработчики Pointer Events
        minHandle.addEventListener('pointerdown', handlePointerDown);
        maxHandle.addEventListener('pointerdown', handlePointerDown);

        // Fallback для браузеров без поддержки Pointer Events
        if (!('PointerEvent' in window)) {
            // Mouse events
            function handleMouseDown(e, handleType) {
                e.preventDefault();
                activeHandle = handleType;
                const handle = handleType === 'min' ? minHandle : maxHandle;
                handle.classList.add('active');
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                updateHandlePosition(e);
            }

            function handleMouseMove(e) {
                if (!activeHandle) return;
                e.preventDefault();
                updateHandlePosition(e);
            }

            function handleMouseUp() {
                if (activeHandle === 'min') minHandle.classList.remove('active');
                if (activeHandle === 'max') maxHandle.classList.remove('active');
                activeHandle = null;
                
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }

            minHandle.addEventListener('mousedown', (e) => handleMouseDown(e, 'min'));
            maxHandle.addEventListener('mousedown', (e) => handleMouseDown(e, 'max'));

            // Touch events
            function handleTouchStart(e, handleType) {
                e.preventDefault();
                activeHandle = handleType;
                const handle = handleType === 'min' ? minHandle : maxHandle;
                handle.classList.add('active');
                updateHandlePosition(e);
            }

            document.addEventListener('touchmove', (e) => {
                if (!activeHandle) return;
                e.preventDefault();
                updateHandlePosition(e);
            }, { passive: false });

            document.addEventListener('touchend', () => {
                if (activeHandle === 'min') minHandle.classList.remove('active');
                if (activeHandle === 'max') maxHandle.classList.remove('active');
                activeHandle = null;
            });

            minHandle.addEventListener('touchstart', (e) => handleTouchStart(e, 'min'), { passive: false });
            maxHandle.addEventListener('touchstart', (e) => handleTouchStart(e, 'max'), { passive: false });
        }

        // Обработчик клика по слайдеру
        sliderContainer.addEventListener('click', (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
            if (!clientX) return;

            const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const value = rangeMin + (percent / 100) * (rangeMax - rangeMin);
            const roundedValue = parseFloat(value.toFixed(2));

            const minVal = safeParseFloat(minValueInput.value, rangeMin);
            const maxVal = safeParseFloat(maxValueInput.value, rangeMax);

            const minPos = ((minVal - rangeMin) / (rangeMax - rangeMin)) * 100;
            const maxPos = ((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100;

            if (Math.abs(percent - minPos) < Math.abs(percent - maxPos)) {
                minValueInput.value = Math.max(rangeMin, Math.min(roundedValue, maxVal));
            } else {
                maxValueInput.value = Math.min(rangeMax, Math.max(roundedValue, minVal));
            }

            updateSlider();
        });

        // Обработчик для предотвращения ввода нечисловых значений
        minValueInput.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key) && e.key !== '.' && e.key !== '-') {
                e.preventDefault();
            }
        });

        maxValueInput.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key) && e.key !== '.' && e.key !== '-') {
                e.preventDefault();
            }
        });
    });
}

// Запускаем после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', filter);
} else {
    filter();
}