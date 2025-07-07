// Replace the entire contents of /js/product-detail.js with this

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
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
                productListDiv.innerHTML = '';

                let modifiedSize = productFound.size;
                if (modifiedSize && modifiedSize.length >= 2 && modifiedSize.slice(-1).toLowerCase() === 'i') {
                    const secondLastChar = modifiedSize.slice(-2, -1).toUpperCase();
                    modifiedSize = modifiedSize.slice(0, -2) + secondLastChar;
                }

                // --- Your original element creation code is UNCHANGED ---
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
                product_card_image_img.src = `${productFound.image}`;
                product_card_image_img.alt = `${productFound.name}`;
                product_card_image.appendChild(product_card_image_img);

                const h3Element = document.createElement('h3');
                h3Element.textContent = `${productFound.name}-${productFound.size}`;
                const descriptionP = document.createElement('p');
                descriptionP.classList.add('product-description-text');
                descriptionP.textContent = productFound.more_detail || 'No description';
                const sizeP = document.createElement('p');
                sizeP.textContent = `size : ${modifiedSize.toLowerCase() || 'No size'}`;

                product_content_header.appendChild(h3Element);
                product_content_header.appendChild(descriptionP);
                product_content_header.appendChild(sizeP);

                product_content_footer.innerHTML = `<a href="../html/category-content.html?category=${categoryName}">Previous Page</a>
                                                    <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;

                product_content.appendChild(product_content_header);
                product_content.appendChild(product_content_footer);
                productCard.appendChild(product_card_image);
                productCard.appendChild(product_content);
                productListDiv.appendChild(productCard);

                // --- ANIMATION TRIGGER (NEW) ---
                // 1. Add the initial "before" animation states
                product_card_image.classList.add('is-loading-in-left');
                product_content.classList.add('is-loading-in-right');

                // 2. Use a tiny setTimeout to allow the browser to render the initial state
                //    before we trigger the "after" animation state. This is a robust trick.
                setTimeout(() => {
                    productCard.classList.add('is-visible');
                }, 100); // 100ms delay is plenty
                // --- END OF NEW CODE ---

            } else {
                productListDiv.innerHTML = '<p>Product not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            productListDiv.innerHTML = '<p>Could not load product details.</p>';
        });
});