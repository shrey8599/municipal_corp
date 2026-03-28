// Ticket details functionality
let currentTicket = null;

// Image viewer functions
function viewImage(imageUrl) {
    const modal = document.getElementById('imageViewerModal');
    const viewerImage = document.getElementById('viewerImage');
    if (modal && viewerImage) {
        viewerImage.src = imageUrl;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close viewer on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageViewer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (requireAuth()) {
        setupPageForRole();
        loadTicketDetails();
    }
});

// Setup page based on user role
function setupPageForRole() {
    const user = getUser();
    if (user && user.role === 'LEADER') {
        const newComplaintLink = document.getElementById('newComplaintLink');
        if (newComplaintLink) newComplaintLink.style.display = 'none';
    } else {
        // Show contact leader link for citizens
        const contactLeaderLink = document.getElementById('contactLeaderLink');
        if (contactLeaderLink) contactLeaderLink.style.display = 'list-item';
    }
}

// Load ticket details
async function loadTicketDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    
    if (!ticketId) {
        showAlert(t('ticketDetails.ticketIdNotFound'), 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }
    
    try {
        const response = await apiRequest(`/tickets/${ticketId}`, {
            method: 'GET'
        });
        
        if (response.success) {
            currentTicket = response.data;
            displayTicketDetails(currentTicket);
            loadComments(ticketId);
        }
    } catch (error) {
        showAlert(t('ticketDetails.failedToLoad'), 'error');
        console.error(error);
    }
}

// Display ticket details
function displayTicketDetails(ticket) {
    const user = getUser();
    const isLeader = user && user.role === 'LEADER';
    
    // Header
    document.getElementById('ticketHeader').innerHTML = `
        <div style="margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div>
                    <h1 style="color: var(--primary-color); margin-bottom: 5px;">${ticket.title}</h1>
                    <p style="color: var(--text-muted);">${ticket.ticketId}</p>
                </div>
                <span class="ticket-status ${getStatusClass(ticket.status)}" style="font-size: 1.1em;">
                    ${getStatusTranslation(ticket.status)}
                </span>
            </div>
        </div>
    `;
    
    // Images
    if (ticket.imageUrls && ticket.imageUrls.length > 0) {
        document.getElementById('ticketImages').innerHTML = `
            <div class="preview-container">
                ${ticket.imageUrls.map(url => `
                    <div class="preview-item">
                        <img src="${url}" alt="Ticket image" onclick="viewImage('${url}')" style="cursor: pointer;">
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Info
    const infoBg = (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED')
        ? 'background-color: #d4edda;'
        : ticket.status === 'IN_PROGRESS'
            ? 'background-color: #fff3cd;'
            : '';
    document.getElementById('ticketInfo').innerHTML = `
        <div class="section" style="${infoBg}">
            <h3 style="color: var(--primary-color); margin-bottom: 15px;">${t('ticketDetails.title')}</h3>
            <div style="display: grid; gap: 15px;">
                <div>
                    <strong>${t('ticketDetails.category')}:</strong> 
                    ${getCategoryIcon(ticket.category)} ${ticket.category.replace('_', ' ')}
                </div>
                <div>
                    <strong>${t('ticketDetails.type')}:</strong> ${ticket.type}
                </div>
                <div>
                    <strong>${t('ticketDetails.status')}:</strong> ${getStatusTranslation(ticket.status)}
                </div>
                <div>
                    <strong>${t('ticketDetails.filedBy')}:</strong> ${ticket.citizen.name}
                </div>
                ${isLeader ? `
                    <div style="margin-top: 5px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <strong>${t('ticketDetails.contactCitizen')}:</strong>
                        ${ticket.citizen.phone ? `<a href="tel:${ticket.citizen.phone}" style="padding:5px 14px; background:#17a2b8; color:white; text-decoration:none; border-radius:5px; font-size:0.9em; font-weight:500;">📞 ${t('ticketDetails.callNow')}</a>` : '<span style="color:var(--text-muted); font-size:0.9em;">${t(\'ticketDetails.noPhone\')}</span>'}
                        ${ticket.citizen.email ? `<a href="mailto:${ticket.citizen.email}" style="padding:5px 14px; background:#28a745; color:white; text-decoration:none; border-radius:5px; font-size:0.9em; font-weight:500;">✉️ ${t('ticketDetails.emailNow')}</a>` : '<span style="color:var(--text-muted); font-size:0.9em;">${t(\'ticketDetails.noEmail\')}</span>'}
                    </div>
                    <div style="${ticket.citizen.address ? 'margin: 12px 0;' : ''}">
                        <strong>📍 Address:</strong> ${ticket.citizen.address ? ticket.citizen.address : '<span style="color:var(--text-muted);">Not provided</span>'}
                    </div>
                ` : ''}
                ${ticket.assignedLeader ? `
                    <div>
                        <strong>${t('ticketDetails.assignedTo')}:</strong> ${ticket.assignedLeader.name} (${ticket.assignedLeader.jurisdiction})
                    </div>
                ` : ''}
                <div>
                    <strong>${t('ticketDetails.created')}:</strong> ${formatDate(ticket.createdAt)}
                </div>
                <div>
                    <strong>${t('ticketDetails.lastUpdated')}:</strong> ${formatDate(ticket.updatedAt)}
                </div>
                ${ticket.closedAt ? `
                    <div>
                        <strong>${t('ticketDetails.closed')}:</strong> ${formatDate(ticket.closedAt)}
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: var(--light-bg); border-radius: 8px;">
                <strong>${t('ticketDetails.description')}:</strong>
                <p style="margin-top: 10px; line-height: 1.6;">${ticket.description}</p>
            </div>
            
            ${ticket.resolutionNote ? `
                <div style="margin-top: 15px; padding: 15px; background: #d4edda; border-radius: 8px; border-left: 4px solid var(--success-color);">
                    <strong>${t('ticketDetails.resolutionNote')}:</strong>
                    <p style="margin-top: 10px; line-height: 1.6;">${ticket.resolutionNote}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    // Show leader actions if user is a leader and ticket is not closed
    if (isLeader && ticket.status !== 'CLOSED') {
        document.getElementById('leaderActions').style.display = 'block';
    }
}

// Load comments
async function loadComments(ticketId) {
    try {
        const response = await apiRequest(`/tickets/${ticketId}/comments`, {
            method: 'GET'
        });
        
        const commentsContainer = document.getElementById('commentsContainer');
        
        if (response.success && response.data && response.data.length > 0) {
            commentsContainer.innerHTML = response.data.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">👤 ${comment.commenterName}</span>
                        <span class="comment-date">${formatDate(comment.createdAt)}</span>
                    </div>
                    <p style="color: var(--text-color); line-height: 1.6;">${comment.comment}</p>
                </div>
            `).join('');
        } else {
            commentsContainer.innerHTML = `
                <p style="text-align: center; color: var(--text-muted); padding: 20px;">
                    ${t('ticketDetails.noComments')}
                </p>
            `;
        }
    } catch (error) {
        console.error('Failed to load comments:', error);
    }
}

