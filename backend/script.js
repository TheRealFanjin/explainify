// Function to create a star element that falls from the top
function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    // Position the star randomly
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';
    // Set random colors
    star.style.backgroundColor = Math.random() < 0.5 ? 'white' : 'yellow';
    // Add the star to the body
    document.body.appendChild(star);

    const moveX = Math.random() * 2 - 1; // Random horizontal movement
    const moveY = Math.random() * 2 - 1; // Random vertical movement

    function moveStar() {
        const rect = star.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth) {
            star.remove();
        } else {
            star.style.left = (rect.left + moveX) + 'px';
            star.style.top = (rect.top + moveY) + 'px';
            requestAnimationFrame(moveStar);
        }
    }
    moveStar();
}

// Create a new star every 100 ms
setInterval(createStar, 100);

// Variables for the robot jumping effect
const robot = document.querySelector('.robot');
let isJumping = false;
const jumpHeight = 100; // Height of the jump in pixels
const jumpDuration = 500; // Duration of the jump in milliseconds

// Function to handle the jumping of the robot
function jump() {
    if (isJumping) return; // Prevent multiple jumps at the same time
    isJumping = true; // Set jumping state

    robot.style.transform = `translateY(-${jumpHeight}px)`;

    setTimeout(() => {
        robot.style.transform = `translateY(0)`;
        isJumping = false; // Reset jumping state
    }, jumpDuration);
}

