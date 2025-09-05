export function preloader() {
    function loadData() {
        return new Promise((resolve, reject) => {
            // setTimeout не является частью решения
            // Код ниже должен быть заменен на логику подходящую для решения вашей задачи
            setTimeout(resolve, 2200);
        })
    }

    loadData()
        .then(() => {
            let preloaderEl = document.getElementById('preloader');
            if(!preloaderEl) {return null}
            preloaderEl.classList.add('hidden');
            preloaderEl.classList.remove('visible');
        });

};
preloader();