document.addEventListener("DOMContentLoaded", () => {
    const searchImageButton = document.getElementById("searchImageButton");
    const imageSearch = document.getElementById("imageSearch");
    const imageSearchResults = document.getElementById("imageSearchResults");
    const moodBoard = document.getElementById("moodBoard");
    const textInput = document.getElementById("textInput");
    const addTextButton = document.getElementById("addTextButton");
    const emojis = document.querySelectorAll(".emoji");
    const imageInput = document.getElementById("imageInput");
    const colorPalette = document.querySelectorAll(".color");
    const UNSPLASH_API_KEY = 'vpO5dBtolmZA_xw9BDxbQo3qRGPleNRGb8wv1OBKGLA'; //Unsplash API key created by account creation 
                                                                            //for generating images searched by user
    let selectedImages = 0;
    let selectedColor = '#000000'; // Default color is black

    moodBoard.style.position = 'relative'; // Makes moodboard the reference for absolute positioning

    // Function used to avoid overlapping of images and text on moodboard
    function checkOverlap(newTop, newLeft, elementWidth, elementHeight) {
        const moodBoardElements = document.querySelectorAll('#moodBoard img, #moodBoard div');
        for (let element of moodBoardElements) {
            const elementRect = element.getBoundingClientRect();
            if (
                newTop < elementRect.bottom &&
                newTop + elementHeight > elementRect.top &&
                newLeft < elementRect.right &&
                newLeft + elementWidth > elementRect.left
            ) {
                return true; // Overlap detected
            }
        }
        return false; // No overlap
    }

    // Place items selected by user on moodboard at random positions
    function getRandomPosition(elementWidth, elementHeight) {
        let randomTop, randomLeft;
        do {
            randomTop = Math.random() * (moodBoard.offsetHeight - elementHeight) + 'px';
            randomLeft = Math.random() * (moodBoard.offsetWidth - elementWidth) + 'px';
        } while (checkOverlap(randomTop, randomLeft, elementWidth, elementHeight));

        return { randomTop, randomLeft };
    }

    // Display search results when the search button is clicked
    searchImageButton.addEventListener("click", () => {
        const query = imageSearch.value.trim();

        if (query) {
            console.log("Searching for images related to:", query);

            fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    if (data.results.length > 0) {
                        imageSearchResults.innerHTML = ''; // Clear previous results

                        // Loop through search results and display images
                        data.results.forEach(image => {
                            const imgUrl = image.urls.regular;
                            const photographerName = image.user.name;
                            const photographerLink = image.user.links.html;

                            const imgElement = document.createElement('img');
                            imgElement.src = imgUrl;
                            imgElement.style.width = '150px';
                            imgElement.style.margin = '10px';

                            // Add click event to append image to mood board
                            imgElement.addEventListener('click', function () {
                                if (selectedImages < 3) {
                                    const imageWidth = 150;
                                    const imageHeight = 150;
                                    const { randomTop, randomLeft } = getRandomPosition(imageWidth, imageHeight);

                                    // Create mood board image
                                    const moodBoardImage = document.createElement('img');
                                    moodBoardImage.src = imgElement.src;
                                    moodBoardImage.style.position = 'absolute';
                                    moodBoardImage.style.top = randomTop;
                                    moodBoardImage.style.left = randomLeft;
                                    moodBoardImage.style.width = '150px';
                                    moodBoardImage.style.borderColor = selectedColor; // Apply selected border color

                                    // Make the image draggable, and constrain movement to moodboard
                                    $(moodBoardImage).draggable({
                                        containment: "#moodBoard"
                                    });

                                    // Image made a clickable link to author's profile on Unsplash
                                    const imgLink = document.createElement('a');
                                    imgLink.href = photographerLink;
                                    imgLink.target = "_blank";
                                    imgLink.appendChild(moodBoardImage);
                                    moodBoard.appendChild(imgLink);

                                    selectedImages++;

                                    // Clear saerch results after 3 images are selected to moodboard
                                    if (selectedImages === 3) {
                                        imageSearchResults.innerHTML = '';
                                    }
                                }
                            });

                            imageSearchResults.appendChild(imgElement);
                        });
                    } else {
                        alert("No images found for your search.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching images:", error);
                });
        } else {
            alert("Please enter a search term.");
        }
    });

    // Handle uploaded image from the user's device
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.style.width = '150px'; // Set image size

                // Add click event to append image to mood board
                imgElement.addEventListener('click', function () {
                    if (selectedImages < 3) {
                        const imageWidth = 150;
                        const imageHeight = 150;
                        const { randomTop, randomLeft } = getRandomPosition(imageWidth, imageHeight);

                        // Create mood board image
                        const moodBoardImage = document.createElement('img');
                        moodBoardImage.src = imgElement.src;
                        moodBoardImage.style.position = 'absolute';
                        moodBoardImage.style.top = randomTop;
                        moodBoardImage.style.left = randomLeft;
                        moodBoardImage.style.width = '150px';
                        moodBoardImage.style.borderColor = selectedColor; // Apply selected border color

                        // Make the image draggable, and constrain movement to moodboard
                        $(moodBoardImage).draggable({
                            containment: "#moodBoard"
                        });

                        // Append the image directly to moodboard
                        moodBoard.appendChild(moodBoardImage);

                        selectedImages++;

                        // Hide search results after 3 images are selected
                        if (selectedImages === 3) {
                            imageSearchResults.innerHTML = '';
                        }
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Add text to mood board
    addTextButton.addEventListener("click", () => {
        const textValue = textInput.value.trim();
        if (textValue) {
            const randomTop = Math.random() * (moodBoard.offsetHeight - 50) + 'px';
            const randomLeft = Math.random() * (moodBoard.offsetWidth - 150) + 'px';

            const textElement = document.createElement('div');
            textElement.textContent = textValue;
            textElement.style.position = 'absolute';
            textElement.style.top = randomTop;
            textElement.style.left = randomLeft;
            textElement.style.fontSize = '20px';
            textElement.style.color = '#ffffff'; // Always apply black color to text

            // Make the text draggable, and constrain movement to moodboard
            $(textElement).draggable({
                containment: "#moodBoard"
            });

            moodBoard.appendChild(textElement);
        }
    });

    // Add emojis to mood board
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            const randomTop = Math.random() * (moodBoard.offsetHeight - 50) + 'px';
            const randomLeft = Math.random() * (moodBoard.offsetWidth - 50) + 'px';

            const emojiElement = document.createElement('div');
            emojiElement.textContent = emoji.dataset.emoji;
            emojiElement.style.position = 'absolute';
            emojiElement.style.top = randomTop;
            emojiElement.style.left = randomLeft;
            emojiElement.style.fontSize = '40px';
            emojiElement.style.color = selectedColor; // Apply selected color to emojis

            // Make the emoji draggable, and constrain movement to moodboard
            $(emojiElement).draggable({
                containment: "#moodBoard"
            });

            moodBoard.appendChild(emojiElement);
        });
    });

    // Add color palette functionality
    colorPalette.forEach(color => {
        color.addEventListener("click", () => {
            selectedColor = color.style.backgroundColor;
            console.log("Selected Color:", selectedColor);

            // Apply the selected color to the mood board background
            moodBoard.style.backgroundColor = selectedColor;
        });
    });
});
