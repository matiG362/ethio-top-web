// /js/load-header.js
document.addEventListener('DOMContentLoaded', () => {
    // Specify the path to your header.html file.
    // Ensure this path is correct relative to where your HTML pages are served.
    fetch('/html/header.html')
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Get the HTML content as text
        })
        .then(html => {
            // Find the placeholder element in your main HTML
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                // Insert the fetched HTML content into the placeholder
                headerPlaceholder.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Optionally, display a user-friendly error message on the page
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = '<p style="color: red; text-align: center; padding: 10px;">Failed to load header. Please check the file path and server.</p>';
            }
        });
});