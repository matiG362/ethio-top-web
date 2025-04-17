// $(document).ready(function () {
//     $('.faq-question').click(function () {
//         $(this).next('.faq-answer').toggleClass('active');
//         $(this).find('.faq-toggle').toggleClass('active');
//     });
// });
document.addEventListener('DOMContentLoaded', () => {
    // FAQ functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            question.nextElementSibling.classList.toggle('active');
            question.querySelector('.faq-toggle').classList.toggle('active');
        });
    });

    // ... (rest of the product display code)
});




document.addEventListener('DOMContentLoaded', () => {
    const productListDiv = document.querySelector('.products-grid');

    // Array of JSON file paths
    const filePaths = [
        '../products/enamil.json',
        '../products/glue.json',
        '../products/super.json',
        '../products/wubet.json',
        '../products/mica.json',
        '../products/quartz.json'
    ];

    // Function to fetch a JSON file and return a random product
    const fetchAndGetRandomProduct = (filePath) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(productsData => {
                const allProducts = [];
                Object.values(productsData).forEach(products => {
                    allProducts.push(...products);
                });

                if (allProducts.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allProducts.length);
                    return allProducts[randomIndex];
                } else {
                    return null; // Return null if no products in file
                }
            });
    };

    // Fetch and display random products from each file
    Promise.all(filePaths.map(fetchAndGetRandomProduct))
        .then(products => {
            products.forEach(product => {
                if (product) {
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

                    product_content_header.innerHTML = `<h3>${product.name}</h3>
                                        <p>${product.description || 'No description'}</p>`;

                    product_content_footer.innerHTML = `<a href="../html/products.html">View Product</a>
                                        <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;

                    product_content.appendChild(product_content_header);
                    product_content.appendChild(product_content_footer);

                    productCard.appendChild(product_card_image);
                    productCard.appendChild(product_content);
                    productListDiv.appendChild(productCard);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            productListDiv.innerHTML = '<p>Could not load product data.</p>';
        });
});