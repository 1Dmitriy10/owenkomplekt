export function videoSlider() {
    let videos = document.querySelectorAll('.k-v-atmosphere__cart-img-wrap>video');
    if(!videos) {return null}
    let src = "/images/atmosphere/muteOff.svg";
    let count = 1;
    let ev = {}
    let media = window.matchMedia("(min-width: 768px)");

    if (media.matches) {
// наведение на карточку
        videos.forEach(video => {

            video.addEventListener("mouseenter", playClip)
            video.addEventListener("mouseleave", stopClip)
        })
// замена иконки 
        function playClip(media) {
            if (ev != media.target.parentElement.querySelector(".video-icon-wrap")) {
                src = '/images/atmosphere/muteOff.svg';
            }

            let videoIconWrap = media.target.parentElement.querySelector(".video-icon-wrap");
            ev = videoIconWrap;
            el = videoIconWrap
            videoIconWrap.addEventListener("mouseenter", function () {
                videoIcon.src = src
            })

            videoIconWrap.addEventListener("mouseleave", function () {
                videoIcon.src = src
            })

            if (count > 1) {

            } else {
                videoIconWrap.addEventListener("click", changeMute)
            }


            let videoIcon = media.target.parentElement.querySelector(".video-icon");

            media.target.play();
            videoIcon.src = src

            // videoIcon.addEventListener("click", playSound)
        }

        function changeMute() {
            console.log("ok")
            let wrap = event.target.closest('.video-icon-wrap');
            console.log(wrap)
            if (wrap.classList.contains("stop")) {
                let img = wrap.querySelector(".video-icon")
                src = "/images/atmosphere/muteOn.svg";

                playSound();
                wrap.classList.remove("stop")
                img.src = src

            } else {
                let img = wrap.querySelector(".video-icon")
                src = "/images/atmosphere/muteOff.svg";

                stopSaund();
                wrap.classList.add("stop")
                img.src = src

            }
        }

        function stopClip(media) {
            let videoIconWrap = media.target.parentElement.querySelector(".video-icon-wrap");
            let iconMute = media.target.parentElement.querySelector(".video-icon");

            media.target.pause();
            stopSaund(media)

            iconMute.src = "/images/atmosphere/vide-play.png"


        }

        function playSound(media) {
            let video = event.target.parentElement.parentElement.querySelector("video");

            video.muted = false;
            event.target.src = src
        }

        function stopSaund(media) {
            let video = event.target.parentElement.parentElement.querySelector("video");

            video.muted = true;

        }

    } else {
// На мобилке запуск при активном слайде
        let activeSlide = document.querySelector(".k-v-atmosphere__slider .swiper-slide-active");
         if(!activeSlide) {return null}
        let video = activeSlide.querySelector("video");
        let videoIcons = document.querySelectorAll('.video-icon');
        src = "/images/atmosphere/muteOff.svg"

// Управление звуком через клик и замена иконки
        videoIcons.forEach(el => {
            el.src = src
            el.addEventListener("click", function () {
                let wrap = event.target.closest('.video-icon-wrap');


                if (wrap.classList.contains("stop")) {
                    let img = wrap.querySelector(".video-icon")
                    let video = event.target.parentElement.parentElement.querySelector("video");

                    img.src = "/images/atmosphere/muteOn.svg";
                    video.muted = false;
                    wrap.classList.remove("stop")
                    // img.src = src

                } else {
                    let img = wrap.querySelector(".video-icon");
                    let video = event.target.parentElement.parentElement.querySelector("video");

                    img.src = "/images/atmosphere/muteOff.svg";
                    video.muted = true;
                    wrap.classList.add("stop")
                    // img.src = src

                }
            })
        })

        if (video) {
            video.play();
        }

        sliderAtmosphere.on("slideChange", (ev) => {
            let videos = document.querySelectorAll(".k-v-atmosphere__slider video");
            videos.forEach(el => {
                el.pause();
            })
            setTimeout(function () {
                let activeSlide = document.querySelector(".k-v-atmosphere__slider .swiper-slide-active");
                let video = activeSlide.querySelector("video");

                if (video) {
                    video.play();
                }
            }, 100)
        })
    }
};
videoSlider();