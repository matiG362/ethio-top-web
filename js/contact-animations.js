// Contents for /js/contact-animations.js

document.addEventListener("DOMContentLoaded", () => {
    // This observer will add the 'is-visible' class to elements
    // when they enter the viewport, triggering our CSS animations.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Animate when 10% of the element is visible
    });

    // Find all elements we want to animate and start observing them
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));
});