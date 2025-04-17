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

                product_card_image_img.src = `${productFound.image} `;
                product_card_image_img.alt = `${productFound.name}`;

                product_card_image.appendChild(product_card_image_img);

                product_content_header.innerHTML = `<h3>${productFound.name}-${productFound.size}</h3>
                                                    <p>${productFound.description || 'No description'}</p>
                                                    <p>size : ${modifiedSize.toLowerCase() || 'No size'}</p>
                                                    `
                    ;

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