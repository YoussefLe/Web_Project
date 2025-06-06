// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Get the authentication token
function getToken() {
    return localStorage.getItem('token');
}

// Set the authentication token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove the authentication token (logout)
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Get the backend API URL
async function getApiUrl() {
    // Try to get the stored API URL first
    const storedUrl = localStorage.getItem('apiUrl');
    if (storedUrl) {
        try {
            const response = await fetch(`${storedUrl}/api/health`);
            if (response.ok) {
                return storedUrl;
            }
        } catch (err) {
            // Server not available at stored URL, remove it
            localStorage.removeItem('apiUrl');
        }
    }

    // Try each port from 3000 to 3010
    const baseUrl = 'http://localhost';
    const startPort = 3000;
    const maxPort = 3010;

    for (let port = startPort; port <= maxPort; port++) {
        try {
            const url = `${baseUrl}:${port}`;
            const response = await fetch(`${url}/api/health`);
            if (response.ok) {
                localStorage.setItem('apiUrl', url);
                return url;
            }
        } catch (err) {
            // Server not available at this port, try next one
            continue;
        }
    }

    throw new Error('No available server found');
}

// Add authentication headers to fetch options
async function addAuthHeader(options = {}) {
    const token = getToken();
    if (!token) return options;

    return {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    };
}

export { isAuthenticated, getToken, setToken, logout, addAuthHeader, getApiUrl }; 