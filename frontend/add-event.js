import { getApiUrl, addAuthHeader, logout } from './auth-utils.js';

// Get form elements
const form = document.getElementById('addEventForm');
const preview = {
    title: document.querySelector('.form-preview .event-title'),
    description: document.querySelector('.form-preview .event-description'),
    category: document.querySelector('.form-preview .event-category'),
    date: document.querySelector('.form-preview .event-date'),
    time: document.querySelector('.form-preview .event-time'),
    location: document.querySelector('.form-preview .event-location')
};

// Live preview updates
document.getElementById('title').addEventListener('input', (e) => {
    preview.title.textContent = e.target.value || 'Event Title Preview';
});

document.getElementById('description').addEventListener('input', (e) => {
    preview.description.textContent = e.target.value || 'Event description preview...';
});

document.getElementById('category').addEventListener('change', (e) => {
    const category = e.target.value;
    preview.category.textContent = category;
    preview.category.className = 'event-category';
    if (category) {
        preview.category.classList.add(`category-${category.toLowerCase()}`);
    }
});

document.getElementById('date').addEventListener('input', (e) => {
    const date = new Date(e.target.value);
    preview.date.textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

document.getElementById('time').addEventListener('input', (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const time = new Date();
    time.setHours(hours, minutes);
    preview.time.textContent = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
});

document.getElementById('location').addEventListener('input', (e) => {
    preview.location.textContent = e.target.value || 'Location preview';
});

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Show error message
function showError(inputElement, message) {
    // Remove any existing error
    removeError(inputElement);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    inputElement.parentElement.appendChild(errorDiv);
    inputElement.style.borderColor = '#ff4757';
}

// Remove error message
function removeError(inputElement) {
    const errorDiv = inputElement.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    inputElement.style.borderColor = '';
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        category: formData.get('category')
    };
    
    try {
        const apiUrl = await getApiUrl();
        const response = await fetch(`${apiUrl}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(await addAuthHeader()).headers
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.status === 401) {
            logout();
            return;
        }
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to create event');
        }
        
        showSuccess('Event created successfully!');
        
        // Reset form
        form.reset();
        
        // Reset preview
        preview.title.textContent = 'Event Title Preview';
        preview.description.textContent = 'Event description preview...';
        preview.category.textContent = '';
        preview.category.className = 'event-category';
        preview.date.textContent = 'Date preview';
        preview.time.textContent = 'Time preview';
        preview.location.textContent = 'Location preview';
        
        // Redirect to events page after a short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        showError(form.querySelector('#title'), error.message);
    }
}); 