// Jump every second
setInterval(jump, 1000);

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const appContainer = document.querySelector('.app-container');
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    const projectName = document.querySelector('#project-name'); // Select the text element
    const inputText = document.querySelector('#input-text'); // Select the text element
    const backgroundOverlay = document.querySelector('.background-overlay'); // Select the background overlay
    // const bubble_container = document.querySelector('.bubble-container');

    // Add click event to the search icon
    searchIcon.addEventListener('click', function () {

        appContainer.style.display = 'none';

        

        // Get the input value
        const inputValue = searchInput.value;

        // API endpoint URL (replace with your actual endpoint)
        const apiUrl = 'http://localhost:5000';

        // Validate input
        if (!inputValue) {
            alert('Please enter a link!');
            return; // Exit if the input is empty
        }

        // Append the input value as a query parameter
        const fullUrl = `${apiUrl}/submit`;
        console.log('GITHUB LINK SENDIN....: ', inputValue);

        // Send the data to the backend
        fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify({
                "github-link": inputValue
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // Handle errors
                }

                fetch(apiUrl + `/generate_docs?link=${inputValue}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type
                    }
                }).then(r => {
                    if (!r.ok) {
                        throw new Error('Network response was not ok'); // Handle errors
                    }
                    return r.json()
                }).then(data => {
                    // console.log('GOT THE DATA' + data);
                    console.log('GOT THE DATA: ', JSON.stringify(data, null, 2)); // Pretty print the JSON data
                    generateSpeechBubbles(data.responses);
                })

                // showSpeechBubble("Link Posted", "Your link has been sent successfully!"); // Show feedback

                return response.json(); // Parse JSON response
            })
            .then(data => {
                console.log('Success:', data); // Handle success

                // Generate bubbles with API response data
                // generateSpeechBubbles([{ 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }]);
            })
            .catch(error => {
                console.error('Error:', error); // Handle errors
                alert('There was an error sending the link. Please try again.'); // Optional user alert
            });

        // Hide the robot and text, show the overlay, and adjust the search container as before
        inputText.textContent = '';
        projectName.textContent = '';
        projectName.style.opacity = '0.5';
        robot.style.display = 'none';

        // Show overlay
        backgroundOverlay.classList.add('show');
        projectName.classList.add('fadeOut');
        inputText.classList.add('fadeOut');

        searchContainer.style.display = 'none';

    });
});

// Function to display a single speech bubble with file name and summary
// function showSpeechBubble(fileName, summary = null) {
//     // Create the speech bubble element
//     const bubble = document.createElement('div');
//     bubble.className = 'speech-bubble';
//     // bubble.style.display = 'block'; // Make the bubble visible

//     bubble.style.display = 'block'; // Ensure it behaves as a block element
//     bubble.style.width = '100%'; // Set width after display is block

//     // Create file name section
//     const fileNameElement = document.createElement('div');
//     fileNameElement.className = 'file-name';
//     fileNameElement.textContent = `File: ${fileName}`;



//     if (summary != null) {
//         // Create summary section
//         const summaryElement = document.createElement('div');
//         summaryElement.className = 'summary';
//         summaryElement.textContent = `Summary: ${summary}`;
//         // Append file name and summary to the bubble
//         bubble.appendChild(fileNameElement);
//         bubble.appendChild(summaryElement);
//     } else // Append file name and summary to the bubble
//         bubble.appendChild(fileNameElement);

//     // Append the bubble to the container
//     document.querySelector('.bubble-container').appendChild(bubble);
// }

// function showSpeechBubble(fileName, summary = null) {
//     const bubble = document.createElement('div');
//     bubble.className = 'speech-bubble';

//     const fileNameElement = document.createElement('div');
//     fileNameElement.className = 'file-name';
//     fileNameElement.textContent = `File: ${fileName}`;
//     bubble.appendChild(fileNameElement);

//     if (summary != null) {
//         const summaryElement = document.createElement('div');
//         summaryElement.className = 'summary';

//         const summaryContent = document.createElement('div');
//         summaryContent.className = 'summary-content';
//         summaryContent.textContent = summary;
//         summaryElement.appendChild(summaryContent);

//         const readMoreBtn = document.createElement('button');
//         readMoreBtn.className = 'read-more-btn';
//         readMoreBtn.textContent = 'Read More';
//         readMoreBtn.addEventListener('click', () => toggleSummary(summaryElement, readMoreBtn));

//         bubble.appendChild(summaryElement);
//         bubble.appendChild(readMoreBtn);
//     }

//     document.querySelector('.bubble-container').appendChild(bubble);
// }

// function showSpeechBubble(fileName, summary = null, index) {
//     const bubble = document.createElement('div');
//     bubble.className = 'speech-bubble';

//     const fileNameElement = document.createElement('div');
//     fileNameElement.className = 'file-name';
//     fileNameElement.textContent = `File: ${fileName}`;
//     bubble.style.marginRight = `${index*10}px`
//     bubble.appendChild(fileNameElement);

//     // if (summary != null) {
//     //     const summaryElement = document.createElement('div');
//     //     summaryElement.className = 'summary'; // Use the updated class for scrolling
//     //     summaryElement.textContent = summary; // Set the summary text
//     //     bubble.appendChild(summaryElement); // Append the summary to the bubble
//     // }

//     document.querySelector('.bubble-container').appendChild(bubble);
// }

// function showFile(fileName, summary = null, index) {
//     const folder = document.createElement('div');
//     folder.className = 'show-file';

//     const fileNameElement = document.createElement('div');
//     fileNameElement.className = 'file-name';
//     fileNameElement.textContent = `File: ${fileName}`;
//     folder.style.marginRight = `${index*10}px`
//     folder.appendChild(fileNameElement);

//     if (summary != null) {
//         const summaryElement = document.createElement('div');
//         summaryElement.className = 'summary';
//         summaryElement.textContent = summary;

//         const readMoreBtn = document.createElement('button');
//         readMoreBtn.className = 'read-more-btn';
//         readMoreBtn.textContent = 'Read More';

//         readMoreBtn.addEventListener('click', () => toggleSummary(summaryElement, readMoreBtn));

//         folder.appendChild(summaryElement);
//         folder.appendChild(readMoreBtn);
//     }

//     document.querySelector('.bubble-container').appendChild(folder);
// }


function showSpeechBubble(fileName, summary = null, index) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';

    const fileNameElement = document.createElement('div');
    fileNameElement.className = 'file-name';
    fileNameElement.textContent = `File: ${fileName}`;

    // Set margin left based on index for indentation effect
    bubble.style.marginLeft = `${index * 20}px`;

    bubble.appendChild(fileNameElement);

    document.querySelector('.bubble-container').appendChild(bubble);
}

function showFile(fileName, summary = null, index) {
    const folder = document.createElement('div');
    folder.className = 'show-file';

    const fileNameElement = document.createElement('div');
    fileNameElement.className = 'file-name';
    fileNameElement.textContent = `File: ${fileName}`;

    // Set margin left based on index for indentation effect
    folder.style.marginLeft = `${index * 50}px`;

    folder.appendChild(fileNameElement);

    if (summary != null) {
        const summaryElement = document.createElement('div');
        summaryElement.className = 'summary';
        summaryElement.textContent = summary;

        // const readMoreBtn = document.createElement('button');
        // readMoreBtn.className = 'read-more-btn';
        // readMoreBtn.textContent = 'Read More';

        // readMoreBtn.addEventListener('click', () => toggleSummary(summaryElement, readMoreBtn));

        folder.appendChild(summaryElement);
        // folder.appendChild(readMoreBtn);
    }

    document.querySelector('.bubble-container').appendChild(folder);
}


function toggleSummary(summaryElement, button) {
    if (summaryElement.style.height === 'auto') {
        summaryElement.style.height = '100%';
        button.textContent = 'Read More';
    } else {
        summaryElement.style.height = 'auto';
        button.textContent = 'Read Less';
    }
}

async function generateSpeechBubbles(data, index = 0) {

    for (const directory_name in data) {
        const regex = /\./i;
        console.log(directory_name)
        regex.test(directory_name) ? showFile(directory_name, data[directory_name], index) : showSpeechBubble(directory_name, "directory", index)
        directory_name, regex.test(directory_name) ? "not directory" : await generateSpeechBubbles(data[directory_name], index + 1)
    }
}
