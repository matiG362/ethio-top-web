document.addEventListener('DOMContentLoaded', () => {
    // FAQ functionality - Keep this as is
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            question.nextElementSibling.classList.toggle('active');
            question.querySelector('.faq-toggle').classList.toggle('active');
        });
    });

    // --- Product Display Logic ---
    const productListDiv = document.querySelector('.products-grid');
    const seeMoreButton = document.querySelector('.see-more-button');

    const filePaths = [

        '../products/enamil.json', // Adjusted from .json to _products.json as per your last structure
        '../products/glue.json',
        '../products/super.json',
        '../products/wubet.json',
        '../products/mica.json',
        '../products/quartz.json',
        '../products/antirust.json',
        '../products/conextra.json',
        '../products/powder_quartz.json',
        '../products/primer.json',
        '../products/putty.json',
        '../products/stone_paints.json',
        '../products/texture.json',
        '../products/varnish.json'
    ];

    const initialCategoryDisplayCount = 6; // Number of categories to draw one random product from initially
    let allSelectedRandomProducts = []; // Will store ONE random product from EACH of the 14 category files.
    let showingAllCategories = false; // Tracks the current state

    // Function to render product cards (remains the same)
    const renderProductCards = (productsToRender) => {
        productListDiv.innerHTML = ''; // Clear existing content
        productsToRender.forEach(product => {
            if (product) { // Ensure product is not null (in case a category file was empty)
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

                // IMPORTANT: Your detailed product JSONs (e.g., "Wubet 001") do NOT have an 'image' property.
                // This line will use a fallback image unless you add an 'image' property to each product
                // object in your category-specific JSON files.
                product_card_image_img.src = product.image || '/products-image/paint-number1.png'; // Fallback image if no 'image' property
                product_card_image_img.alt = `${product.name}`;

                product_card_image.appendChild(product_card_image_img);

                product_content_header.innerHTML = `<h3>${product.name}</h3>
                                                    <p>${product.description || 'No description'}</p>`;

                // The link currently goes to a generic products.html.
                // If you want to link to a specific detail page for *this product*,
                // you'll need to pass parameters, e.g., `../html/product-detail.html?category=${product.categoryName}&productCode=${product.name}`
                product_content_footer.innerHTML = `<a href="../html/products.html">View Product</a>
                                                    <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">`;

                product_content.appendChild(product_content_header);
                product_content.appendChild(product_content_footer);

                productCard.appendChild(product_card_image);
                productCard.appendChild(product_content);
                productListDiv.appendChild(productCard);
            }
        });
    };

    // Function to fetch a JSON file and return ONE random product from all variations within that file.
    const fetchAndGetOneRandomProductFromCategoryFile = (filePath) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} from ${filePath}`);
                }
                return response.json();
            })
            .then(categoryData => {
                // `Object.values(categoryData)` gets all the arrays of products (e.g., all Wubet 001 variations, all Wubet 105 variations)
                // `.flat()` combines these into a single array of all product variations in this category.
                const allProductsInThisCategory = Object.values(categoryData).flat();

                if (allProductsInThisCategory.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allProductsInThisCategory.length);
                    const selectedProduct = allProductsInThisCategory[randomIndex];
                    // Optional: Add the category name to the product object for easier linking later if needed
                    // selectedProduct.categoryName = filePath.split('/').pop().replace('_products.json', '');
                    return selectedProduct;
                } else {
                    console.warn(`No products found within categories in ${filePath}`);
                    return null; // Return null if no products in file
                }
            });
    };

    // Fetch one random product from EACH of the 14 category files
    Promise.all(filePaths.map(fetchAndGetOneRandomProductFromCategoryFile))
        .then(products => {
            // Filter out any nulls that might have resulted if a category file was empty
            allSelectedRandomProducts = products.filter(product => product !== null);

            // Initial display: one random product from each of the first `initialCategoryDisplayCount` categories
            renderProductCards(allSelectedRandomProducts.slice(0, initialCategoryDisplayCount));

            // Determine if the "All Products" button should be shown
            if (allSelectedRandomProducts.length > initialCategoryDisplayCount) {
                seeMoreButton.style.display = 'block'; // Make button visible
                seeMoreButton.textContent = 'All Products'; // Set initial button text
                showingAllCategories = false; // Initial state: not showing all
            } else {
                seeMoreButton.style.display = 'none'; // Hide if there aren't more categories to show
            }

            // Add event listener to the "All Products / See Less" button
            seeMoreButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior (page jump)

                if (showingAllCategories) {
                    // Currently showing all, so switch to showing initial limit
                    renderProductCards(allSelectedRandomProducts.slice(0, initialCategoryDisplayCount));
                    seeMoreButton.textContent = 'All Products';
                    showingAllCategories = false;
                } else {
                    // Currently showing initial limit, so switch to showing all
                    renderProductCards(allSelectedRandomProducts);
                    seeMoreButton.textContent = 'See Less';
                    showingAllCategories = true;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            productListDiv.innerHTML = '<p>Could not load product data. Please check file paths and content.</p>';
            seeMoreButton.style.display = 'none'; // Hide button on error
        });
});