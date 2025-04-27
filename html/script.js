const { ipcRenderer } = require('electron');

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting traditionally
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send the email and password to the backend for validation
    ipcRenderer.send('login-attempt', { email, password });

    // Listen for the result from the backend
    ipcRenderer.once('login-result', (event, result) => {
        if (result.success) {
            showModal('Success! Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Redirect to the dashboard
            }, 1500);
        } else {
            showModal('Wrong email or password.');
        }
    });
});

// Function to show modal with a message
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Function to close modal
function closeModal() {
    document.getElementById('modal').style.display = "none";
}
