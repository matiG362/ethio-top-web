document.addEventListener('DOMContentLoaded', () => {
    const categoryTagsDiv = document.querySelector('.tags'); // Select the div with class 'tags'

    if (!categoryTagsDiv) {
        console.warn("Element with class 'tags' not found for displaying categories.");
        return; // Exit if the target div isn't found
    }

    // Clear existing placeholder tags, but keep any potential H2 header
    Array.from(categoryTagsDiv.children).forEach(child => {
        if (child.tagName.toLowerCase() !== 'h2') { // Assuming an H2 might be a title
            child.remove();
        }
    });

    // Fetch data from category.json
    fetch('/data/catagory-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(categories => {
            // Ensure an <h2> "Categories" or "Popular Categories" header is present if desired
            // let h2 = categoryTagsDiv.querySelector('h2');
            // if (!h2) {
            //     h2 = document.createElement('h2');
            //     h2.textContent = 'Categories'; 
            //     categoryTagsDiv.prepend(h2); 
            // }

            // Shuffle the array to get a random selection
            // Fisher-Yates (Knuth) shuffle algorithm
            for (let i = categories.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [categories[i], categories[j]] = [categories[j], categories[i]]; // ES6 swap
            }

            const displayLimit = 7;

            categories.slice(0, displayLimit).forEach(category => {
                if (category.name) { // Ensure category object has a 'name' property
                    const tagDiv = document.createElement('div');
                    tagDiv.classList.add('tag'); // Add the 'tag' class to the div

                    const a = document.createElement('a');
                    // Set the link to your category content page, encoding the category name
                    a.href = `/html/category-content.html?category=${encodeURIComponent(category.name)}`;
                    a.textContent = category.name; // Display the category name

                    tagDiv.appendChild(a);
                    categoryTagsDiv.appendChild(tagDiv);
                }
            });

            if (categories.length === 0) { // If no categories are loaded
                const noCategoriesMessage = document.createElement('p');
                noCategoriesMessage.textContent = 'No categories available.';
                noCategoriesMessage.style.color = '#ccc';
                noCategoriesMessage.style.fontSize = '0.9em';
                categoryTagsDiv.appendChild(noCategoriesMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            // Re-select the div in case an error wiped its content
            const currentCategoryTagsDiv = document.querySelector('.tags');
            if (currentCategoryTagsDiv) {
                currentCategoryTagsDiv.innerHTML = '<h2>Categories</h2><p style="color: red;">Failed to load categories.</p>';
            }
        });
});