// Submit comment
document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = getUser();
    const commentText = document.getElementById('commentText').value;
    
    if (!currentTicket || !user) {
        showAlert(t('ticketDetails.unableToAddComment'), 'error');
        return;
    }
    
    try {
        const response = await apiRequest(`/tickets/${currentTicket.id}/comments?userId=${user.id}&role=${user.role}`, {
            method: 'POST',
            body: JSON.stringify({ comment: commentText })
        });
        
        if (response.success) {
            showAlert(t('ticketDetails.commentAdded'), 'success');
            document.getElementById('commentText').value = '';
            loadComments(currentTicket.id);
        }
    } catch (error) {
        showAlert(error.message || t('ticketDetails.commentFailed'), 'error');
    }
});

// Update ticket status (for leaders)
async function updateStatus(newStatus) {
    if (!currentTicket) {
        showAlert(t('ticketDetails.noTicketLoaded'), 'error');
        return;
    }
    
    // If status is RESOLVED, show resolution note modal
    if (newStatus === 'RESOLVED') {
        showResolutionModal(currentTicket.id);
        return;
    }
    
    if (!confirm(`${t('ticketDetails.confirmStatusUpdate')} ${t('status.' + newStatus.toLowerCase())}?`)) {
        return;
    }
    
    try {
        const response = await apiRequest(`/tickets/${currentTicket.id}/status?status=${newStatus}`, {
            method: 'PATCH'
        });
        
        if (response.success) {
            showAlert(t('ticketDetails.statusUpdated'), 'success');
            loadTicketDetails(); // Reload details
        }
    } catch (error) {
        showAlert(error.message || t('ticketDetails.statusUpdateFailed'), 'error');
    }
}

// Show resolution note modal
function showResolutionModal(ticketId) {
    const modal = document.createElement('div');
    modal.id = 'resolutionModal';
    modal.className = 'modal';
    modal.style.cssText = `
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
            <h2>${t('ticketDetails.markAsResolved')}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 15px;">You can optionally add a resolution note to provide details about how the issue was resolved.</p>
            <div class="form-group">
                <label for="resolutionNoteModal">${t('ticketDetails.resolutionNoteOptional')}</label>
                <textarea 
                    id="resolutionNoteModal" 
                    name="resolutionNote" 
                    rows="4" 
                    placeholder="${t('ticketDetails.enterResolutionDetails')}"
                    style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 5px;"
                ></textarea>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
                <button type="button" class="btn btn-secondary" onclick="closeResolutionModal()">${t('ticketDetails.cancel')}</button>
                <button type="button" class="btn btn-success" onclick="resolveWithoutNote(${ticketId})">${t('ticketDetails.resolveWithoutNote')}</button>
                <button type="button" class="btn btn-primary" onclick="resolveWithNote(${ticketId})">${t('ticketDetails.addNoteResolve')}</button>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.onclick = () => closeResolutionModal();
    
    document.body.appendChild(modal);
    document.getElementById('resolutionNoteModal').focus();
}

// Close resolution modal
function closeResolutionModal() {
    const modal = document.getElementById('resolutionModal');
    if (modal) {
        modal.remove();
    }
}

// Resolve without note
async function resolveWithoutNote(ticketId) {
    closeResolutionModal();
    
    try {
        const response = await apiRequest(`/tickets/${ticketId}/status?status=RESOLVED`, {
            method: 'PATCH'
        });
        
        if (response.success) {
            showAlert(t('ticketDetails.markedAsResolved'), 'success');
            loadTicketDetails();
        }
    } catch (error) {
        showAlert(error.message || t('ticketDetails.failedToResolve'), 'error');
    }
}

// Resolve with note
async function resolveWithNote(ticketId) {
    const resolutionNote = document.getElementById('resolutionNoteModal').value.trim();
    
    if (!resolutionNote) {
        showAlert(t('ticketDetails.enterResolutionNote'), 'error');
        return;
    }
    
    closeResolutionModal();
    
    try {
        const response = await apiRequest(`/tickets/${ticketId}/status?status=RESOLVED&resolutionNote=${encodeURIComponent(resolutionNote)}`, {
            method: 'PATCH'
        });
        
        if (response.success) {
            showAlert(t('ticketDetails.markedWithNote'), 'success');
            loadTicketDetails();
        }
    } catch (error) {
        showAlert(error.message || t('ticketDetails.failedToResolve'), 'error');
    }
}
