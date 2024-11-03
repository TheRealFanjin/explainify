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
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    const projectName = document.querySelector('#project-name'); // Select the text element
    const inputText = document.querySelector('#input-text'); // Select the text element
    const backgroundOverlay = document.querySelector('.background-overlay'); // Select the background overlay
    const bubble_container = document.querySelector('.bubble-container');

    // Create a container for speech bubbles
    // const bubbleContainer = document.createElement('div');
    // bubbleContainer.className = 'bubble-container'; // Assign a class for styling
    // bubbleContainer.style.display = 'grid';
    // bubbleContainer.style.flexDirection = 'column';
    // bubbleContainer.style.backgroundColor = 'transparent';
    // bubbleContainer.style.position = 'fixed'; // Keep it fixed on the screen
    // bubbleContainer.style.top = '0px'; // Adjust based on preference
    // bubbleContainer.style.left = '0px'; // Adjust based on preference
    // bubbleContainer.style.zIndex = '1000'; // Ensure it appears above other elements
    // bubbleContainer.style.width = '100%';
    // document.body.appendChild(bubbleContainer); // Append the container to the body

    // Add click event to the search icon
    searchIcon.addEventListener('click', function () {

        // Get the input value
        const inputValue = searchInput.value;

        // API endpoint URL (replace with your actual endpoint)
        const apiUrl = 'http://localhost:5000/api/data';

        // Validate input
        if (!inputValue) {
            alert('Please enter a link!');
            return; // Exit if the input is empty
        }

        // Append the input value as a query parameter
        const fullUrl = `${apiUrl}?link=${encodeURIComponent(inputValue)}`;

        // Send the data to the backend
        fetch(fullUrl, {
            method: 'GET', // Use GET method
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // Handle errors
                }
                showSpeechBubble("Link Posted", "Your link has been sent successfully!"); // Show feedback
                return response.json(); // Parse JSON response
            })
            .then(data => {
                console.log('Success:', data); // Handle success

                // Generate bubbles with API response data
                generateSpeechBubbles([{ 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }, { 'fileName': "filename.txt", 'summary': 'my summary goes here!' }]);
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

        // searchContainer.style.position = 'fixed';
        // searchContainer.style.bottom = '0';
        // searchContainer.style.left = '0';
        // searchContainer.style.right = '0';

        // searchIcon.style.position = 'fixed';
        // searchIcon.style.bottom = '0.7%';
        // searchIcon.style.right = '0.3%';
    });
});

// Function to display a single speech bubble with file name and summary
function showSpeechBubble(fileName, summary) {
    // Create the speech bubble element
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    // bubble.style.display = 'block'; // Make the bubble visible

    bubble.style.display = 'block'; // Ensure it behaves as a block element
    bubble.style.width = '100%'; // Set width after display is block

    // Create file name section
    const fileNameElement = document.createElement('div');
    fileNameElement.className = 'file-name';
    fileNameElement.textContent = `File: ${fileName}`;

    // Create summary section
    const summaryElement = document.createElement('div');
    summaryElement.className = 'summary';
    summaryElement.textContent = `Summary: ${summary}`;

    // bubble.style.width = "100%";

    // Append file name and summary to the bubble
    bubble.appendChild(fileNameElement);
    bubble.appendChild(summaryElement);

    // Append the bubble to the container
    document.querySelector('.bubble-container').appendChild(bubble);
}

// Function to generate speech bubbles with the API response data
// function generateSpeechBubbles(data) {
//     // Check if data is an array and has elements
//     if (Array.isArray(data) && data.length > 0) {
//         let i = 0; // Initialize the index to keep track of bubbles
//         const displayInterval = 1000; // Time interval between displaying bubbles (in milliseconds)

//         function displayBubble() {
//             // Check if all bubbles have been displayed
//             if (i < data.length) {
//                 const item = data[i];
//                 const fileName = item.fileName || 'Unknown File';
//                 const summary = item.summary || 'No Summary Available';

//                 // Show the speech bubble
//                 showSpeechBubble(fileName, summary);

//                 // Increment the index for the next bubble
//                 i++;

//                 // Call the displayBubble function again after the interval
//                 setTimeout(displayBubble, displayInterval);
//             } else {
//                 // Optionally, you can perform an action after all bubbles are displayed
//                 console.log("All bubbles displayed.");
//             }
//         }

//         // Start displaying bubbles
//         displayBubble();
//     } else {
//         showSpeechBubble('No files found', 'No summaries available.');
//     }
// }

function generateSpeechBubbles(data) {
    // Maximum number of bubbles to display
    const maxBubbles = 5;

    // Check if data is an array and has elements
    if (Array.isArray(data) && data.length > 0) {
        let i = 0; // Initialize the index to keep track of bubbles
        const displayInterval = 1000; // Time interval between displaying bubbles (in milliseconds)

        function displayBubble() {
            // Check if all bubbles have been displayed
            if (i < data.length) {
                const item = data[i];
                const fileName = item.fileName || 'Unknown File';
                const summary = item.summary || 'No Summary Available';

                // Show the speech bubble
                showSpeechBubble(fileName, summary);

                // Increment the index for the next bubble
                i++;

                // Remove the oldest bubble if the maximum is exceeded
                if (document.querySelectorAll('.speech-bubble').length > maxBubbles) {
                    const oldestBubble = document.querySelector('.speech-bubble');
                    if (oldestBubble) {
                        oldestBubble.remove(); // Remove the oldest bubble
                    }
                }

                // Call the displayBubble function again after the interval
                setTimeout(displayBubble, displayInterval);
            } else {
                // Optionally, you can perform an action after all bubbles are displayed
                console.log("All bubbles displayed.");
            }
        }

        // Start displaying bubbles
        displayBubble();
    } else {
        showSpeechBubble('No files found', 'No summaries available.');
    }
}
