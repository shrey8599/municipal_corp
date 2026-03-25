// My Tickets Page - Show user's complaints with stats
let allTickets = [];

// Load tickets on page load
document.addEventListener('DOMContentLoaded', () => {
    if (requireAuth()) {
        setupTicketsPage();
        loadTickets();
    }
});

// Setup tickets page based on user role
function setupTicketsPage() {
    const user = getUser();
    if (!user) return;
    
    // Hide "File Complaint" elements for leaders
    if (user.role === 'LEADER') {
        const fileBtn = document.getElementById('fileNewBtn');
        if (fileBtn) fileBtn.style.display = 'none';
        
        const newComplaintLink = document.getElementById('newComplaintLink');
        if (newComplaintLink) newComplaintLink.style.display = 'none';
        
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) sectionTitle.textContent = 'Assigned Complaints';
    } else {
        // Show contact leader link for citizens
        const contactLeaderLink = document.getElementById('contactLeaderLink');
        if (contactLeaderLink) contactLeaderLink.style.display = 'list-item';
    }
}

// Load user's tickets
async function loadTickets() {
    const user = getUser();
    if (!user || !user.id) {
        showAlert('User information not found', 'error');
        return;
    }
    
    try {
        let endpoint;
        if (user.role === 'LEADER') {
            endpoint = `/tickets/leader/${user.id}`;
        } else {
            endpoint = `/tickets?userId=${user.id}`;
        }
        
        const response = await apiRequest(endpoint, { method: 'GET' });
        
        if (response.success) {
            allTickets = response.data || [];
            displayTickets(allTickets);
            updateStats(allTickets);
        }
    } catch (error) {
        console.error('Failed to load tickets:', error);
        document.getElementById('ticketsContainer').innerHTML = `
            <div class="loading" style="color: var(--danger-color)">
                Failed to load complaints. Please try again.
            </div>
        `;
    }
}

