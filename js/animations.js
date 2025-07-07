// Replace everything in animations.js with this code.
// The key change is noted below.

document.addEventListener("DOMContentLoaded", () => {
    // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };

    const handleScrollAnimation = () => {
        // *** KEY CHANGE IS HERE ***
        // This line is now INSIDE the function. It gets a fresh list every time.
        const scrollElements = document.querySelectorAll(".animate-on-scroll");

        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener("scroll", handleScrollAnimation);
    // Trigger once on load for elements already in view
    handleScrollAnimation();


    // --- FAQ ACCORDION LOGIC --- (Remains the same)
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            if (!isActive) {
                item.classList.add('active');
                // answer.style.maxHeight = answer.scrollHeight + "px";
                toggle.classList.add('active');
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = 0;
                toggle.classList.remove('active');
            }
        });
    });

    // --- NUMBER COUNTING ANIMATION --- (Remains the same)
    function animate(obj, initVal, lastVal, duration) {
        let startTime = null;
        const step = (currentTime) => {
            if (!startTime) {
                startTime = currentTime;
            }
            const progress = Math.min((currentTime - startTime) / duration, 1);
            obj.innerHTML = Math.floor(progress * (lastVal - initVal) + initVal) + "+";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (lastVal >= 10000) {
                    obj.innerHTML = (lastVal / 1000) + "k+";
                } else {
                    obj.innerHTML = lastVal + "+";
                }
            }
        };
        window.requestAnimationFrame(step);
    }

    const ctaGrid = document.querySelector('.cta-grid');
    if (ctaGrid) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = document.querySelectorAll('.cta-item-des h3');
                    counters.forEach(counter => {
                        const target = +counter.innerText.replace('+', '');
                        if (!counter.dataset.animated) {
                            animate(counter, 0, target, 1500);
                            counter.dataset.animated = "true";
                        }
                    });
                    observer.unobserve(ctaGrid);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(ctaGrid);
    }
});