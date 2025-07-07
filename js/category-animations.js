// Contents for /js/category-animations.js

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Make this function globally accessible so our other script can call it
    // every time it renders new product cards.
    window.observeProductCards = () => {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll:not(.is-visible)');
        elementsToAnimate.forEach(el => observer.observe(el));
    };

    // Run it once on initial page load
    window.observeProductCards();
});