// Display tickets
function displayTickets(tickets) {
    const container = document.getElementById('ticketsContainer');
    const user = getUser();
    const isLeader = user && user.role === 'LEADER';
    
    if (!tickets || tickets.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <p>No complaints ${isLeader ? 'assigned' : 'yet'}.</p>
                ${!isLeader ? '<a href="create-ticket.html" class="btn btn-primary" style="margin-top: 15px">File Your First Complaint</a>' : ''}
            </div>
        `;
        return;
    }

    // Group tickets by status priority, newest first within each group
    const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    const groups = [
        { label: '🔴 Open', tickets: tickets.filter(t => t.status === 'OPEN' || t.status === 'PENDING').sort(newestFirst) },
        { label: '🟡 In Progress', tickets: tickets.filter(t => t.status === 'IN_PROGRESS').sort(newestFirst) },
        { label: '🟢 Resolved / Closed', tickets: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').sort(newestFirst) },
    ].filter(g => g.tickets.length > 0);

    const renderCard = (ticket) => {
        const leaderActions = isLeader && ticket.status !== 'CLOSED' ? `
            <div class="ticket-actions" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color); display: flex; gap: 8px; flex-wrap: wrap;" onclick="event.stopPropagation()">
                <button class="btn btn-sm btn-warning" onclick="quickUpdateStatus(${ticket.id}, 'IN_PROGRESS')" style="font-size: 0.85em;">
                    ⏳ In Progress
                </button>
                <button class="btn btn-sm btn-success" onclick="quickUpdateStatus(${ticket.id}, 'RESOLVED')" style="font-size: 0.85em;">
                    ✅ Resolved
                </button>
                <button class="btn btn-sm btn-secondary" onclick="showQuickComment(${ticket.id})" style="font-size: 0.85em;">
                    💬 Add Comment
                </button>
                <button class="btn btn-sm btn-primary" onclick="viewTicket(${ticket.id})" style="font-size: 0.85em;">
                    👁️ View Details
                </button>
            </div>
        ` : '';


        
        // Get background color based on status
        let backgroundColor = '';
        if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
            backgroundColor = 'background-color: #d4edda;'; // light pastel green
        } else if (ticket.status === 'IN_PROGRESS') {
            backgroundColor = 'background-color: #fff3cd;'; // pastel yellow
        }
        
        return `
            <div class="ticket-card" ${!isLeader || ticket.status === 'CLOSED' ? `onclick="viewTicket(${ticket.id})"` : ''} style="${backgroundColor} ${isLeader ? 'cursor: default;' : ''}">
                <div class="ticket-header">
                    <span class="ticket-id">${ticket.ticketId}</span>
                    <span class="ticket-status ${getStatusClass(ticket.status)}">${ticket.status.replace('_', ' ')}</span>
                </div>
                <div class="ticket-title">
                    ${getCategoryIcon(ticket.category)} ${ticket.title}
                </div>
                <p style="color: var(--text-muted); margin: 10px 0; font-size: 0.95em;">
                    ${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}
                </p>
                <div class="ticket-meta" style="align-items: center;" onclick="event.stopPropagation()">
                    <span>📅 ${formatDate(ticket.createdAt)}</span>
                    <span>📍 ${ticket.category.replace('_', ' ')}</span>
                    ${ticket.citizen ? `<span>👤 ${ticket.citizen.name}</span>` : ''}
                    ${isLeader && ticket.citizen && ticket.citizen.phone ? `<a href="tel:${ticket.citizen.phone}" onclick="event.stopPropagation()" style="font-size:0.82em; padding:3px 10px; background:#17a2b8; color:white; text-decoration:none; border-radius:4px; font-weight:500; white-space:nowrap;">📞 Call Now</a>` : ''}
                    ${isLeader && ticket.citizen && ticket.citizen.email ? `<a href="mailto:${ticket.citizen.email}" onclick="event.stopPropagation()" style="font-size:0.82em; padding:3px 10px; background:#28a745; color:white; text-decoration:none; border-radius:4px; font-weight:500; white-space:nowrap;">✉️ Email Now</a>` : ''}
                </div>
                ${leaderActions}
            </div>
        `;
    };

    container.innerHTML = groups.map(group => `
        <div class="ticket-group" style="margin-bottom: 24px;">
            <div class="ticket-group-header" style="font-size: 1em; font-weight: 600; color: var(--text-muted); padding: 6px 0 10px 2px; border-bottom: 1px solid var(--border-color); margin-bottom: 12px; letter-spacing: 0.02em;">
                ${group.label} <span style="font-weight: 400; font-size: 0.9em;">(${group.tickets.length})</span>
            </div>
            ${group.tickets.map(renderCard).join('')}
        </div>
    `).join('');
}

// Update stats
function updateStats(tickets) {
    const stats = {
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
        total: tickets.length
    };
    
    document.getElementById('openCount').textContent = stats.open;
    document.getElementById('inProgressCount').textContent = stats.inProgress;
    document.getElementById('resolvedCount').textContent = stats.resolved;
    document.getElementById('totalCount').textContent = stats.total;
}

// View ticket
function viewTicket(ticketId) {
    window.location.href = `ticket-details.html?id=${ticketId}`;
}

// Helper functions from dashboard.js - Quick status update
async function quickUpdateStatus(ticketId, newStatus) {
    if (newStatus === 'RESOLVED') {
        showResolutionModal(ticketId);
        return;
    }
    
    if (!confirm(`Update ticket status to ${newStatus.replace('_', ' ')}?`)) {
        return;
    }
    
    try {
        await apiRequest(`/tickets/${ticketId}/status?status=${newStatus}`, { method: 'PATCH' });
        showAlert(`Ticket status updated to ${newStatus.replace('_', ' ')}`, 'success');
        loadTickets();
    } catch (error) {
        showAlert('Failed to update status: ' + error.message, 'error');
    }
}

// Show resolution modal
function showResolutionModal(ticketId) {
    const modal = document.createElement('div');
    modal.id = 'resolutionModal';
    modal.style.cssText = `
        display: flex; position: fixed; top: 0; left: 0;
        width: 100%; height: 100%; background: rgba(0,0,0,0.5);
        justify-content: center; align-items: center; z-index: 10000;
    `;
    modal.innerHTML = `
        <div style="max-width: 500px; background: white; padding: 30px; border-radius: 10px;">
            <h2>Mark as Resolved</h2>
            <p style="color: #666; margin: 10px 0 15px;">Add an optional resolution note:</p>
            <textarea id="resolutionNote" rows="4" placeholder="Resolution details (optional)..." 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
                <button class="btn btn-secondary" onclick="closeResolutionModal()">Cancel</button>
                <button class="btn btn-success" onclick="resolveWithoutNote(${ticketId})">Resolve Without Note</button>
                <button class="btn btn-primary" onclick="resolveWithNote(${ticketId})">Add Note & Resolve</button>
            </div>
        </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) closeResolutionModal(); };
    document.body.appendChild(modal);
}

