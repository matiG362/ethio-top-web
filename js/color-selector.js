// document.addEventListener('DOMContentLoaded', () => {
//     const listCategoryDiv = document.querySelector('.list-category');
//     listCategoryDiv.innerHTML = '';
//     const colorsDiv = document.querySelector('.colors');
//     const style = document.createElement('style');
//     document.head.appendChild(style);
//     const productImageDiv = document.querySelector('.product-image');

//     fetch('../color-selector/color-selector.json')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(jsonData => {
//             let firstGroupKey = Object.keys(jsonData)[0];
//             displayColors(jsonData, firstGroupKey);

//             for (const key in jsonData) {
//                 if (jsonData.hasOwnProperty(key)) {
//                     const div = document.createElement('div');
//                     div.textContent = key;
//                     div.addEventListener('click', () => {
//                         displayColors(jsonData, key);
//                     });
//                     listCategoryDiv.appendChild(div);
//                 }
//             }

//             function displayColors(jsonData, groupKey) {
//                 colorsDiv.innerHTML = '';
//                 style.innerHTML = '';
//                 const colorData = jsonData[groupKey];
//                 console.log(`Displaying colors for group: ${groupKey}`);
//                 for (const colorName in colorData) {
//                     if (colorData.hasOwnProperty(colorName)) {
//                         const colorValue = colorData[colorName];
//                         const colorBox = document.createElement('div');
//                         const uniqueClassName = `color-box-${groupKey}-${colorName.replace(/\s+/g, '-')}`;
//                         colorBox.className = `color-box ${uniqueClassName}`;
//                         // colorBox.textContent = colorName;
//                         colorBox.addEventListener('click', () => {
//                             try {
//                                 productImageDiv.style.backgroundColor = colorValue;
//                             } catch (error) {
//                                 console.error('Error setting background color:', error, { colorValue });
//                             }
//                         });

//                         colorsDiv.appendChild(colorBox);

//                         console.log(`  Color: ${colorName}, Value: ${colorValue}, Class: ${uniqueClassName}`); // Add this line



//                         let cssRules = `.color-box.${uniqueClassName} { background-color: ${colorValue}; `;
//                         if (colorName === 'color2') {
//                             cssRules += "box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); margin-bottom: 20px; }";
//                         } else {
//                             cssRules += " }";
//                         }

//                         try {
//                             style.sheet.insertRule(
//                                 cssRules,
//                                 style.sheet.cssRules.length
//                             );
//                         } catch (error) {
//                             console.error("Error inserting CSS rule:", error, cssRules);
//                         }
//                     }
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching or parsing JSON:', error);
//             listCategoryDiv.innerHTML = '<p class="text-red-500">Failed to load data.</p>';
//         });
// });



document.addEventListener('DOMContentLoaded', () => {
    const listCategoryDiv = document.querySelector('.list-category');
    listCategoryDiv.innerHTML = '';
    const colorsDiv = document.querySelector('.colors');
    const style = document.createElement('style');
    document.head.appendChild(style);
    const productImageDiv = document.querySelector('.product-image');

    fetch('../color-selector/color-selector.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            let firstGroupKey = Object.keys(jsonData)[0];
            displayColors(jsonData, firstGroupKey);

            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    const div = document.createElement('div');
                    div.textContent = key;
                    div.addEventListener('click', () => {
                        displayColors(jsonData, key);
                        productImageDiv.style.backgroundColor = 'white';
                    });
                    listCategoryDiv.appendChild(div);
                }
            }

            let previousActiveColorBox = null; // Store the previously clicked color box

            function displayColors(jsonData, groupKey) {
                colorsDiv.innerHTML = '';
                style.innerHTML = '';
                const colorData = jsonData[groupKey];
                console.log(`Displaying colors for group: ${groupKey}`);
                for (const colorName in colorData) {
                    if (colorData.hasOwnProperty(colorName)) {
                        const colorValue = colorData[colorName];
                        const colorBox = document.createElement('div');
                        const uniqueClassName = `color-box-${groupKey}-${colorName.replace(/\s+/g, '-')}`;
                        colorBox.className = `color-box ${uniqueClassName}`;

                        colorBox.addEventListener('click', () => {
                            try {
                                productImageDiv.style.backgroundColor = colorValue;
                            } catch (error) {
                                console.error('Error setting background color:', error, { colorValue });
                            }

                            // Reset the style of the previously clicked color box
                            if (previousActiveColorBox) {
                                previousActiveColorBox.style.boxShadow = '';
                                previousActiveColorBox.style.marginBottom = '';
                            }

                            // Apply the style to the currently clicked color box
                            const activeColorBox = document.querySelector(`.color-box.${uniqueClassName}`);
                            if (activeColorBox) {
                                activeColorBox.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
                                activeColorBox.style.marginBottom = '20px';
                            }

                            previousActiveColorBox = activeColorBox; // Store the current color box as the previous one

                        });

                        colorsDiv.appendChild(colorBox);

                        console.log(`  Color: ${colorName}, Value: ${colorValue}, Class: ${uniqueClassName}`);

                        let cssRules = `.color-box.${uniqueClassName} { background-color: ${colorValue}; }`;

                        try {
                            style.sheet.insertRule(
                                cssRules,
                                style.sheet.cssRules.length
                            );
                        } catch (error) {
                            console.error("Error inserting CSS rule:", error, cssRules);
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing JSON:', error);
            listCategoryDiv.innerHTML = '<p class="text-red-500">Failed to load data.</p>';
        });
});