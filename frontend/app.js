import { isAuthenticated, addAuthHeader, logout, getApiUrl } from './auth-utils.js';

// Check authentication on page load
function checkAuth() {
    if (!isAuthenticated() && !window.location.pathname.includes('/login.html') && !window.location.pathname.includes('/register.html')) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
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

        const container = document.getElementById('events-list');
        container.innerHTML = ''; // Clear before adding

        if (!events || !events.length) {
            container.innerHTML = '<p class="no-events">No events available at the moment.</p>';
            console.log('No events found.');
            return;
        }

        events.forEach(event => {
            const article = document.createElement('article');
            article.setAttribute('tabindex', '0');
            article.innerHTML = `
                <img src="assets/${event.image_url || 'default.jpg'}" 
                     alt="${event.title} image" 
                     loading="lazy"
                     onerror="this.src='assets/workshop.jpg'" />
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <p><strong>${event.date}</strong> at <strong>${event.time}</strong></p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <button class="participate-btn" onclick="showParticipationForm(${event.id})">
                        Participate
                    </button>
                </div>
            `;
            container.appendChild(article);
        });

        console.log('Events rendered successfully.');
    } catch (err) {
        console.error('Error loading events:', err);
        const container = document.getElementById('events-list');
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

  