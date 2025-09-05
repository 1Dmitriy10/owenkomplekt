export function setTitlePopupForm() {
		let body = document.querySelector("body");
		body.addEventListener("click", searchBtn)

		function searchBtn() {
			let data = event.target.dataset.src;
			let el = event.target
			if (data && data == "#popup-form") {
				updateTitle(el.dataset.title, data)
			}
		}

		function updateTitle(text, id) {
			let form = document.querySelector(`${id}`);
			let title = form.querySelector(".main-form__title");
			if (!text) {
				title.innerHTML = `Запишись на бесплатную консультацию`;
			} else {
				title.innerHTML = `${text}`;
			}

		}
	};
	setTitlePopupForm();