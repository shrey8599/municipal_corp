// Enhanced Dashboard with Ward Officer Profile and News
let currentUser = null;
let currentLeader = null;
let allNews = [];

// View image in modal
function viewImage(imageUrl) {
    const modal = document.getElementById('imageViewerModal');
    const viewerImage = document.getElementById('viewerImage');
    
    if (modal && viewerImage) {
        viewerImage.src = imageUrl;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close image viewer modal
function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageViewer();
    }
});

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    if (requireAuth()) {
        setupDashboard();
    }
});

// Setup dashboard based on user role
async function setupDashboard() {
    currentUser = getUser();
    if (!currentUser) return;
    
    // Setup UI based on role
    const contactLink = document.getElementById('contactLeaderLink');
    const newComplaintLink = document.getElementById('newComplaintLink');
    const myComplaintsLink = document.getElementById('myComplaintsLink');
    const addNewsBtn = document.getElementById('addNewsBtn');
    
    if (currentUser.role === 'LEADER') {
        console.log('🔧 Setting up dashboard for LEADER');
        
        // Hide citizen-only menu items for leaders
        if (newComplaintLink) {
            newComplaintLink.style.display = 'none';
            newComplaintLink.classList.add('hidden-for-leader');
            console.log('✅ Hidden New Complaint link');
        }
        // Keep My Complaints visible for leaders to see citizen complaints
        if (myComplaintsLink) {
            myComplaintsLink.style.display = 'list-item';
            console.log('✅ My Complaints link visible for leader');
        }
        if (contactLink) {
            contactLink.style.display = 'none';
            contactLink.classList.add('hidden-for-leader');
            contactLink.classList.remove('visible-for-citizen');
            console.log('✅ Hidden Contact Ward Officer link');
        }
        
        // Show Add News button for leaders
        if (addNewsBtn) {
            addNewsBtn.style.setProperty('display', 'block', 'important');
            console.log('✅ Showing Add News button');
        }
        
        // Update news section title for leaders
        const newsTitle = document.querySelector('.news-section-header h2');
        if (newsTitle) newsTitle.textContent = t('dashboard.myUpdates');
        
        // Load leader's own profile
        await loadLeaderProfile(currentUser.id);
        
        // Load only leader's own news
        await loadLeaderNews(currentUser.id);
    } else {
        // Show citizen menu items
        if (newComplaintLink) newComplaintLink.style.display = 'list-item';
        if (myComplaintsLink) myComplaintsLink.style.display = 'list-item';
        if (contactLink) {
            contactLink.classList.add('visible-for-citizen');
            contactLink.classList.remove('hidden-for-leader');
            console.log('Contact Ward Officer link made visible for citizen with class');
        }
        
        // Hide Add News button for citizens
        if (addNewsBtn) {
            addNewsBtn.style.setProperty('display', 'none', 'important');
            console.log('✅ Hidden Add News button for citizen');
        }
        
        // Update news section title for citizens
        const newsTitle = document.querySelector('.news-section-header h2');
        if (newsTitle) newsTitle.textContent = t('dashboard.newsFrom');
        
        // Load associated leader's profile for citizens
        await loadCitizenLeader();
        
        // Load all news for citizens
        await loadNews();
    }
}

// Load citizen's associated leader
async function loadCitizenLeader() {
    try {
        const response = await apiRequest(`/users/${currentUser.id}`, { method: 'GET' });
        if (response.success && response.data.associatedLeader) {
            await loadLeaderProfile(response.data.associatedLeader.id);
        }
    } catch (error) {
        console.error('Failed to load citizen data:', error);
    }
}

// Load leader profile
async function loadLeaderProfile(leaderId) {
    try {
        const response = await apiRequest(`/leaders/${leaderId}`, { method: 'GET' });
        if (response.success) {
            currentLeader = response.data;
            displayLeaderProfile(response.data);
        }
    } catch (error) {
        console.error('Failed to load leader profile:', error);
    }
}

// Display leader profile
function displayLeaderProfile(leader) {
    const section = document.getElementById('leaderProfileSection');
    section.style.display = 'block';
    
    document.getElementById('leaderProfilePic').src = leader.profilePictureUrl || '/images/default-avatar.svg';
    document.getElementById('leaderName').textContent = leader.name;
    document.getElementById('leaderDesignation').textContent = leader.designation || 'Ward Officer';
    document.getElementById('leaderJurisdiction').textContent = leader.jurisdiction;
    document.getElementById('leaderPhone').textContent = leader.phone;
    
    // Show/hide vision statement based on role
    const visionStatement = document.querySelector('.vision-statement');
    if (visionStatement) {
        if (currentUser && currentUser.role === 'LEADER') {
            // Hide vision statement for leaders
            visionStatement.style.display = 'none';
        } else {
            // Show vision statement for citizens
            visionStatement.style.display = 'block';
        }
    }
}

