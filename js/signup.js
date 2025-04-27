const { ipcRenderer } = require('electron');

function validateSignupForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');

    // Basic validation for empty fields
    if (email === "" || password === "" || confirmPassword === "") {
        errorMessage.innerText = "All fields are required!";
        errorMessage.style.display = "block";
        return false;
    }

    // Email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        errorMessage.innerText = "Please enter a valid email address!";
        errorMessage.style.display = "block";
        return false;
    }

    // Password length validation
    if (password.length < 6) {
        errorMessage.innerText = "Password must be at least 6 characters long!";
        errorMessage.style.display = "block";
        return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match!";
        errorMessage.style.display = "block";
        return false;
    }

    // If validation passes, send data to the backend via IPC
    ipcRenderer.send('signup-form', { email, password });

    // Clear the error message if everything is fine
    errorMessage.style.display = "none";
    return false; // Prevent the form from submitting in the traditional way
}

// Listen for the signup result and display it
ipcRenderer.on('signup-result', (event, result) => {
    const errorMessage = document.getElementById('error-message');
    if (result.success) {
        alert(result.message);  // Show success message
        document.getElementById('signupForm').reset();  // Reset the form
    } else {
        errorMessage.innerText = result.message;
        errorMessage.style.display = "block";
    }
});
