document.addEventListener('DOMContentLoaded', () => {
    const categoryListDiv = document.querySelector('.products-grid');
    const seeMoreButton = document.querySelector('.see-more-button');
    const categoriesJsonFilePath = '../data/catagory-data.json';

    const initialDisplayLimit = 6;
    let allCategories = [];
    let showingAll = false;

    // --- MODIFIED RENDER FUNCTION ---
    const renderCategories = (categoriesToRender) => {
        categoryListDiv.innerHTML = ''; // Clear existing content
        categoriesToRender.forEach((category, index) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('product-card');

            // --- ADD ANIMATION CLASSES --- // NEW
            categoryDiv.classList.add('animate-on-scroll', 'fade-in-up');
            // Stagger the delay for a nice cascade effect, cycles 1 through 6
            const delayClass = 'delay-' + ((index % 6) + 1);
            categoryDiv.classList.add(delayClass);
            // --------------------------- // NEW

            const product_card_image = document.createElement('div');
            product_card_image.classList.add('product-card-image');

            // ... the rest of your card creation code remains the same ...
            const product_content = document.createElement('div');
            product_content.classList.add('product-content');

            const product_content_header = document.createElement('div');
            product_content_header.classList.add('product-content-header');

            const product_content_footer = document.createElement('div');
            product_content_footer.classList.add('product-content-footer');

            const product_card_image_img = document.createElement('img');

            product_card_image_img.src = `${category.image}`;
            product_card_image_img.alt = `${category.name}`;

            product_card_image.appendChild(product_card_image_img);

            product_content_header.innerHTML = `<h3>${category.name}</h3>
                                            <p>${category.description}</p>`;
            product_content_footer.innerHTML = `<a href="../html/category-content.html?category=${category.name.toLowerCase()}">Read More</a>
                                            <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;

            product_content.appendChild(product_content_header);
            product_content.appendChild(product_content_footer);

            categoryDiv.appendChild(product_card_image);
            categoryDiv.appendChild(product_content);
            categoryListDiv.appendChild(categoryDiv);
        });

        // --- RE-RUN THE ANIMATION OBSERVER --- // NEW
        // This ensures new cards loaded via "See More" will also animate
        if (window.observeElements) {
            window.observeElements();
        }
        // ------------------------------------- // NEW
    };

    // Fetch the data
    fetch(categoriesJsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(categoriesData => {
            allCategories = categoriesData; // Store all categories

            // Initial display: show only the first 'initialDisplayLimit' categories
            renderCategories(allCategories.slice(0, initialDisplayLimit));

            // Check if there are more categories than the initial limit
            if (allCategories.length > initialDisplayLimit) {
                seeMoreButton.style.display = 'block'; // Make button visible
                seeMoreButton.textContent = 'See More'; // Set initial button text
                showingAll = false; // Ensure initial state is "not showing all"
            } else {
                seeMoreButton.style.display = 'none'; // Hide if not enough categories
            }

            // Add event listener to the "See More/Show Less" button
            seeMoreButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior (page jump)

                if (showingAll) {
                    // Currently showing all, so switch to showing initial limit
                    renderCategories(allCategories.slice(0, initialDisplayLimit));
                    seeMoreButton.textContent = 'See More';
                    showingAll = false;
                } else {
                    // Currently showing initial limit, so switch to showing all
                    renderCategories(allCategories);
                    seeMoreButton.textContent = 'Show Less';
                    showingAll = true;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            categoryListDiv.innerHTML = '<p>Could not load categories.</p>';
            seeMoreButton.style.display = 'none'; // Hide button on error
        });
});