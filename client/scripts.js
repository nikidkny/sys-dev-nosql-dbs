// Global variable to store the last clicked topic path
let lastClickedPath = null;

// Get DOM elements
const cards = document.getElementById('card-list');
const dropdown = document.getElementById('dropdown-content');
const popup = document.getElementById('auth-popup');
const closePopup = document.getElementById('close-popup');
const authForm = document.getElementById('auth-form');
const toggleAuth = document.getElementById('toggle-auth');
const popupTitle = document.getElementById('popup-title');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const authSubmit = document.getElementById('auth-submit');
const authMessage = document.getElementById('auth-message');
const messageContainer = document.querySelector('.message-container');

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

// Function to fetch topics from the backend and display them
async function fetchTopics() {
  try {
    const query = await fetch('http://localhost:8080/api/v1/topic');
    const topics = await query.json();
    displayTopics(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
}

// Function to display topics as cards and dropdown links
function displayTopics(topics) {
  topics.forEach((topic) => {
    const path = topic.name.toLowerCase().split(' ').join('-');

    // Create the topic card
    const card = document.createElement('li');
    card.className = 'card';

    // Add event listener for topic card click
    card.addEventListener('click', () => handleTopicClick(path));

    card.innerHTML = topic.name;
    cards.appendChild(card);

    // Create the dropdown link
    const link = document.createElement('a');
    link.textContent = topic.name;
    link.href = '#';

    // Add event listener for dropdown link click
    link.addEventListener('click', (e) => {
      e.preventDefault();
      handleTopicClick(path);
    });

    dropdown.appendChild(link);
  });
}

// Function to handle topic card or dropdown click
function handleTopicClick(path) {
  const token = localStorage.getItem('token');
  if (token) {
    // If user is already logged in, navigate to the topic page
    window.open(`pages/${path}/index.html`, '_self');
  } else {
    // Show login popup if the user is not logged in
    popup.style.display = 'block';
    lastClickedPath = path; // Store the clicked path
  }
}

// Function to display messages (error/success)
function showMessage(message, type = 'error') {
  messageContainer.style.display = 'flex';
  authMessage.style.display = 'block';
  authMessage.textContent = message;
  authMessage.style.color = type === 'error' ? 'red' : 'green';
}

// Function to hide messages
function hideMessage() {
  messageContainer.style.display = 'none';
  authMessage.style.display = 'none';
  authMessage.textContent = '';
}

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Password validation function (must contain one number, one capital letter, and one special character)
function validatePassword(password) {
  const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;
  return re.test(password);
}

// Close the popup when the close button is clicked
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});
/*// close popup when clicking outside the popup
window.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
  }
});*/

// Toggle between login and signup
toggleAuth.addEventListener('click', (e) => {
  e.preventDefault();
  hideMessage();
  // Change the popup title and form fields
  if (popupTitle.textContent === 'Login') {
    // Switch to Sign Up
    popupTitle.textContent = 'Sign Up';
    nameInput.style.display = 'flex';
    authSubmit.textContent = 'Sign Up';
    toggleAuth.innerHTML = 'Already have an account? <a href="#">Login</a>';
  } else {
    // Switch to Login
    popupTitle.textContent = 'Login';
    nameInput.style.display = 'none';
    authSubmit.textContent = 'Login';
    toggleAuth.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
  }
});

// Reset the popup form fields
function resetPopup() {
  // Reset popup to its initial state
  popupTitle.textContent = 'Login';
  nameInput.style.display = 'none';
  emailInput.style.display = 'flex';
  passwordInput.style.display = 'flex';
  authSubmit.style.display = 'block';
  authSubmit.textContent = 'Login';
  toggleAuth.style.display = 'block';
  toggleAuth.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
  // Clear any error/success messages
  hideMessage();

  // Clear the input fields
  authForm.email.value = '';
  authForm.password.value = '';
  authForm.name.value = '';
}

// Handle form submission (login/signup)
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();

  const action = popupTitle.textContent.toLowerCase(); // 'login' or 'sign up'
  const email = authForm.email.value;
  const password = authForm.password.value;
  const name = authForm.name.value;
  // Input validation
  if (!validateEmail(email)) {
    showMessage('Please enter a valid email.', 'error');
    return;
  }
  if (!validatePassword(password)) {
    showMessage(
      'Password must be at least 8 characters long and needs to contain a capital letter, a number, and a special character.',
      'error',
    );
    return;
  }
  const data = {
    action: action === 'sign up' ? 'signup' : 'login',
    email: email,
    password: password,
    ...(action === 'sign up' && { name: name }),
  };

  try {
    const response = await fetch('http://127.0.0.1:8080/api/v1/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Display success message
      const successMessage =
        action === 'sign up' ? 'Account created successfully!' : 'Logged in successfully!';
      showMessage(successMessage, 'success');

      // Store JWT token in localStorage for future requests
      localStorage.setItem('token', result.token);

      // Wait for a while to show the success message before redirecting
      setTimeout(() => {
        popup.style.display = 'none';
        if (lastClickedPath) {
          window.open(`pages/${lastClickedPath}/index.html`, '_self');
        }
        hideMessage();
      }, 1500); // Wait 1.5 seconds before closing the popup

      updateAuthButtons();
    } else {
      // Handle server-side error messages
      showMessage(result.error || 'An error occurred, please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Network error, please try again later.', 'error');
  }
});

// Update the authentication buttons based on login state
function updateAuthButtons() {
  const token = localStorage.getItem('token');
  if (token) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    signupBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
}

// Log out the user
logoutBtn.addEventListener('click', () => {
  // Show the logout message in the popup
  popup.style.display = 'block';
  nameInput.style.display = 'none';
  emailInput.style.display = 'none';
  passwordInput.style.display = 'none';
  authSubmit.style.display = 'none';
  messageContainer.style.display = 'flex';
  popupTitle.textContent = 'Confirmation';
  authMessage.style.display = 'block';
  authMessage.textContent = 'You have been logged out.';
  authMessage.style.color = 'green';
  toggleAuth.style.display = 'none';

  // Remove the token and update button visibility after a delay
  setTimeout(() => {
    localStorage.removeItem('token');
    updateAuthButtons();
    popup.style.display = 'none';
    resetPopup();
  }, 1500);
});

// Show login popup when login button is clicked
loginBtn.addEventListener('click', () => {
  resetPopup();
  popup.style.display = 'block';
  popupTitle.textContent = 'Login';
  nameInput.style.display = 'none';
  authSubmit.textContent = 'Login';
  toggleAuth.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
});

// Show sign up popup when sign up button is clicked
signupBtn.addEventListener('click', () => {
  resetPopup();
  popup.style.display = 'block';
  popupTitle.textContent = 'Sign Up';
  nameInput.style.display = 'flex';
  authSubmit.textContent = 'Sign Up';
  toggleAuth.innerHTML = 'Already have an account? <a href="#">Login</a>';
});

// Fetch and display topics when the page loads
window.onload = () => {
  fetchTopics();
  updateAuthButtons(); // Update button visibility on page load
};
