// document.addEventListener('DOMContentLoaded', function () {
//     const footerPlaceholder = document.getElementById('footer-placeholder');

//     if (footerPlaceholder) {
//         // Determine the base path correctly for different pages
//         let filePath = '';
//         // If the current page is in 'html' folder (e.g., /html/home.html)
//         if (window.location.pathname.includes('/html/')) {
//             filePath = '../html/footer.html';
//         } else {
//             // If the current page is in root or another structure
//             filePath = './html/footer.html'; // Adjust as per your root path
//         }


//         fetch(filePath)
//             .then(response => {
//                 if (!response.ok) {
//                     // Log the path that failed for debugging
//                     console.error(`Failed to load footer from: ${filePath}. Status: ${response.status}`);
//                     throw new Error('Failed to load footer');
//                 }
//                 return response.text();
//             })
//             .then(html => {
//                 footerPlaceholder.innerHTML = html;
//             })
//             .catch(error => {
//                 console.error('Error loading footer:', error);
//                 footerPlaceholder.innerHTML = '<p>Error loading footer content.</p>';
//             });
//     }
// });



document.addEventListener('DOMContentLoaded', () => {
    // Load footer HTML
    fetch('/html/footer.html') // Make sure this path is correct for your footer HTML
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = html;

                // --- Start: Logic to populate Popular Colors with random selection ---
                const popularColorsDiv = footerPlaceholder.querySelector('.popular-colors');
                if (popularColorsDiv) {
                    // Clear existing placeholder links
                    popularColorsDiv.querySelectorAll('a').forEach(a => a.remove());

                    fetch('/data/catagory-data.json') // Path to your category data
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(categories => {
                            // Ensure the <h2> "Popular Colors" is present
                            let h2 = popularColorsDiv.querySelector('h2');
                            if (!h2) {
                                h2 = document.createElement('h2');
                                h2.textContent = 'Popular Colors';
                                popularColorsDiv.prepend(h2); // Add it at the beginning
                            }

                            // Shuffle the array to get random selection
                            for (let i = categories.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [categories[i], categories[j]] = [categories[j], categories[i]]; // ES6 swap
                            }

                            const displayLimit = 4; // Display exactly 4 random categories

                            // Iterate over the first 'displayLimit' (4) shuffled categories
                            categories.slice(0, displayLimit).forEach(category => {
                                if (category.name) { // Ensure category has a name property
                                    const a = document.createElement('a');
                                    // Set the link to your category content page, encoding the category name
                                    a.href = `/html/category-content.html?category=${encodeURIComponent(category.name)}`;
                                    a.textContent = category.name; // Display the category name
                                    popularColorsDiv.appendChild(a);
                                }
                            });

                            if (categories.length === 0) { // If no categories are loaded
                                const noColorsMessage = document.createElement('p');
                                noColorsMessage.textContent = 'No popular colors available.';
                                noColorsMessage.style.color = '#ccc';
                                noColorsMessage.style.fontSize = '0.9em';
                                popularColorsDiv.appendChild(noColorsMessage);
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching categories for footer:', error);
                            const popularColorsDiv = footerPlaceholder.querySelector('.popular-colors');
                            if (popularColorsDiv) {
                                popularColorsDiv.innerHTML = '<h2>Popular Colors</h2><p style="color: red;">Failed to load colors.</p>';
                            }
                        });
                }
                // --- End: Logic to populate Popular Colors ---
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = '<p style="color: red; text-align: center;">Failed to load footer.</p>';
            }
        });
});