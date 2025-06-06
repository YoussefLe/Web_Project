import { setToken, isAuthenticated, getApiUrl } from './auth-utils.js';

// Redirect if already authenticated
if (isAuthenticated() && (window.location.pathname.includes('/login.html') || window.location.pathname.includes('/register.html'))) {
    window.location.href = '/';
}

// Helper function to show error messages
function showError(inputElement, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    inputElement.parentElement.appendChild(errorDiv);
    inputElement.style.borderColor = '#ff4444';
}

// Helper function to remove error messages
function removeError(inputElement) {
    const errorDiv = inputElement.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    inputElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
}

// Helper function to show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const remember = document.getElementById('remember');
        
        // Clear previous errors
        removeError(email);
        removeError(password);
        
        // Validate email
        if (!email.value) {
            showError(email, 'Email is required');
            return;
        }
        
        // Validate password
        if (!password.value) {
            showError(password, 'Password is required');
            return;
        }
        
        try {
            const apiUrl = await getApiUrl();
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                    remember: remember.checked
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store the token using our utility function
            setToken(data.token);
            
            // Show success message
            showSuccess('Login successful!');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
            
        } catch (error) {
            showError(email, error.message);
        }
    });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');
        
        // Clear previous errors
        removeError(name);
        removeError(email);
        removeError(password);
        removeError(confirmPassword);
        
        // Validate name
        if (!name.value) {
            showError(name, 'Name is required');
            return;
        }
        
        // Validate email
        if (!email.value) {
            showError(email, 'Email is required');
            return;
        }
        
        // Validate password
        if (!password.value) {
            showError(password, 'Password is required');
            return;
        }
        
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            return;
        }
        
        // Validate confirm password
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            return;
        }
        
        // Validate terms
        if (!terms.checked) {
            showError(terms, 'You must agree to the Terms & Conditions');
            return;
        }
        
        try {
            const apiUrl = await getApiUrl();
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    password: password.value
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Show success message
            showSuccess('Registration successful! Please login.');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000);
            
        } catch (error) {
            showError(email, error.message);
        }
    });
}

// Toggle password visibility
document.querySelectorAll('input[type="password"]').forEach(input => {
    const icon = document.createElement('i');
    icon.className = 'bx bx-hide password-toggle';
    icon.style.cursor = 'pointer';
    input.parentElement.appendChild(icon);
    
    icon.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'bx bx-show password-toggle';
        } else {
            input.type = 'password';
            icon.className = 'bx bx-hide password-toggle';
        }
    });
}); 