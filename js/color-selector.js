document.addEventListener('DOMContentLoaded', () => {
    const listCategoryDiv = document.querySelector('.list-category');
    const colorsDiv = document.querySelector('.colors');
    const style = document.createElement('style'); // For dynamic color background rules
    document.head.appendChild(style);
    const productImageDiv = document.querySelector('.product-image');

    // --- Pagination Elements ---
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-controls'; // Styles defined in color-selector.css

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&larr; Previous'; // Left arrow HTML entity
    prevButton.className = 'pagination-button prev-button'; // Styles defined in color-selector.css
    // Set initial display for the button itself
    prevButton.style.display = 'none';

    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next &rarr;'; // Right arrow HTML entity
    nextButton.className = 'pagination-button next-button'; // Styles defined in color-selector.css
    // Set initial display for the button itself
    nextButton.style.display = 'none';

    // Create the two wrapper divs
    const prevButtonDiv = document.createElement('div');
    prevButtonDiv.className = 'pagination-button-wrapper';

    const nextButtonDiv = document.createElement('div');
    nextButtonDiv.className = 'pagination-button-wrapper';


    // Append pagination controls to the parent of listCategoryDiv
    if (listCategoryDiv && listCategoryDiv.parentNode) {
        listCategoryDiv.parentNode.insertBefore(paginationContainer, listCategoryDiv.nextSibling);
    } else {
        document.body.appendChild(paginationContainer);
    }

    // Append buttons to their new wrapper divs
    prevButtonDiv.appendChild(prevButton);
    nextButtonDiv.appendChild(nextButton);

    // Append the wrapper divs to the pagination container
    paginationContainer.appendChild(prevButtonDiv);
    paginationContainer.appendChild(nextButtonDiv);
    // --- End Pagination Elements ---

    let allCategoryKeys = []; // To store all keys for pagination
    let currentIndex = 0; // Current starting index for displayed categories
    const itemsPerPage = 6; // Number of items to display per page
    let previousActiveColorBox = null; // Store the previously clicked color box


    fetch('../color-selector/color-selector.json') // Make sure this path is correct
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            allCategoryKeys = Object.keys(jsonData); // Populate allCategoryKeys

            // Initial display of categories and colors
            displayCategories(jsonData, currentIndex);
            updatePaginationButtons(); // Set initial button visibility

            // Event listeners for pagination buttons
            nextButton.addEventListener('click', () => {
                if (currentIndex + itemsPerPage < allCategoryKeys.length) {
                    currentIndex += itemsPerPage;
                    displayCategories(jsonData, currentIndex);
                    updatePaginationButtons();
                }
            });

            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex -= itemsPerPage;
                    displayCategories(jsonData, currentIndex);
                    updatePaginationButtons();
                }
            });


            /**
             * Displays a subset of categories based on the startIndex.
             * @param {object} jsonData The full JSON data.
             * @param {number} startIndex The starting index for displaying categories.
             */
            function displayCategories(jsonData, startIndex) {
                listCategoryDiv.innerHTML = ''; // Clear existing categories

                const endIndex = Math.min(startIndex + itemsPerPage, allCategoryKeys.length);
                const categoriesToDisplay = allCategoryKeys.slice(startIndex, endIndex);

                // Clear any previously active category styling
                document.querySelectorAll('.category-item.active').forEach(item => {
                    item.classList.remove('active');
                });

                // Display categories and set click handlers
                categoriesToDisplay.forEach((key, index) => {
                    const div = document.createElement('div');
                    div.textContent = key;
                    div.classList.add('category-item'); // Class for styling category items

                    // If it's the first item on the current page, set it as active and display its colors
                    if (index === 0) {
                        div.classList.add('active');
                        displayColors(jsonData, key);
                        productImageDiv.style.backgroundColor = 'white'; // Reset product image background
                        previousActiveColorBox = null; // Clear any previous active color box from color palette
                    }

                    div.addEventListener('click', () => {
                        // Remove active class from all categories
                        document.querySelectorAll('.category-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        // Add active class to the clicked category
                        div.classList.add('active');

                        displayColors(jsonData, key);
                        productImageDiv.style.backgroundColor = 'white'; // Reset product image background
                        previousActiveColorBox = null; // Clear previous active color box
                    });
                    listCategoryDiv.appendChild(div);
                });

                // If no categories are displayed (e.g., empty JSON), show a message
                if (categoriesToDisplay.length === 0) {
                    colorsDiv.innerHTML = '<p class="no-categories-message">No categories to display.</p>';
                }
            }

            /**
             * Updates the visibility of the previous and next pagination buttons.
             */
            function updatePaginationButtons() {
                // Show/hide Previous button (directly on the button)
                if (currentIndex > 0) {
                    prevButton.style.display = 'inline-block';
                } else {
                    prevButton.style.display = 'none';
                }

                // Show/hide Next button (directly on the button)
                if (currentIndex + itemsPerPage < allCategoryKeys.length) {
                    nextButton.style.display = 'inline-block';
                } else {
                    nextButton.style.display = 'none';
                }
            }

            /**
             * Displays colors for a specific group (category).
             * @param {object} jsonData The full JSON data.
             * @param {string} groupKey The key of the group whose colors should be displayed.
             */
            function displayColors(jsonData, groupKey) {
                colorsDiv.innerHTML = ''; // Clear existing colors
                style.innerHTML = ''; // Clear existing dynamic CSS rules (important to prevent rule buildup)
                const colorData = jsonData[groupKey];
                console.log(`Displaying colors for group: ${groupKey}`);

                // Check if colorData is null or undefined or empty or contains only null values
                if (!colorData || Object.keys(colorData).length === 0 || Object.values(colorData).every(val => val === null)) {
                    colorsDiv.innerHTML = '<p class="no-colors-message">No specific colors available for this category.</p>';
                    return;
                }

                for (const colorName in colorData) {
                    // Only display if color value is not null
                    if (colorData.hasOwnProperty(colorName) && colorData[colorName] !== null) {
                        const colorValue = colorData[colorName];
                        const colorBox = document.createElement('div');
                        const uniqueClassName = `color-box-${groupKey}-${colorName.replace(/\s+/g, '-')}`;
                        colorBox.className = `color-box ${uniqueClassName}`; // Class for styling color boxes

                        // Add a title for hover effect (shows color name and value)
                        colorBox.title = `${groupKey} - ${colorName.replace('color', 'Color ')}: ${colorValue}`;

                        colorBox.addEventListener('click', () => {
                            try {
                                productImageDiv.style.backgroundColor = colorValue;
                            } catch (error) {
                                console.error('Error setting background color:', error, { colorValue });
                            }

                            // Reset the style of the previously clicked color box
                            if (previousActiveColorBox) {
                                previousActiveColorBox.style.boxShadow = '';
                                previousActiveColorBox.style.marginBottom = '';
                                previousActiveColorBox.style.transform = ''; // Reset transform if applied
                            }

                            // Apply the style to the currently clicked color box
                            const activeColorBox = document.querySelector(`.color-box.${uniqueClassName}`);
                            if (activeColorBox) {
                                activeColorBox.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.3)'; // Stronger shadow
                                activeColorBox.style.marginBottom = '25px'; // More pronounced lift
                                activeColorBox.style.transform = 'translateY(-5px)'; // Slight lift
                            }

                            previousActiveColorBox = activeColorBox; // Store the current color box as the previous one
                        });

                        colorsDiv.appendChild(colorBox);

                        // Insert dynamic CSS rule for background color
                        let cssRules = `.${uniqueClassName} { background-color: ${colorValue}; }`;

                        try {
                            // Check if the rule already exists to prevent duplicates on re-render
                            const existingRules = Array.from(style.sheet.cssRules).map(rule => rule.cssText.trim());
                            if (!existingRules.includes(cssRules.trim())) {
                                style.sheet.insertRule(
                                    cssRules,
                                    style.sheet.cssRules.length
                                );
                            }
                        } catch (error) {
                            console.error("Error inserting CSS rule:", error, cssRules);
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON:', error);
            listCategoryDiv.innerHTML = '<p class="text-red-500">Failed to load data.</p>';
        });
});