document.addEventListener('DOMContentLoaded', () => {
    const categoryListDiv = document.querySelector('.products-grid');
    const categoriesJsonFilePath = '../data/catagory-data.json'; // Path to your first JSON file

    fetch(categoriesJsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(categoriesData => {
            categoriesData.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('product-card');

                const product_card_image = document.createElement('div');
                product_card_image.classList.add('product-card-image');

                const product_content = document.createElement('div');
                product_content.classList.add('product-content');

                const product_content_header = document.createElement('div');
                product_content_header.classList.add('product-content-header');

                const product_content_footer = document.createElement('div');
                product_content_footer.classList.add('product-content-footer');

                const product_card_image_img = document.createElement('img');


                product_card_image_img.src = `${category.image} `
                product_card_image_img.alt = `${category.name}`;


                product_card_image.appendChild(product_card_image_img);


                product_content_header.innerHTML = `<h3>${category.name}</h3>
                                <p>${category.description}</p>`
                product_content_footer.innerHTML = `<a href="/category-content.html?category=${category.name.toLowerCase()}">Read More</a>
                                <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow"> 
                                               `

                product_content.appendChild(product_content_header);
                product_content.appendChild(product_content_footer);


                // const categoryLink = document.createElement('a');
                // categoryLink.href = `/category-content.html?category=${category.name.toLowerCase()}`; // Link to the next page with category as a query parameter
                // categoryDiv.innerHTML = `
                //         <div class="product-card-image">
                //             <img src="${category.image}" alt="${category.name}>
                //         </div>
                //         <div class="product-content">
                //             <div class="product-content-header">
                //                 <h3>${category.name}</h3>
                //                 <p>${category.description}</p>
                //             </div>
                //             <div class="product-content-footer">
                //                 <a href="/category-content.html?category=${category.name.toLowerCase()}">Read More</a>
                //                 <img src="/products-image/diagonal-arrow.png" alt="diagonal arrow">
                //             </div>
                //         </div>
                // `;
                // categoryDiv.appendChild(categoryLink);


                categoryDiv.appendChild(product_card_image);
                categoryDiv.appendChild(product_content);
                categoryListDiv.appendChild(categoryDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            categoryListDiv.innerHTML = '<p>Could not load categories.</p>';
        });
});


// <img src="${category.image}" alt="${category.name}">