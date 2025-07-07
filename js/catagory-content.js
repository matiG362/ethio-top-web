// Replace the entire contents of /js/catagory-content.js with this

document.addEventListener('DOMContentLoaded', () => {
    // --- Your original setup code is UNCHANGED ---
    const productListDiv = document.querySelector('.products-grid');
    const lineWithButtonDiv = document.querySelector('.line-with-button');
    const seeMoreButton = document.querySelector('.see-more-button');

    if (seeMoreButton) {
        seeMoreButton.style.display = 'none';
    }

    const prevDiv = document.createElement('div');
    prevDiv.classList.add('previous');
    const nextDiv = document.createElement('div');
    nextDiv.classList.add('next');

    const prevButton = document.createElement('button');
    prevButton.classList.add('previous-button');
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');

    const buttonSharedStyle = `
        display: block; padding: 20px 25px; background-color: rgba(15, 77, 156, 1);
        color: #ffffff; text-decoration: none; border-radius: 30px; text-align: center;
        width: fit-content; border: none; margin: 0 10px; z-index: 1;
        font-size: 17px; cursor: pointer; transition: background-color 0.3s ease;
    `;

    prevButton.style.cssText = buttonSharedStyle;
    nextButton.style.cssText = buttonSharedStyle;
    nextButton.textContent = 'Next';
    prevButton.textContent = 'Previous';

    prevDiv.appendChild(prevButton);
    nextDiv.appendChild(nextButton);
    lineWithButtonDiv.appendChild(prevDiv);
    lineWithButtonDiv.appendChild(nextDiv);

    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    if (!categoryName) {
        productListDiv.innerHTML = '<p>No category specified.</p>';
        lineWithButtonDiv.style.display = 'none';
        return;
    }

    const categoryJsonFilePath = `../products/${categoryName.toLowerCase()}.json`;

    fetch(categoryJsonFilePath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(productsData => {
            let allProducts = [];
            Object.values(productsData).forEach(products => {
                allProducts = allProducts.concat(products);
            });

            let currentPage = 1;
            const productsPerPage = 6;
            const totalPages = Math.ceil(allProducts.length / productsPerPage);

            // --- **MODIFIED displayProducts function** ---
            const displayProducts = (pageNumber) => {
                productListDiv.innerHTML = '';

                const startIndex = (pageNumber - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                const productsToDisplay = allProducts.slice(startIndex, endIndex);

                if (productsToDisplay.length === 0) {
                    productListDiv.innerHTML = '<p>No products available in this category.</p>';
                    return;
                }

                productsToDisplay.forEach((product, index) => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');

                    // --- ADD ANIMATION CLASSES (NEW) ---
                    productCard.classList.add('animate-on-scroll');
                    const delayClass = 'delay-' + ((index % 6) + 1);
                    productCard.classList.add(delayClass);
                    // --- END OF NEW CODE ---

                    // The rest of your card creation is UNCHANGED
                    const product_card_image = document.createElement('div');
                    product_card_image.classList.add('product-card-image');
                    const product_content = document.createElement('div');
                    product_content.classList.add('product-content');
                    const product_content_header = document.createElement('div');
                    product_content_header.classList.add('product-content-header');
                    const product_content_footer = document.createElement('div');
                    product_content_footer.classList.add('product-content-footer');
                    const product_card_image_img = document.createElement('img');
                    product_card_image_img.src = `${product.image || '/products-image/paint-number1.png'} `;
                    product_card_image_img.alt = `${product.name}`;
                    product_card_image.appendChild(product_card_image_img);
                    product_content_header.innerHTML = `<h3>${product.name}-${product.size}</h3><p>${product.description || 'No description'}</p>`;
                    product_content_footer.innerHTML = `<a href="../html/products-detail.html?category=${categoryName}&productName=${encodeURIComponent(product.name)}&productSize=${encodeURIComponent(product.size)}">More detail</a><img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;
                    product_content.appendChild(product_content_header);
                    product_content.appendChild(product_content_footer);
                    productCard.appendChild(product_card_image);
                    productCard.appendChild(product_content);
                    productListDiv.appendChild(productCard);
                });

                // --- RE-RUN THE ANIMATION OBSERVER (NEW) ---
                if (window.observeProductCards) {
                    window.observeProductCards();
                }

                updatePaginationButtons();
            };

            // --- NEW FUNCTION for smooth pagination ---
            const handlePageChange = (newPage) => {
                productListDiv.classList.add('is-fading-out'); // 1. Fade out
                setTimeout(() => {
                    currentPage = newPage;
                    displayProducts(currentPage); // 2. Render new content
                    productListDiv.classList.remove('is-fading-out'); // 3. Fade in
                }, 300); // Must match CSS transition duration
            };

            const updatePaginationButtons = () => {
                if (totalPages <= 1) {
                    lineWithButtonDiv.style.display = 'none';
                } else {
                    lineWithButtonDiv.style.display = 'flex';
                    nextButton.style.display = (currentPage >= totalPages) ? 'none' : 'block';
                    prevButton.style.display = (currentPage <= 1) ? 'none' : 'block';
                }
            };

            // Initial display
            displayProducts(currentPage);

            // --- MODIFIED Event Listeners to use the new handler ---
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                }
            });

            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                }
            });
        })
        .catch(error => {
            console.error(`Error fetching product data for category ${categoryName}:`, error);
            productListDiv.innerHTML = `<p>Could not load product data for category ${categoryName}.</p>`;
            lineWithButtonDiv.innerHTML = '';
        });
});