// Load leader's own news
async function loadLeaderNews(leaderId) {
    try {
        const response = await fetch(`/api/news/leader/${leaderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                allNews = result.data || [];
                displayNews(allNews);
            }
        }
    } catch (error) {
        console.error('Failed to load leader news:', error);
        document.getElementById('newsContainer').innerHTML = `
            <div class="loading" style="color: var(--danger-color)">
                Failed to load your updates. Please try again.
            </div>
        `;
    }
}

// Load all news
async function loadNews() {
    try {
        const response = await fetch('/api/news', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                allNews = result.data || [];
                displayNews(allNews);
            }
        }
    } catch (error) {
        console.error('Failed to load news:', error);
        document.getElementById('newsContainer').innerHTML = `
            <div class="loading" style="color: var(--danger-color)">
                Failed to load news. Please try again.
            </div>
        `;
    }
}

// Display news
function displayNews(newsItems) {
    const container = document.getElementById('newsContainer');
    
    if (!newsItems || newsItems.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <p>${t('dashboard.noNews')}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = newsItems.map(news => {
        // Use namespaced storageId: leaders = negative, citizens = positive
        const storageId = currentUser
            ? (currentUser.role === 'LEADER' ? -Number(currentUser.id) : Number(currentUser.id))
            : null;
        const likedIds = (news.likedByUserIds || []).map(id => Number(id));
        const isLiked = storageId !== null && likedIds.includes(storageId);
        const likesCount = news.likesCount || 0;
        const heartIcon = isLiked ? '&#10084;&#65039;' : '&#x1F90D;';
        
        // Handle both old (imageUrl) and new (imageUrls) format
        let imagesHtml = '';
        if (news.imageUrls && news.imageUrls.length > 0) {
            imagesHtml = `
                <div class="news-images-container">
                    ${news.imageUrls.map(url => `
                        <img src="${url}" alt="${news.title}" class="news-image" onclick="viewImage('${url}')" style="cursor: pointer;">
                    `).join('')}
                </div>
            `;
        } else if (news.imageUrl) {
            // Backward compatibility with old single image format
            imagesHtml = `
                <div class="news-images-container">
                    <img src="${news.imageUrl}" alt="${news.title}" class="news-image" onclick="viewImage('${news.imageUrl}')" style="cursor: pointer;">
                </div>
            `;
        }
        
        return `
            <div class="news-card">
                ${imagesHtml}
                <div class="news-content">
                    <div class="news-meta">
                        <span>👤 ${news.author ? news.author.name : 'Ward Officer'}</span>
                        <span>•</span>
                        <span>📅 ${formatDate(news.createdAt)}</span>
                    </div>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-text">${news.content}</p>
                    <div class="news-actions">
                        <button class="like-btn ${isLiked ? 'liked' : ''}" data-news-id="${news.id}" onclick="toggleLike(${news.id})">
                            ${heartIcon} <span>${likesCount}</span> ${likesCount === 1 ? 'Like' : 'Likes'}
                        </button>
                        ${currentUser && currentUser.role === 'LEADER' && news.author && news.author.id === currentUser.id ? `
                            <button class="btn btn-sm btn-danger" onclick="deleteNews(${news.id})" style="margin-left: auto;">
                                🗑️ Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle like on news
async function toggleLike(newsId) {
    if (!currentUser || currentUser.id == null) {
        showAlert('Please login to like news', 'error');
        return;
    }

    const userId = Number(currentUser.id);
    if (!userId || isNaN(userId)) {
        showAlert('Invalid session. Please log out and log in again.', 'error');
        return;
    }

    const role = currentUser.role || 'CITIZEN';
    // Same namespacing as server: leaders = negative, citizens = positive
    const storageId = role === 'LEADER' ? -userId : userId;

    const btn = document.querySelector(`button[data-news-id="${newsId}"]`);
    if (btn) btn.disabled = true;

    try {
        const res = await fetch(`/api/news/${newsId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, role: role })
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            console.error('Like failed:', result);
            showAlert('Failed to update like', 'error');
            return;
        }

        const { isLiked, likesCount } = result.data;

        // Sync the in-memory news array — store storageId so initial render is consistent
        const idx = allNews.findIndex(n => Number(n.id) === Number(newsId));
        if (idx !== -1) {
            allNews[idx].likesCount = likesCount;
            // Rebuild likedByUserIds with storageId reflecting the toggle
            const existing = (allNews[idx].likedByUserIds || []).map(Number).filter(id => id !== storageId);
            if (isLiked) existing.push(storageId);
            allNews[idx].likedByUserIds = existing;
        }

        if (btn) {
            btn.className = `like-btn${isLiked ? ' liked' : ''}`;
            btn.innerHTML = `${isLiked ? '&#10084;&#65039;' : '&#x1F90D;'} <span>${likesCount}</span> ${likesCount === 1 ? 'Like' : 'Likes'}`;
        }
    } catch (err) {
        console.error('Like request error:', err);
        showAlert('Failed to update like', 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// Show add news modal
function showAddNewsModal() {
    const user = getUser();
    if (!user || user.role !== 'LEADER') {
        showAlert('Only ward officers can add news', 'error');
        return;
    }
    document.getElementById('addNewsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close add news modal
function closeAddNewsModal() {
    document.getElementById('addNewsModal').classList.remove('active');
    document.getElementById('addNewsForm').reset();
    document.body.style.overflow = '';
}

// Submit news
async function submitNews(event) {
    event.preventDefault();
    
    const user = getUser();
    if (!user || user.role !== 'LEADER') {
        showAlert('Only ward officers can add news', 'error');
        return;
    }
    
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const imageFiles = document.getElementById('newsImages').files;
    
    let imageUrls = [];
    let uploadErrors = [];
    
    // Upload images if provided
    if (imageFiles && imageFiles.length > 0) {
        console.log(`Starting upload of ${imageFiles.length} file(s)`);
        
        for (let i = 0; i < imageFiles.length; i++) {
            const imageFile = imageFiles[i];
            console.log(`File ${i}: name=${imageFile.name}, size=${imageFile.size}, type=${imageFile.type}`);
            
            // Validate file before upload
            if (imageFile.size === 0) {
                uploadErrors.push(`File ${imageFile.name} is empty`);
                continue;
            }
            
            const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            const fileExtension = imageFile.name.substring(imageFile.name.lastIndexOf('.')).toLowerCase();
            const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            
            // Check if file type is valid by MIME or extension
            const isValidType = validImageTypes.includes(imageFile.type) || validExtensions.includes(fileExtension);
            
            if (!isValidType) {
                console.warn(`Invalid file type: ${imageFile.type} for ${imageFile.name}`);
                uploadErrors.push(`File ${imageFile.name} has invalid type. Expected image (JPEG, PNG, WebP, GIF). Got: ${imageFile.type || 'unknown'}`);
                continue;
            }
            
            const formData = new FormData();
            formData.append('file', imageFile);
            
            try {
                const token = getToken();
                console.log(`Uploading file: ${imageFile.name}`);
                
                const uploadResponse = await fetch('/api/files/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                console.log(`Upload response status: ${uploadResponse.status}`);
                
                const uploadResult = await uploadResponse.json();
                console.log(`Upload result:`, uploadResult);
                
                if (uploadResponse.ok && uploadResult.success) {
                    imageUrls.push(uploadResult.data.url);
                    console.log(`✅ File uploaded successfully: ${uploadResult.data.url}`);
                } else {
                    const errorMsg = uploadResult.message || 'Unknown error';
                    uploadErrors.push(`Upload failed for ${imageFile.name}: ${errorMsg}`);
                    console.error(`Upload failed: ${errorMsg}`);
                }
            } catch (error) {
                const errorMsg = error.message || 'Network error';
                uploadErrors.push(`Network error uploading ${imageFile.name}: ${errorMsg}`);
                console.error('Failed to upload image:', error);
            }
        }
        
        // Show upload errors if any
        if (uploadErrors.length > 0) {
            showAlert(`⚠️ Upload Issues:\n${uploadErrors.join('\n')}`, 'warning');
        }
    }
    
    // Create news
    try {
        const response = await fetch('/api/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                leaderId: currentUser.id,
                title: title,
                content: content,
                imageUrls: imageUrls
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showAlert('News published successfully!', 'success');
                closeAddNewsModal();
                await loadNews();
            }
        } else {
            showAlert('Failed to publish news', 'error');
        }
    } catch (error) {
        console.error('Failed to create news:', error);
        showAlert('Failed to publish news', 'error');
    }
}

// Delete news
async function deleteNews(newsId) {
    if (!confirm('Are you sure you want to delete this news?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/news/${newsId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showAlert('News deleted successfully', 'success');
            await loadNews();
        } else {
            showAlert('Failed to delete news', 'error');
        }
    } catch (error) {
        console.error('Failed to delete news:', error);
        showAlert('Failed to delete news', 'error');
    }
}

// Show My Tickets navigation
function showMyTickets() {
    // Create a separate page or navigate to ticket management
    window.location.href = 'my-tickets.html';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddNewsModal();
    }
});

// Show profile (placeholder)
function showProfile() {
    const user = getUser();
    alert(`Profile\n\nName: ${user.name}\nRole: ${user.role}\nID: ${user.id}`);
}

// Quick update ticket status (for leaders)
async function quickUpdateStatus(ticketId, newStatus) {
    // If status is RESOLVED, show resolution note modal
    if (newStatus === 'RESOLVED') {
        showResolutionModal(ticketId);
        return;
    }
    
    if (!confirm(`Update ticket status to ${newStatus.replace('_', ' ')}?`)) {
        return;
    }
    
    const user = getUser();
    try {
        await apiRequest(`/tickets/${ticketId}/status?status=${newStatus}`, {
            method: 'PATCH'
        });
        showSuccessMessage(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
        loadTickets(); // Refresh the list
    } catch (error) {
        showErrorMessage('Failed to update status: ' + error.message);
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
            <h2>Mark Ticket as Resolved</h2>
            <p style="color: var(--text-secondary); margin-bottom: 15px;">You can optionally add a resolution note to provide details about how the issue was resolved.</p>
            <div class="form-group">
                <label for="resolutionNote">Resolution Note (Optional)</label>
                <textarea 
                    id="resolutionNote" 
                    name="resolutionNote" 
                    rows="4" 
                    placeholder="Enter resolution details (optional)..."
                    style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 5px;"
                ></textarea>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
                <button type="button" class="btn btn-secondary" onclick="closeResolutionModal()">Cancel</button>
                <button type="button" class="btn btn-success" onclick="resolveWithoutNote(${ticketId})">Resolve Without Note</button>
                <button type="button" class="btn btn-primary" onclick="resolveWithNote(${ticketId})">Add Note & Resolve</button>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.onclick = () => closeResolutionModal();
    
    document.body.appendChild(modal);
    document.getElementById('resolutionNote').focus();
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
        await apiRequest(`/tickets/${ticketId}/status?status=RESOLVED`, {
            method: 'PATCH'
        });
        showSuccessMessage('Ticket marked as resolved');
        loadTickets();
    } catch (error) {
        showErrorMessage('Failed to resolve ticket: ' + error.message);
    }
}

// Resolve with note
async function resolveWithNote(ticketId) {
    const resolutionNote = document.getElementById('resolutionNote').value.trim();
    
    if (!resolutionNote) {
        showErrorMessage('Please enter a resolution note or use "Resolve Without Note"');
        return;
    }
    
    closeResolutionModal();
    
    try {
        await apiRequest(`/tickets/${ticketId}/status?status=RESOLVED&resolutionNote=${encodeURIComponent(resolutionNote)}`, {
            method: 'PATCH'
        });
        showSuccessMessage('Ticket marked as resolved with note');
        loadTickets();
    } catch (error) {
        showErrorMessage('Failed to resolve ticket: ' + error.message);
    }
}

// Show quick comment modal
function showQuickComment(ticketId) {
    const modal = document.createElement('div');
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
            <h2>Add Comment</h2>
            <form id="quickCommentForm" onsubmit="submitQuickComment(event, ${ticketId})">
                <div class="form-group">
                    <label for="quickComment">Comment</label>
                    <textarea 
                        id="quickComment" 
                        name="comment" 
                        rows="4" 
                        required 
                        placeholder="Enter your comment here..."
                        style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 5px;"
                    ></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
                    <button type="button" class="btn btn-secondary" onclick="closeQuickCommentModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit Comment</button>
                </div>
            </form>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeQuickCommentModal();
        }
    };
    
    document.body.appendChild(modal);
    document.getElementById('quickComment').focus();
}

// Submit quick comment
async function submitQuickComment(event, ticketId) {
    event.preventDefault();
    
    const user = getUser();
    const comment = document.getElementById('quickComment').value.trim();
    
    if (!comment) {
        showErrorMessage('Comment cannot be empty');
        return;
    }
    
    try {
        await apiRequest(`/tickets/${ticketId}/comments?userId=${user.id}&role=${user.role}`, {
            method: 'POST',
            body: JSON.stringify({ comment })
        });
        
        showSuccessMessage('Comment added successfully');
        closeQuickCommentModal();
        loadTickets(); // Refresh the list
    } catch (error) {
        showErrorMessage('Failed to add comment: ' + error.message);
    }
}

// Close quick comment modal
function closeQuickCommentModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Show success message
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Show error message
function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--danger-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Update dashboard news section translations when language changes
window.updateDashboardNewsTranslations = function() {
    // Update the news section title based on user role
    const newsTitle = document.querySelector('.news-section-header h2');
    if (newsTitle && currentUser) {
        if (currentUser.role === 'LEADER') {
            newsTitle.textContent = t('dashboard.myUpdates');
        } else {
            newsTitle.textContent = t('dashboard.newsFrom');
        }
    }
    
    // Re-display news items to update empty state message
    if (allNews) {
        displayNews(allNews);
    }
};
