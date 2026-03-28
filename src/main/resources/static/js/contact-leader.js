// Contact Leader page functionality

document.addEventListener('DOMContentLoaded', () => {
    if (requireAuth()) {
        loadLeaderInfo();
    }
});

// Load leader information
async function loadLeaderInfo() {
    const user = getUser();
    if (!user || !user.id) {
        showAlert(t('contact.userNotFound') || 'User information not found', 'error');
        return;
    }
    
    // Only citizens can access this page
    if (user.role === 'LEADER') {
        showAlert(t('contact.notAuthorized') || 'This page is only for citizens', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }
    
    try {
        // Get user's full info including associated leader
        const response = await apiRequest(`/users/${user.id}`, {
            method: 'GET'
        });
        
        if (response && response.success && response.data) {
            if (response.data.associatedLeader) {
                displayLeaderInfo(response.data.associatedLeader);
            } else {
                document.getElementById('leaderInfo').innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <p style="color: var(--text-muted); margin-bottom: 20px;">
                            ${t('contact.noAssigned') || 'No ward officer is assigned to your area yet.'}
                        </p>
                        <p style="color: var(--text-muted);">
                            ${t('contact.contactOffice') || 'Please contact the Municipal Corporation office for assistance.'}
                        </p>
                    </div>
                `;
            }
        } else {
            showAlert(t('contact.leaderNotFound') || 'Failed to load user information', 'error');
        }
    } catch (error) {
        showAlert(t('contact.loadError') + ' ' + (error.message || 'Unknown error'), 'error');
        console.error('Contact leader error:', error);
    }
}

// Display leader information
function displayLeaderInfo(leader) {
    const leaderContainer = document.getElementById('leaderInfo');
    
    leaderContainer.innerHTML = `
        <div style="display: flex; align-items: start; gap: 30px; flex-wrap: wrap;">
            <div class="leader-picture" style="flex-shrink: 0; width: 100%; max-width: 320px;">
                <img src="${leader.profilePictureUrl || '/images/default-avatar.svg'}" 
                     alt="${leader.name}" 
                     style="width: 100%; max-width: 320px; height: auto; aspect-ratio: 4/5; border-radius: 12px; object-fit: cover; border: 4px solid var(--primary-color); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            </div>
            
            <div style="flex: 1; min-width: 250px;">
                <h2 style="color: var(--primary-color); margin-bottom: 10px;">${leader.name}</h2>
                <p style="color: var(--text-muted); margin-bottom: 25px; font-size: 1.1em;">
                    ${leader.designation || t('contact.leaderDesignation') || 'Ward Officer'}
                </p>
                
                <div style="display: grid; gap: 20px;">
                    <div class="info-item">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">📍</span>
                            <div>
                                <strong style="display: block; margin-bottom: 5px;">${t('contact.ward') || 'Ward Number'}</strong>
                                <span style="color: var(--text-color);">${leader.jurisdiction}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">📱</span>
                            <div>
                                <strong style="display: block; margin-bottom: 5px;">${t('contact.phone') || 'Phone'}</strong>
                                <a href="tel:${leader.phone}" style="color: var(--primary-color); text-decoration: none; font-size: 1.1em;">
                                    ${leader.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">✉️</span>
                            <div>
                                <strong style="display: block; margin-bottom: 5px;">${t('contact.email') || 'Email'}</strong>
                                <a href="mailto:${leader.email}" style="color: var(--primary-color); text-decoration: none;">
                                    ${leader.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: var(--light-bg); border-radius: 8px; border-left: 4px solid var(--primary-color);">
                    <strong style="display: block; margin-bottom: 10px;">📢 ${t('common.note')}:</strong>
                    <p style="color: var(--text-color); line-height: 1.6; margin: 0;">
                        ${t('contact.noteText')}
                    </p>
                </div>
                
                <div style="margin-top: 25px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <a href="tel:${leader.phone}" class="btn btn-secondary">
                        📱 ${t('contact.callNow') || 'Call Now'}
                    </a>
                    <a href="mailto:${leader.email}" class="btn btn-secondary">
                        ✉️ ${t('contact.sendEmail') || 'Send Email'}
                    </a>
                    <a href="my-tickets.html" class="btn btn-secondary">
                        📋 ${t('contact.viewComplaints') || 'View My Complaints'}
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Reload contact page translations when language changes
window.loadContactPage = function() {
    loadLeaderInfo();
};
