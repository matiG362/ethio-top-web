// js/load-header.js

// This function contains the logic to make the header interactive.
// It will only be called AFTER the header HTML is on the page.
function initializeHeaderScripts() {
    const menuButton = document.querySelector('.menu-button');
    const navigation = document.querySelector('.header-links');

    if (menuButton && navigation) {
        menuButton.addEventListener('click', () => {
            navigation.classList.toggle('nav-open');
        });
    }
}


// This part of the code runs first when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetch('/html/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = html;

                // *** THIS IS THE MAGIC STEP ***
                // Now that the header HTML is on the page, we can run the
                // script that makes it interactive.
                initializeHeaderScripts();
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = '<p style="color: red;">Failed to load header.</p>';
            }
        });
});