document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.querySelector('.products-grid');
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const productSize = urlParams.get('productSize');
    const categoryName = urlParams.get('category');

    if (!productName || !productSize || !categoryName) {
        productListDiv.innerHTML = '<p>Product not specified.</p>';
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
            let productFound = null;

            Object.values(productsData).forEach(products => {
                products.forEach(product => {
                    if (product.name === decodeURIComponent(productName) && product.size === decodeURIComponent(productSize)) {
                        productFound = product;
                    }
                });
            });

            if (productFound) {
                productListDiv.innerHTML = ''; // Clear previous products

                let modifiedSize = productFound.size;
                if (modifiedSize && modifiedSize.length >= 2 && modifiedSize.slice(-1).toLowerCase() === 'i') {
                    const secondLastChar = modifiedSize.slice(-2, -1).toUpperCase();
                    modifiedSize = modifiedSize.slice(0, -2) + secondLastChar; // Trim the 'i'
                }

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
                product_card_image_img.src = `${productFound.image}`; // Removed trailing space
                product_card_image_img.alt = `${productFound.name}`;
                product_card_image.appendChild(product_card_image_img);

                // --- MODIFICATION STARTS HERE ---

                // Create the h3 element for name and size
                const h3Element = document.createElement('h3');
                h3Element.textContent = `${productFound.name}-${productFound.size}`; // Use textContent for safety

                // Create the paragraph for the description and add the class
                const descriptionP = document.createElement('p');
                descriptionP.classList.add('product-description-text'); // Add the new CSS class here
                descriptionP.textContent = productFound.more_detail || 'No description'; // Use textContent to preserve \n

                // Create the paragraph for the size
                const sizeP = document.createElement('p');
                sizeP.textContent = `size : ${modifiedSize.toLowerCase() || 'No size'}`; // Use textContent

                // Append these new elements to the header
                product_content_header.appendChild(h3Element);
                product_content_header.appendChild(descriptionP);
                product_content_header.appendChild(sizeP);

                // --- MODIFICATION ENDS HERE ---

                product_content_footer.innerHTML = `<a href="../html/category-content.html?category=${categoryName}">Previous Page</a>
                                                    <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;

                product_content.appendChild(product_content_header);
                product_content.appendChild(product_content_footer);

                productCard.appendChild(product_card_image);
                productCard.appendChild(product_content);
                productListDiv.appendChild(productCard);

            } else {
                productListDiv.innerHTML = '<p>Product not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            productListDiv.innerHTML = '<p>Could not load product details.</p>';
        });
});