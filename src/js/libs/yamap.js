/*
<script src="https://api-maps.yandex.ru/2.0-stable/?load=package.standard&lang=ru-RU"></script>
подключить ключ разработчика
*/
export function getYaMap() {
    ymaps.ready(init);
    var myMap,
        myPlacemark;

    function init() {
        // ---Создает карту------
        myMap = new ymaps.Map("map", {
            center: [55.646569, 37.670339],
            zoom: 16,
        });

        // ---регистрация метки------- 
        myPlacemark = new ymaps.Placemark([55.646569, 37.670339], { hintContent: "ООО «Услуги для бизнеса»", balloonContent: "ООО «Услуги для бизнеса»" });

        // ---Добавление метки на карту------- 
        myMap.geoObjects.add(myPlacemark);

        myMap.controls
            // Кнопка изменения масштаба.
            .add('zoomControl', { left: 5, top: 5 })

            // Список типов карты
            .add('typeSelector')
            // Стандартный набор кнопок
            .add('mapTools', { left: 35, top: 5 })


    }
};
getYaMap();