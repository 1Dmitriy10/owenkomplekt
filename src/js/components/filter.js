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

        const rangeMin = parseFloat(minValueInput.min || minValueInput.getAttribute('min')) || 0;
        const rangeMax = parseFloat(maxValueInput.max || maxValueInput.getAttribute('max')) || 100;

        // Переменные для отслеживания состояния перетаскивания
        let isDragging = false;
        let currentHandle = null;
        let startX = 0;
        let startLeft = 0;

        // Инициализация
        updateSlider();

        // Обработчики для полей ввода
        minValueInput.addEventListener('change', updateFromInput);
        maxValueInput.addEventListener('change', updateFromInput);

        function updateFromInput() {
            const minVal = Math.max(rangeMin, Math.min(rangeMax, parseFloat(minValueInput.value) || rangeMin));
            const maxVal = Math.max(rangeMin, Math.min(rangeMax, parseFloat(maxValueInput.value) || rangeMax));
            
            // Убедимся, что min <= max
            if (minVal > maxVal) {
                if (this === minValueInput) {
                    minValueInput.value = maxVal;
                } else {
                    maxValueInput.value = minVal;
                }
            } else {
                minValueInput.value = minVal;
                maxValueInput.value = maxVal;
            }
            
            updateSlider();
        }

        function updateSlider() {
            const minVal = parseFloat(minValueInput.value);
            const maxVal = parseFloat(maxValueInput.value);

            const minPos = ((minVal - rangeMin) / (rangeMax - rangeMin)) * 100;
            const maxPos = ((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100;

            minHandle.style.left = `${minPos}%`;
            maxHandle.style.left = `${maxPos}%`;

            sliderTrack.style.width = `${maxPos - minPos}%`;
            sliderTrack.style.left = `${minPos}%`;
        }

        // Обработчики для мыши
        minHandle.addEventListener('mousedown', (e) => startDrag(e, 'min'));
        maxHandle.addEventListener('mousedown', (e) => startDrag(e, 'max'));
        
        // Обработчики для touch
        minHandle.addEventListener('touchstart', (e) => startDrag(e, 'min'), { passive: false });
        maxHandle.addEventListener('touchstart', (e) => startDrag(e, 'max'), { passive: false });

        function startDrag(e, handle) {
            e.preventDefault();
            e.stopPropagation();
            
            isDragging = true;
            currentHandle = handle;
            
            // Получаем начальные координаты
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
            } else {
                startX = e.clientX;
            }
            
            // Сохраняем начальную позицию ползунка
            const handleElement = handle === 'min' ? minHandle : maxHandle;
            startLeft = parseFloat(handleElement.style.left) || 0;
            
            // Добавляем активный класс
            handleElement.classList.add('active');
            
            // Добавляем обработчики событий
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('touchmove', handleDrag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            document.addEventListener('touchcancel', stopDrag);
        }

        function handleDrag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const rect = sliderContainer.getBoundingClientRect();
            let clientX;
            
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            // Вычисляем новую позицию в процентах
            let percent = ((clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent)); // Ограничиваем 0-100%
            
            // Обновляем значение соответствующего поля ввода
            const value = rangeMin + (percent / 100) * (rangeMax - rangeMin);
            const roundedValue = parseFloat(value.toFixed(2));
            
            if (currentHandle === 'min') {
                const maxVal = parseFloat(maxValueInput.value);
                if (roundedValue <= maxVal) {
                    minValueInput.value = roundedValue;
                }
            } else {
                const minVal = parseFloat(minValueInput.value);
                if (roundedValue >= minVal) {
                    maxValueInput.value = roundedValue;
                }
            }
            
            updateSlider();
        }

        function stopDrag() {
            if (isDragging) {
                isDragging = false;
                
                // Убираем активный класс
                minHandle.classList.remove('active');
                maxHandle.classList.remove('active');
                
                // Убираем обработчики событий
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('touchmove', handleDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
                document.removeEventListener('touchcancel', stopDrag);
            }
        }

        // Обработчик клика по слайдеру для быстрого перемещения
        sliderContainer.addEventListener('click', (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            let clientX;
            
            if (e.type === 'touchstart' || e.type === 'click') {
                clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            }
            
            const percent = ((clientX - rect.left) / rect.width) * 100;
            const value = rangeMin + (percent / 100) * (rangeMax - rangeMin);
            const roundedValue = parseFloat(value.toFixed(2));
            
            const minVal = parseFloat(minValueInput.value);
            const maxVal = parseFloat(maxValueInput.value);
            
            // Определяем, к какому ползунку ближе клик
            const minDistance = Math.abs(percent - ((minVal - rangeMin) / (rangeMax - rangeMin)) * 100);
            const maxDistance = Math.abs(percent - ((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100);
            
            if (minDistance < maxDistance) {
                minValueInput.value = Math.min(roundedValue, maxVal);
            } else {
                maxValueInput.value = Math.max(roundedValue, minVal);
            }
            
            updateSlider();
        });
    });
}

filter();