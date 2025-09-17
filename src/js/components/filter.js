export function filter() {
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
// Находим все контейнеры фильтров
  const filterContainers = document.querySelectorAll('.filter-container');

  filterContainers.forEach(container => {
    // Ищем элементы внутри текущего контейнера
    const minValueInput = container.querySelector('[data-id="minValue"]');
    const maxValueInput = container.querySelector('[data-id="maxValue"]');
    const sliderContainer = container.querySelector('.slider-container');
    const sliderTrack = sliderContainer.querySelector('.slider-track');
    const minHandle = sliderContainer.querySelector('[data-handle="min"]');
    const maxHandle = sliderContainer.querySelector('[data-handle="max"]');

    // 🎯 Динамически определяем диапазон из атрибутов
    const rangeMin = parseFloat(minValueInput.min || minValueInput.getAttribute('min')) || 0;
    const rangeMax = parseFloat(maxValueInput.max || maxValueInput.getAttribute('max')) || 100;

    // Установим начальные позиции
    updateSlider();

    // Обновляем слайдер при изменении полей ввода
    minValueInput.addEventListener('change', function () {
      const val = parseFloat(this.value);
      const maxVal = parseFloat(maxValueInput.value);
      if (!isNaN(val) && val <= maxVal) {
        minHandle.style.left = `${((val - rangeMin) / (rangeMax - rangeMin)) * 100}%`;
        updateTrack();
      }
    });

    maxValueInput.addEventListener('change', function () {
      const val = parseFloat(this.value);
      const minVal = parseFloat(minValueInput.value);
      if (!isNaN(val) && val >= minVal) {
        maxHandle.style.left = `${((val - rangeMin) / (rangeMax - rangeMin)) * 100}%`;
        updateTrack();
      }
    });

    // Функция обновления отображения
    function updateSlider() {
      const minVal = parseFloat(minValueInput.value);
      const maxVal = parseFloat(maxValueInput.value);

      minHandle.style.left = `${((minVal - rangeMin) / (rangeMax - rangeMin)) * 100}%`;
      maxHandle.style.left = `${((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100}%`;

      updateTrack();
    }

    function updateTrack() {
      const minVal = parseFloat(minValueInput.value);
      const maxVal = parseFloat(maxValueInput.value);

      const minPos = ((minVal - rangeMin) / (rangeMax - rangeMin)) * 100;
      const maxPos = ((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100;

      sliderTrack.style.width = `${maxPos - minPos}%`;
      sliderTrack.style.left = `${minPos}%`;
    }

    // Перетаскивание ручек
    let isDragging = false;
    let currentHandle = null;

    function startDrag(e) {
      const handle = e.target.closest('.slider-handle');
      if (!handle) return;

      isDragging = true;
      currentHandle = handle.dataset.handle;
      handle.classList.add('active');

      const rect = sliderContainer.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      updateHandlePosition(percent);
    }

    function updateHandlePosition(percent) {
      // 🔁 Динамическое преобразование процента → значение
      let value = rangeMin + (percent / 100) * (rangeMax - rangeMin);
      value = parseFloat(value.toFixed(2)); // Округляем до 2 знаков

      // 🚦 Ограничиваем значение в рамках [rangeMin, rangeMax]
      value = Math.max(rangeMin, Math.min(rangeMax, value));

      const minVal = parseFloat(minValueInput.value);
      const maxVal = parseFloat(maxValueInput.value);

      if (currentHandle === 'min') {
        if (value >= maxVal) {
          value = maxVal - (rangeMax - rangeMin) * 0.01;
          if (value < rangeMin) value = rangeMin;
        }
        minValueInput.value = value;
      } else if (currentHandle === 'max') {
        if (value <= minVal) {
          value = minVal + (rangeMax - rangeMin) * 0.01;
          if (value > rangeMax) value = rangeMax;
        }
        maxValueInput.value = value;
      }

      updateSlider();
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false;
        currentHandle = null;
        sliderContainer.querySelectorAll('.slider-handle').forEach(h => h.classList.remove('active'));
      }
    }

    function moveHandler(e) {
      if (isDragging) {
        const rect = sliderContainer.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        updateHandlePosition(percent);
      }
    }

// 🖱️ Поддержка мыши
sliderContainer.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', moveHandler);
document.addEventListener('mouseup', stopDrag);

// 👆 Поддержка тач-устройств
sliderContainer.addEventListener('touchstart', function(e) {
  e.preventDefault(); // важно: иначе будет скролл вместо перетаскивания
  const touch = e.touches[0];
  const fakeMouseEvent = {
    clientX: touch.clientX,
    target: e.target
  };
  startDrag(fakeMouseEvent);
});

document.addEventListener('touchmove', function(e) {
  if (isDragging) {
    e.preventDefault(); // блокируем скролл во время перетаскивания
    const touch = e.touches[0];
    const fakeMouseEvent = { clientX: touch.clientX };
    moveHandler(fakeMouseEvent);
  }
});

document.addEventListener('touchend', stopDrag);

document.addEventListener('touchmove', function(e) {
  if (isDragging) {
    e.preventDefault(); // предотвращаем скролл во время перетаскивания
    const touch = e.touches[0];
    const fakeMouseEvent = { clientX: touch.clientX };
    moveHandler(fakeMouseEvent);
  }
});

document.addEventListener('touchend', function(e) {
  stopDrag();
});

    // Также можно кликнуть по слайдеру
    sliderContainer.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      let percent = ((e.clientX - rect.left) / rect.width) * 100;
      let val = rangeMin + (percent / 100) * (rangeMax - rangeMin);
      val = parseFloat(val.toFixed(2));
      val = Math.max(rangeMin, Math.min(rangeMax, val)); // 🚦 Ограничение

      const minVal = parseFloat(minValueInput.value);
      const maxVal = parseFloat(maxValueInput.value);

      const minPercent = ((minVal - rangeMin) / (rangeMax - rangeMin)) * 100;
      const maxPercent = ((maxVal - rangeMin) / (rangeMax - rangeMin)) * 100;

      // Если клик ближе к левому ползунку — двигаем его
      if (percent < minPercent + 5) {
        minValueInput.value = val;
      }
      // Если клик ближе к правому ползунку — двигаем его
      else if (percent > maxPercent - 5) {
        maxValueInput.value = val;
      } else {
        return;
      }

      updateSlider();
    });

    // Инициализация позиций
    updateSlider();
  });


}
filter();