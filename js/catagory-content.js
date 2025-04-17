

document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.querySelector('.products-grid');
    const lineWithButtonDiv = document.querySelector('.line-with-button');
    const seeMoreButton = document.querySelector('.see-more-button'); // Select the see-more button
    const nextDiv = document.createElement('div')
    nextDiv.classList.add('next');
    const prevDiv = document.createElement('div')
    prevDiv.classList.add('previous');
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    const prevButton = document.createElement('button');
    prevButton.classList.add('prvious-button');
    // Hide the "See More" button
    if (seeMoreButton) {
        seeMoreButton.style.display = 'none';
    }

    // Style for Previous button
    const prevButtonStyle = `
    display: block;
    margin: 30px auto;
    padding: 20px 25px;
    background-color: rgba(15, 77, 156, 1);
    color: #ffffff;
    text-decoration: none;
    border-radius: 30px;
    text-align: center;
    width: fit-content;
    border: none;
    margin: 0 10px;
    z-index: 1;
    font-size: 17px
    `;

    // Style for Next button
    const nextButtonStyle = `
       display: block;
    margin: 30px auto;
    padding: 20px 25px;
    background-color: rgba(15, 77, 156, 1);
    color: #ffffff;
    text-decoration: none;
    border-radius: 30px;
    text-align: center;
    width: fit-content;
    border: none;
    margin: 0 10px;
    z-index: 1;
    font-size: 17px
    `;


    nextButton.textContent = 'Next';
    prevButton.textContent = 'Previous';

    nextButton.style.cssText = prevButtonStyle;
    prevButton.style.cssText = nextButtonStyle;

    prevButton.style.display = 'none'; // Initially hide previous button

    // Get the category from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    if (!categoryName) {
        productListDiv.innerHTML = '<p>No category specified.</p>';
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

            let displayedCount = 0; // Track displayed product count
            const productsPerPage = 6;

            const displayProducts = (productsToDisplay) => {
                productListDiv.innerHTML = ''; // Clear previous products

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

                    product_card_image_img.src = `${product.image} `;
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
            };

            // Initial display: first 6 products
            displayProducts(allProducts.slice(0, productsPerPage));
            displayedCount += productsPerPage;

            // Add buttons to the line-with-button div
            prevDiv.appendChild(prevButton);
            nextDiv.appendChild(nextButton);
            lineWithButtonDiv.appendChild(prevDiv);
            lineWithButtonDiv.appendChild(nextDiv);

            // Show "Next" if there are more products
            if (allProducts.length > productsPerPage) {
                prevDiv.appendChild(prevButton);
                nextDiv.appendChild(nextButton);
                document.querySelector('.line-with-button').appendChild(prevDiv);
                document.querySelector('.line-with-button').appendChild(nextDiv);
            }

            // Next button event listener (REPLACE)
            nextButton.addEventListener('click', () => {
                displayedCount += productsPerPage;
                displayProducts(allProducts.slice(displayedCount - productsPerPage, displayedCount));

                prevButton.style.display = 'block';

                if (displayedCount >= allProducts.length) {
                    nextButton.style.display = 'none';
                }
            });

            // Previous button event listener (RESTORE)
            prevButton.addEventListener('click', () => {
                displayedCount -= productsPerPage;
                displayProducts(allProducts.slice(displayedCount - productsPerPage, displayedCount));

                if (displayedCount === productsPerPage) {
                    prevButton.style.display = 'none';
                }

                nextButton.style.display = 'block';
            });
        })
        .catch(error => {
            console.error(`Error fetching product data for category ${categoryName}:`, error);
            productListDiv.innerHTML = `<p>Could not load product data for category ${categoryName}.</p>`;
        });
});