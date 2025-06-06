import { isAuthenticated, addAuthHeader, logout, getApiUrl } from './auth-utils.js';

// Check authentication on page load
function checkAuth() {
    if (!isAuthenticated() && !window.location.pathname.includes('/login.html') && !window.location.pathname.includes('/register.html')) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get selected category
            const selectedCategory = button.dataset.category.toLowerCase();
            
            // Filter events
            filterEvents(selectedCategory);
        });
    });
}

// Filter events by category
function filterEvents(category) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const cardCategory = card.querySelector('.event-category').textContent.toLowerCase();
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            // Add animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = null;
        } else {
            card.classList.add('hidden');
        }
    });
}

async function loadEvents() {
    if (!checkAuth()) return;

    try {
        console.log('Fetching events...');
        const apiUrl = await getApiUrl();
        const res = await fetch(`${apiUrl}/api/events`, await addAuthHeader());
        if (res.status === 401) {
            logout();
            return;
        }
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const events = await res.json();
        console.log('Events fetched:', events);

        const container = document.querySelector('.events-grid');
        const template = document.getElementById('event-template');
        container.innerHTML = ''; // Clear existing content

        if (!events || !events.length) {
            container.innerHTML = '<p class="no-events">No events available at the moment.</p>';
            console.log('No events found.');
            return;
        }

        events.forEach(event => {
            const clone = template.content.cloneNode(true);
            
            // Set category with appropriate styling
            const categorySpan = clone.querySelector('.event-category');
            categorySpan.textContent = event.category;
            categorySpan.classList.add(`category-${event.category.toLowerCase()}`);
            
            // Set event details
            clone.querySelector('.event-title').textContent = event.title;
            clone.querySelector('.event-description').textContent = event.description;
            
            // Format date
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            clone.querySelector('.event-date').textContent = formattedDate;
            
            // Format time
            const [hours, minutes] = event.time.split(':');
            const timeDate = new Date();
            timeDate.setHours(hours, minutes);
            const formattedTime = timeDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            clone.querySelector('.event-time').textContent = formattedTime;
            
            // Set location
            clone.querySelector('.event-location').textContent = event.location;
            
            // Add participation handler
            const participateBtn = clone.querySelector('.participate-btn');
            participateBtn.onclick = () => showParticipationForm(event.id);
            
            container.appendChild(clone);
        });

        // Initialize filters after loading events
        initializeFilters();

        console.log('Events rendered successfully.');
    } catch (err) {
        console.error('Error loading events:', err);
        const container = document.querySelector('.events-grid');
        container.innerHTML = '<p class="error">Unable to load events. Please try again later.</p>';
    }
}

// Add logout button to navigation
function addLogoutButton() {
    if (!isAuthenticated()) return;
    
    const nav = document.querySelector('nav');
    if (nav) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'logout-btn';
        logoutBtn.onclick = logout;
        nav.appendChild(logoutBtn);
    }
}

// Show participation form
window.showParticipationForm = async function(eventId) {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Register for Event</h2>
            <form id="participationForm">
                <div class="form-group">
                    <label for="teamName">Team Name</label>
                    <input type="text" id="teamName" required>
                </div>
                <div class="form-group">
                    <label for="teamMembers">Team Members (comma-separated)</label>
                    <textarea id="teamMembers" required></textarea>
                </div>
                <div class="form-group">
                    <label for="additionalInfo">Additional Information</label>
                    <textarea id="additionalInfo"></textarea>
                </div>
                <div class="button-group">
                    <button type="submit">Submit</button>
                    <button type="button" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById('participationForm').onsubmit = async (e) => {
        e.preventDefault();
        
        const teamName = document.getElementById('teamName').value;
        const teamMembers = document.getElementById('teamMembers').value;
        const additionalInfo = document.getElementById('additionalInfo').value;

        try {
            const apiUrl = await getApiUrl();
            const res = await fetch(`${apiUrl}/api/events/${eventId}/participate`, {
                method: 'POST',
                ...await addAuthHeader({
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
                body: JSON.stringify({
                    team_name: teamName,
                    team_members: teamMembers,
                    additional_info: additionalInfo
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to register for event');
            }

            alert('Successfully registered for the event!');
            closeModal();
        } catch (err) {
            alert(err.message);
        }
    };
};

// Close modal
window.closeModal = function() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadEvents();
    addLogoutButton();
});

// Always force dark mode
document.body.dataset.theme = 'dark';

  