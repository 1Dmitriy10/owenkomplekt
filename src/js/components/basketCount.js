export function basketCount() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const input = counter.querySelector('.counter__input');
    const btnMinus = counter.querySelector('.counter__btn--minus');
    const btnPlus = counter.querySelector('.counter__btn--plus');

    if (!input || !btnMinus || !btnPlus) return;

    // Нормализует значение: оставляет только цифры, убирает ведущие нули, возвращает число ≥ 1
    function sanitizeValue(val) {
      const num = parseInt(val.replace(/\D/g, ''), 10);
      return isNaN(num) || num < 1 ? 1 : num;
    }

    // Обновляет поле с валидацией
    function updateInput(value) {
      input.value = String(value);
    }

    // Минимальное значение
    const MIN = 1;

    // Уменьшение
    btnMinus.addEventListener('click', () => {
      const current = sanitizeValue(input.value);
      if (current > MIN) {
        updateInput(current - 1);
      }
    });

    // Увеличение
    btnPlus.addEventListener('click', () => {
      const current = sanitizeValue(input.value);
      updateInput(current + 1);
    });

    // Защита от ручного ввода некорректных данных
    input.addEventListener('input', () => {
      const raw = input.value;
      // Разрешаем только цифры (и пустое поле временно)
      if (/^\d*$/.test(raw)) {
        // Если поле не пустое, нормализуем
        if (raw !== '') {
          const num = parseInt(raw, 10);
          if (isNaN(num) || num < MIN) {
            input.value = String(MIN);
          } else {
            input.value = String(num); // убираем ведущие нули
          }
        }
      } else {
        // Если введено что-то недопустимое — восстанавливаем предыдущее валидное значение
        input.value = input.dataset.lastValid || String(MIN);
      }

      // Сохраняем последнее валидное значение
      input.dataset.lastValid = input.value;
    });

    // Инициализация
    input.dataset.lastValid = String(sanitizeValue(input.value));
    input.value = input.dataset.lastValid;
  });
}

document.addEventListener('DOMContentLoaded', basketCount);