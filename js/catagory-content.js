document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.querySelector('.products-grid');
    const lineWithButtonDiv = document.querySelector('.line-with-button');
    const seeMoreButton = document.querySelector('.see-more-button'); // This button is hidden by design

    // Hide the "See More" button if it exists
    if (seeMoreButton) {
        seeMoreButton.style.display = 'none';
    }

    // Create and style pagination buttons
    const prevDiv = document.createElement('div');
    prevDiv.classList.add('previous');
    const nextDiv = document.createElement('div');
    nextDiv.classList.add('next');

    const prevButton = document.createElement('button');
    prevButton.classList.add('previous-button'); // Corrected typo: 'prvious-button' to 'previous-button'
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');

    // Button shared styles (apply directly to the button elements)
    const buttonSharedStyle = `
        display: block;
        padding: 20px 25px;
        background-color: rgba(15, 77, 156, 1);
        color: #ffffff;
        text-decoration: none;
        border-radius: 30px;
        text-align: center;
        width: fit-content;
        border: none;
        margin: 0 10px; /* Space between buttons */
        z-index: 1;
        font-size: 17px;
        cursor: pointer; /* Add cursor pointer for better UX */
        transition: background-color 0.3s ease; /* Smooth hover effect */
    `;

    prevButton.style.cssText = buttonSharedStyle;
    nextButton.style.cssText = buttonSharedStyle;

    nextButton.textContent = 'Next';
    prevButton.textContent = 'Previous';

    // Append buttons to their respective divs, then append to lineWithButtonDiv once
    prevDiv.appendChild(prevButton);
    nextDiv.appendChild(nextButton);
    lineWithButtonDiv.appendChild(prevDiv);
    lineWithButtonDiv.appendChild(nextDiv);

    // Get the category from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    if (!categoryName) {
        productListDiv.innerHTML = '<p>No category specified.</p>';
        // Hide pagination buttons if no category
        lineWithButtonDiv.style.display = 'none';
        return;
    }

    const categoryJsonFilePath = `../products/${categoryName.toLowerCase()}.json`;

    fetch(categoryJsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(productsData => {
            let allProducts = [];
            Object.values(productsData).forEach(products => {
                allProducts = allProducts.concat(products);
            });

            let currentPage = 1; // Start at the first page
            const productsPerPage = 6;
            const totalPages = Math.ceil(allProducts.length / productsPerPage); // Calculate total number of pages

            const displayProducts = (pageNumber) => {
                productListDiv.innerHTML = ''; // Clear previous products

                const startIndex = (pageNumber - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                const productsToDisplay = allProducts.slice(startIndex, endIndex);

                if (productsToDisplay.length === 0 && allProducts.length > 0 && pageNumber > 1) {
                    // This handles a case where the last page might have been clicked
                    // and then items were removed, leading to an empty page.
                    // Generally, currentPage check prevents this.
                    currentPage--;
                    displayProducts(currentPage);
                    return;
                }

                if (productsToDisplay.length === 0 && allProducts.length === 0) {
                    productListDiv.innerHTML = '<p>No products available in this category.</p>';
                    return;
                }

                productsToDisplay.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');

                    const product_card_image = document.createElement('div');
                    product_card_image.classList.add('product-card-image');

                    const product_content = document.createElement('div');
                    product_content.classList.add('product-content');

                    const product_content_header = document.createElement('div');
                    product_content_header.classList.add('product-content-header');

                    const product_content_footer = document.createElement('div');
                    product_content_footer.classList.add('product-content-footer');

                    const product_card_image_img = document.createElement('img');

                    product_card_image_img.src = `${product.image || '/products-image/paint-number1.png'} `; // Added fallback image
                    product_card_image_img.alt = `${product.name}`;

                    product_card_image.appendChild(product_card_image_img);

                    product_content_header.innerHTML = `<h3>${product.name}-${product.size}</h3>
                                                    <p>${product.description || 'No description'}</p>`;
                    product_content_footer.innerHTML = `<a href="../html/products-detail.html?category=${categoryName}&productName=${encodeURIComponent(product.name)}&productSize=${encodeURIComponent(product.size)}">More detail</a>
                                                    <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;


                    product_content.appendChild(product_content_header);
                    product_content.appendChild(product_content_footer);

                    productCard.appendChild(product_card_image);
                    productCard.appendChild(product_content);
                    productListDiv.appendChild(productCard);
                });

                // After displaying products, update button visibility
                updatePaginationButtons();
            };

            const updatePaginationButtons = () => {
                if (totalPages <= 1) {
                    // If there's only one page or no products, hide both buttons
                    nextButton.style.display = 'none';
                    prevButton.style.display = 'none';
                } else {
                    // Show/hide Next button
                    if (currentPage >= totalPages) {
                        nextButton.style.display = 'none';
                    } else {
                        nextButton.style.display = 'block';
                    }

                    // Show/hide Previous button
                    if (currentPage <= 1) {
                        prevButton.style.display = 'none';
                    } else {
                        prevButton.style.display = 'block';
                    }
                }
            };

            // Initial display: Load the first page of products
            displayProducts(currentPage);

            // Next button event listener
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayProducts(currentPage);
                }
            });

            // Previous button event listener
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayProducts(currentPage);
                }
            });
        })
        .catch(error => {
            console.error(`Error fetching product data for category ${categoryName}:`, error);
            productListDiv.innerHTML = `<p>Could not load product data for category ${categoryName}.</p>`;
            // Hide pagination buttons on error
            lineWithButtonDiv.innerHTML = '';
        });
});