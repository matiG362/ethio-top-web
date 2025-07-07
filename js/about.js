// $(document).ready(function () {
//     $('.menu-button').click(function () {
//         $('.header-links').toggleClass('active');
//     });
// });


$(document).ready(function () {
    $('.menu-button').click(function () {
        $('nav.header-links').toggleClass('active');
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Find all elements to animate and observe them
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));


    // --- NUMBER COUNTING ANIMATION FOR EXPERIENCE BADGE ---
    const experienceBadge = document.querySelector('.experience-badge');
    if (experienceBadge) {
        const numberCounter = experienceBadge.querySelector('.experience-years');

        const animateCount = (obj, start, end, duration) => {
            let startTime = null;
            const step = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start) + "+";
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.innerHTML = end + "+";
                }
            };
            window.requestAnimationFrame(step);
        };

        // Observer for the number counter
        const badgeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!numberCounter.dataset.animated) {
                        animateCount(numberCounter, 0, 5, 1500);
                        numberCounter.dataset.animated = "true"; // Prevents re-animating
                    }
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, { threshold: 0.8 }); // Trigger when 80% of the badge is visible

        badgeObserver.observe(experienceBadge);
    }
});