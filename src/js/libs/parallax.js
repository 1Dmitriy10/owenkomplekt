import simpleParallax from 'simple-parallax-js';
export function parallax() {
    let image = document.querySelector('.thumbnail');
    new simpleParallax(image, {
        orientation: 'right'
    });
}
parallax()