// Common utility functions and API configuration
// Dynamic API base URL - works with any port
const API_BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
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
    // Handle ISO 8601 format - server sends in UTC
    // Append Z to ensure UTC parsing, then convert to local timezone for display
    let dateStr = dateString;
    if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('-00:')) {
        dateStr = dateString + 'Z'; // Add Z to indicate UTC if not already present
    }
    
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
    }
    
    // Format in local timezone
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    
    return new Intl.DateTimeFormat(undefined, options).format(date);
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
    // Always initialize user display on protected pages
    if (isAuthenticated()) {
        initUserDisplay();
    }
    
    // Initialize hamburger menu toggle
    initHamburgerMenu();
});

// Hamburger Menu Toggle Function
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.dashboard-container');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        if (container) {
            container.classList.toggle('sidebar-open');
        }
    }
}

// Close sidebar when link is clicked
function closeSidebarOnNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            const container = document.querySelector('.dashboard-container');
            if (sidebar) {
                sidebar.classList.remove('mobile-open');
            }
            if (container) {
                container.classList.remove('sidebar-open');
            }
        });
    });
}

// Initialize hamburger menu
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-menu-btn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when links are clicked
    closeSidebarOnNavigation();
    
    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const hamburgerBtn = document.getElementById('hamburger-menu-btn');
        const container = document.querySelector('.dashboard-container');
        
        if (sidebar && hamburgerBtn && window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
                if (container) {
                    container.classList.remove('sidebar-open');
                }
            }
        }
    });
}
