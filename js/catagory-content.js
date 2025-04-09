
document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.getElementById('product-list');
    const productSelector = document.getElementById('product-selector');

    // Get the category from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    if (!categoryName) {
        productListDiv.innerHTML = '<p>No category specified.</p>';
        return;
    }

    const categoryJsonFilePath = `./products/${categoryName.toLowerCase()}.json`;

    fetch(categoryJsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(productsData => {
            const productNames = Object.keys(productsData);
            let firstProductName = productNames[0];

            // Populate the selector with product names
            productNames.forEach(productName => {
                const option = document.createElement('option');
                option.value = productName;
                option.textContent = productName;
                productSelector.appendChild(option);
            });

            // Function to display product details based on selection
            const displayProductDetails = (selectedProductName) => {
                productListDiv.innerHTML = ''; // Clear previous details
                if (productsData[selectedProductName]) {
                    const products = productsData[selectedProductName];
                    products.forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.classList.add('product-item');

                        // Create a link to the product detail page
                        const detailLink = document.createElement('a');
                        detailLink.href = `/product-detail.html?product=${encodeURIComponent(selectedProductName)}&id=${product.id}`; // Include product name and ID
                        detailLink.style.textDecoration = 'none';
                        detailLink.style.color = 'inherit';

                        detailLink.innerHTML = `
                            <h2>${selectedProductName}</h2>
                            <h3>Product ID: ${product.id}</h3>
                            <p>Size: ${product.size}</p>
                            <p>Description: ${product.description || 'No description'}</p>
                            <hr>
                        `;
                        productDiv.appendChild(detailLink);
                        productListDiv.appendChild(productDiv);
                    });
                } else {
                    productListDiv.innerHTML = `<p>Product "${selectedProductName}" not found.</p>`;
                }
            };

            // Initial display: show the first product's details
            if (firstProductName) {
                displayProductDetails(firstProductName);
                productSelector.value = firstProductName; // Set the selector to the first product
            } else if (productNames.length > 0) {
                displayProductDetails(productNames[0]);
                productSelector.value = productNames[0];
            }

            // Event listener for selector changes
            productSelector.addEventListener('change', () => {
                displayProductDetails(productSelector.value);
            });

        })
        .catch(error => {
            console.error(`Error fetching product data for category ${categoryName}:`, error);
            productListDiv.innerHTML = `<p>Could not load product data for category ${categoryName}.</p>`;
        });
});