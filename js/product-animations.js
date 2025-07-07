// Contents for /js/product-animations.js

document.addEventListener("DOMContentLoaded", () => {
    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the .is-visible class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                // Optional: Stop observing the element after it has animated in
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // This function will find all elements to animate and start observing them.
    // We can call this function whenever new content is added to the page.
    window.observeElements = () => {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll:not(.is-visible)');
        elementsToAnimate.forEach(el => observer.observe(el));
    };

    // Run it once on initial page load
    window.observeElements();
});