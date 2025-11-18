export function addRadioButtonOrder() {
  const tabs = document.querySelectorAll('.tabs__title');
  
  // Если элементов нет — выходим
  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Обработчик клика
  const handleClick = (clickedTab) => {
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    clickedTab.classList.add('active');
  };

  // Навешиваем обработчики
  tabs.forEach(tab => {
    tab.addEventListener('click', () => handleClick(tab));
  });
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addRadioButtonOrder);
} else {
  // DOM уже загружен
  addRadioButtonOrder();
}