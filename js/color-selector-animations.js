// Contents for /js/color-selector-animations.js

document.addEventListener("DOMContentLoaded", () => {
    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // We make this a global function so our other script can call it
    // whenever it adds new elements to the page (like new color swatches).
    window.observeElements = () => {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll:not(.is-visible)');
        elementsToAnimate.forEach(el => observer.observe(el));
    };

    // Run it once on initial page load for static elements
    window.observeElements();
});