function closeResolutionModal() {
    document.getElementById('resolutionModal')?.remove();
}

async function resolveWithoutNote(ticketId) {
    closeResolutionModal();
    try {
        await apiRequest(`/tickets/${ticketId}/status?status=RESOLVED`, { method: 'PATCH' });
        showAlert('Ticket marked as resolved', 'success');
        loadTickets();
    } catch (error) {
        showAlert('Failed to resolve ticket', 'error');
    }
}

async function resolveWithNote(ticketId) {
    const note = document.getElementById('resolutionNote').value.trim();
    if (!note) {
        showAlert('Please enter a note or use "Resolve Without Note"', 'error');
        return;
    }
    closeResolutionModal();
    try {
        await apiRequest(`/tickets/${ticketId}/status?status=RESOLVED&resolutionNote=${encodeURIComponent(note)}`, { method: 'PATCH' });
        showAlert('Ticket marked as resolved with note', 'success');
        loadTickets();
    } catch (error) {
        showAlert('Failed to resolve ticket', 'error');
    }
}

// Show quick comment modal
function showQuickComment(ticketId) {
    const modal = document.createElement('div');
    modal.className = 'quick-comment-modal';
    modal.style.cssText = `
        display: flex; position: fixed; top: 0; left: 0;
        width: 100%; height: 100%; background: rgba(0,0,0,0.5);
        justify-content: center; align-items: center; z-index: 10000;
    `;
    modal.innerHTML = `
        <div class="modal-content-inner" style="max-width: 500px; background: white; padding: 30px; border-radius: 10px;" onclick="event.stopPropagation()">
            <h2>Add Comment</h2>
            <textarea id="quickCommentText" rows="4" required placeholder="Enter your comment..."
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 15px 0;"></textarea>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="closeQuickCommentModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitQuickComment(${ticketId})">Submit</button>
            </div>
        </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) closeQuickCommentModal(); };
    document.body.appendChild(modal);
}

function closeQuickCommentModal() {
    const modal = document.querySelector('.quick-comment-modal');
    if (modal) {
        modal.remove();
    }
}

async function submitQuickComment(ticketId) {
    const user = getUser();
    const comment = document.getElementById('quickCommentText')?.value.trim();
    
    if (!comment) {
        showAlert('Comment cannot be empty', 'error');
        return;
    }
    
    try {
        await apiRequest(`/tickets/${ticketId}/comments?userId=${user.id}&role=${user.role}`, {
            method: 'POST',
            body: JSON.stringify({ comment })
        });
        showAlert('Comment added successfully', 'success');
        closeQuickCommentModal();
        loadTickets();
    } catch (error) {
        showAlert('Failed to add comment', 'error');
    }
}

// Get status class
function getStatusClass(status) {
    switch(status) {
        case 'OPEN': return 'status-open';
        case 'IN_PROGRESS': return 'status-progress';
        case 'RESOLVED': return 'status-resolved';
        case 'CLOSED': return 'status-closed';
        default: return '';
    }
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'ROAD_MAINTENANCE': '🛣️',
        'STREET_LIGHTS': '💡',
        'GARBAGE_COLLECTION': '🗑️',
        'WATER_SUPPLY': '💧',
        'DRAINAGE': '🚰',
        'PARKS_GARDENS': '🌳',
        'OTHER': '📋'
    };
    return icons[category] || '📋';
}
