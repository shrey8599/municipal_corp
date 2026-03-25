// Common utility functions and API configuration
const API_BASE_URL = 'http://localhost:9999/api';
const TOKEN_KEY = 'municipal_token';
const USER_KEY = 'municipal_user';

// Get stored token
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Get stored user
function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Save token and user
function saveAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear auth data
function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Check if user is authenticated
function isAuthenticated() {
    return getToken() !== null;
}

// Logout function
function logout() {
    clearAuth();
    window.location.href = 'index.html';
}

// API request wrapper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format status badge
function getStatusClass(status) {
    const statusMap = {
        'OPEN': 'OPEN',
        'IN_PROGRESS': 'IN_PROGRESS',
        'RESOLVED': 'RESOLVED',
        'CLOSED': 'CLOSED'
    };
    return statusMap[status] || status;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'STREET_LIGHTS': '🔦',
        'ROADS': '🛣️',
        'WATER_SUPPLY': '💧',
        'GARBAGE': '🗑️',
        'SEWAGE': '🚰',
        'PARKS': '🌳',
        'OTHERS': '📋'
    };
    return icons[category] || '📋';
}

// Initialize user display
function initUserDisplay() {
    const user = getUser();
    if (user) {
        const userNameElements = document.querySelectorAll('#userName, #welcomeName');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.name || 'User';
        });
    }
}

// Protect pages that require authentication
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check if page requires authentication
    const currentPage = window.location.pathname.split('/').pop();
    const authPages = ['dashboard.html', 'create-ticket.html', 'ticket-details.html'];
    
    if (authPages.includes(currentPage)) {
        if (!requireAuth()) return;
        initUserDisplay();
    }
});
