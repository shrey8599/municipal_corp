// Profile Management with Individual Field Editing
// Common functions (apiRequest, getUser, showAlert) are loaded from common.js

let originalData = {};

// Initialize profile page
window.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

// View profile picture in modal
function viewProfilePicture() {
    const profilePic = document.getElementById('profilePic');
    const modal = document.getElementById('imageViewerModal');
    const viewerImage = document.getElementById('viewerImage');
    
    if (profilePic && modal && viewerImage) {
        viewerImage.src = profilePic.src;
        modal.classList.add('active');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Close image viewer modal
function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    if (modal) {
        modal.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageViewer();
    }
});

// Load profile data
async function loadProfile() {
    try {
        const user = getUser();
        if (!user) {
            window.location.href = '/login.html';
            return;
        }
        
        let response;
        if (user.role === 'LEADER') {
            response = await apiRequest(`/leaders/${user.id}`, { method: 'GET' });
        } else {
            response = await apiRequest(`/users/${user.id}`, { method: 'GET' });
        }
        
        if (response.success) {
            originalData = response.data;
            displayProfile(response.data, user.role);
        }
    } catch (error) {
        showAlert(t('profile.loadProfileFailed'), 'error');
    }
}

// Display profile with individual edit buttons
function displayProfile(data, role) {
    const container = document.getElementById('profileFields');
    container.innerHTML = '';
    
    // Update profile header
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profilePic = document.getElementById('profilePic');
    
    if (profileName) profileName.textContent = data.name || 'User';
    if (profileRole) profileRole.textContent = role === 'LEADER' ? `👤 ${data.designation || 'Ward Officer'}` : '👤 Citizen';
    if (profilePic) profilePic.src = data.profilePictureUrl || '/images/default-avatar.svg';
    
    // Name field
    addProfileField(container, 'name', 'Name', data.name, false, role);
    
    // Phone field (with OTP)
    addProfileField(container, 'phone', 'Phone', data.phone, true, role);
    
    // Email field (with OTP)
    addProfileField(container, 'email', 'Email', data.email || 'Not set', true, role);
    
    if (role === 'LEADER') {
        // Leader-specific fields
        addProfileField(container, 'jurisdiction', 'Ward Number', data.jurisdiction, false, role, true); // Read-only
        addProfileField(container, 'designation', 'Designation', data.designation, false, role);
    } else {
        // Citizen-specific fields
        addProfileField(container, 'address', 'Address', data.address, false, role);
        addProfileField(container, 'wardNumber', 'Ward Number', data.wardNumber, false, role, true); // Read-only
    }
}

// Add individual profile field with edit capability
function addProfileField(container, fieldName, label, value, requiresOTP = false, role, readOnly = false) {
    // Get translation key for the label if available
    const labelKey = getTranslationKeyForField(fieldName, role);
    const translatedLabel = labelKey ? t(labelKey) : label;
    
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field-row';
    fieldDiv.id = `field-${fieldName}`;
    
    fieldDiv.innerHTML = `
        <div class="field-display" id="display-${fieldName}">
            <div class="field-label">${translatedLabel}</div>
            <div class="field-value">${value || t('profile.notSet')}</div>
            ${!readOnly ? `
                <button class="btn-icon-edit" onclick="startEditField('${fieldName}', ${requiresOTP})" title="Edit ${translatedLabel}">
                    ✏️
                </button>
            ` : '<span class="read-only-badge">' + t('profile.readOnlyBadge') + '</span>'}
        </div>
        <div class="field-edit" id="edit-${fieldName}" style="display: none;">
            <div class="field-label">${translatedLabel}</div>
            ${fieldName === 'address' ? 
                `<textarea id="input-${fieldName}" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">${value || ''}</textarea>` :
                `<input type="${fieldName === 'email' ? 'email' : 'text'}" id="input-${fieldName}" value="${value || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />`
            }
            <div class="field-actions">
                <button class="btn btn-primary btn-sm" onclick="saveField('${fieldName}', ${requiresOTP}, '${role}')">
                    💾 ${t('profile.saveButton')}
                </button>
                <button class="btn btn-secondary btn-sm" onclick="cancelEditField('${fieldName}')">
                    ${t('profile.cancelButton')}
                </button>
            </div>
            ${requiresOTP ? '<small style="color: #666;">⚠️ ' + t('profile.changeWarning') + '</small>' : ''}
        </div>
    `;
    
    container.appendChild(fieldDiv);
}

// Helper function to get translation key for field names
function getTranslationKeyForField(fieldName, role) {
    const keyMap = {
        'name': 'profile.fieldName',
        'phone': 'profile.fieldPhone',
        'email': 'profile.fieldEmail',
        'address': 'profile.fieldAddress',
        'wardNumber': 'profile.fieldWardNumber',
        'designation': 'profile.fieldDesignation',
        'jurisdiction': 'profile.fieldJurisdiction',
    };
    return keyMap[fieldName] || null;
}

// Start editing a field
window.startEditField = function(fieldName, requiresOTP) {
    document.getElementById(`display-${fieldName}`).style.display = 'none';
    document.getElementById(`edit-${fieldName}`).style.display = 'block';
    document.getElementById(`input-${fieldName}`).focus();
};

// Cancel field edit
window.cancelEditField = function(fieldName) {
    const originalValue = originalData[fieldName] || '';
    document.getElementById(`input-${fieldName}`).value = originalValue;
    document.getElementById(`display-${fieldName}`).style.display = 'flex';
    document.getElementById(`edit-${fieldName}`).style.display = 'none';
};

// Save individual field
window.saveField = async function(fieldName, requiresOTP, role) {
    const newValue = document.getElementById(`input-${fieldName}`).value.trim();
    const oldValue = originalData[fieldName];
    
    if (!newValue) {
        showAlert(`${t(getTranslationKeyForField(fieldName, role) || 'field')} ${t('profile.emptyFieldError')}`, 'error');
        return;
    }
    
    if (newValue === oldValue) {
        cancelEditField(fieldName);
        return;
    }
    
    // If phone or email, require OTP verification
    if (requiresOTP && (fieldName === 'phone' || fieldName === 'email')) {
        showOTPVerificationModal(fieldName, newValue, role);
    } else {
        // Update non-sensitive field directly
        await updateSingleField(fieldName, newValue, role);
    }
};

// Update single field
async function updateSingleField(fieldName, newValue, role) {
    try {
        const user = getUser();
        const updateData = { ...originalData, [fieldName]: newValue };
        
        let endpoint = role === 'LEADER' ? `/leaders/${user.id}` : `/users/${user.id}`;
        
        const response = await apiRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
        
        if (response.success) {
            const fieldKey = getTranslationKeyForField(fieldName, role);
            const fieldLabel = fieldKey ? t(fieldKey) : fieldName;
            showAlert(`${fieldLabel} ${t('profile.updateSuccess')}`, 'success');
            originalData[fieldName] = newValue;
            
            // Update display
            document.getElementById(`display-${fieldName}`).querySelector('.field-value').textContent = newValue;
            
            // Update localStorage FIRST so other functions can read the new value
            const currentUser = getUser();
            if (currentUser) {
                currentUser[fieldName] = newValue;
                localStorage.setItem('municipal_user', JSON.stringify(currentUser));
                console.log(`✅ Updated ${fieldName} in localStorage:`, newValue);
            }
            
            // Update profile header name when name is changed
            if (fieldName === 'name') {
                const profileName = document.getElementById('profileName');
                if (profileName) {
                    profileName.textContent = newValue;
                    console.log('✅ Updated profileName:', newValue);
                }
                
                // Update main header name immediately on current page
                const userNameElements = document.querySelectorAll('#userName, #welcomeName, .user-name');
                console.log('Found userName elements:', userNameElements.length);
                userNameElements.forEach((el, index) => {
                    if (el) {
                        el.textContent = newValue;
                        console.log(`✅ Updated element ${index} (${el.id || el.className}):`, newValue);
                    }
                });
                
                // Force a re-render by triggering initUserDisplay if available
                if (typeof initUserDisplay === 'function') {
                    initUserDisplay();
                    console.log('✅ Called initUserDisplay()');
                }
            }
            
            // Update header if designation was changed
            if (fieldName === 'designation' && role === 'LEADER') {
                const profileRole = document.getElementById('profileRole');
                if (profileRole) profileRole.textContent = `👤 ${newValue}`;
            }
            
            cancelEditField(fieldName);
        }
    } catch (error) {
        const fieldKey = getTranslationKeyForField(fieldName, role);
        const fieldLabel = fieldKey ? t(fieldKey) : fieldName;
        showAlert(error.message || `${t('profile.updateFailed')} ${fieldLabel}`, 'error');
    }
}

// Show OTP verification modal
function showOTPVerificationModal(fieldName, newValue, role) {
    const fieldLabel = fieldName === 'phone' ? t('profile.fieldPhone') : t('profile.fieldEmail');
    const otpTargetLabel = fieldName === 'phone' ? t('profile.fieldEmail') : t('profile.fieldPhone');

    // Security: OTP goes to the EXISTING opposite contact, not the new value
    // Changing phone → OTP sent to existing email
    // Changing email → OTP sent to existing phone
    const otpTarget = fieldName === 'phone' ? originalData.email : originalData.phone;

    if (!otpTarget || otpTarget === t('profile.notSet')) {
        showAlert(`${t('profile.verifyOTPModal')}: ${t('profile.notSet')} ${otpTargetLabel}`, 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <h2>🔐 ${t('profile.verifyOTPModal')}</h2>
            <p style="margin: 15px 0; color: #555;">
                ${t('profile.changeWarning')}:<br>
                <strong style="color: #1976d2; font-size: 18px;">${newValue}</strong>
            </p>
            <p style="margin-bottom: 15px; color: #555;">
                ${t('profile.notSet')} ${otpTargetLabel}:<br>
                <strong style="color: #2A9D8F;">${otpTarget}</strong>
            </p>
            
            <div id="otpSteps">
                <!-- Step 1: Send OTP -->
                <div id="sendOTPStep">
                    <p style="margin-bottom: 15px; color: #666;">${t('profile.sendOTPButton')}</p>
                    <button onclick="sendFieldOTP('${otpTarget}')" class="btn btn-primary btn-block" style="width: 100%;">
                        📩 ${t('profile.sendOTPButton')} ${otpTarget}
                    </button>
                </div>
                
                <!-- Step 2: Verify OTP -->
                <div id="verifyOTPStep" style="display: none;">
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">${t('profile.verifyButton')}:</label>
                        <input type="text" id="otpInput" maxlength="6" placeholder="000000" 
                               style="width: 100%; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 8px; font-weight: bold; border: 2px solid #ddd; border-radius: 4px;">
                    </div>
                    <button onclick="verifyFieldOTP('${fieldName}', '${newValue}', '${role}', '${otpTarget}')" 
                            class="btn btn-primary btn-block" style="width: 100%; margin-top: 15px;">
                        ✓ ${t('profile.verifyButton')}
                    </button>
                    <button onclick="sendFieldOTP('${otpTarget}')" 
                            class="btn btn-secondary btn-block" style="width: 100%; margin-top: 10px;">
                        🔄 ${t('profile.resendOTPButton')}
                    </button>
                </div>
            </div>
            
            <button onclick="closeOTPModal(); cancelEditField('${fieldName}')" 
                    class="btn btn-secondary btn-block" style="width: 100%; margin-top: 15px;">
                ✕ ${t('profile.cancelButton')}
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOTPModal();
            cancelEditField(fieldName);
        }
    });
}

// Send OTP for field verification
window.sendFieldOTP = async function(identifier) {
    try {
        const user = getUser();
        const response = await apiRequest('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ 
                identifier: identifier,
                role: user.role || 'CITIZEN'
            })
        });
        
        if (response.success) {
            document.getElementById('sendOTPStep').style.display = 'none';
            document.getElementById('verifyOTPStep').style.display = 'block';
            document.getElementById('otpInput').focus();
            
            // For development - auto-fill OTP if available
            if (response.data && response.data.otp) {
                const otpInput = document.getElementById('otpInput');
                if (otpInput) {
                    otpInput.value = response.data.otp;
                }
                showAlert(`${t('profile.sentOTP')}: ${response.data.otp}`, 'success');
            } else {
                showAlert(`${t('profile.sentOTP')}: ${identifier}`, 'success');
            }
        }
    } catch (error) {
        showAlert(t('profile.otpSendFailed') + ': ' + error.message, 'error');
    }
};

// Verify OTP and update field
window.verifyFieldOTP = async function(fieldName, newValue, role, otpTarget) {
    const otp = document.getElementById('otpInput').value.trim();
    
    if (!otp || otp.length !== 6) {
        showAlert(t('profile.invalidOTP'), 'error');
        return;
    }
    
    try {
        // Verify OTP against the existing contact (otpTarget), not the new value
        const verifyResponse = await apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                identifier: otpTarget,
                otp: otp
            })
        });
        
        if (verifyResponse.success) {
            showAlert(t('profile.otpVerifiedSuccess'), 'success');
            closeOTPModal();
            
            // Update the field to the new value
            await updateSingleField(fieldName, newValue, role);
        } else {
            showAlert(t('profile.invalidOTP'), 'error');
        }
    } catch (error) {
        showAlert(t('profile.invalidOTP') + ': ' + error.message, 'error');
        document.getElementById('otpInput').value = '';
        document.getElementById('otpInput').focus();
    }
};

// Close OTP modal
function closeOTPModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Handle profile picture upload
document.getElementById('profilePictureInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max for profile pictures)
    if (file.size > 5 * 1024 * 1024) {
        showAlert(t('profile.fileSizeTooLarge'), 'error');
        e.target.value = ''; // Reset input
        return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        showAlert(t('profile.invalidFileType'), 'error');
        e.target.value = ''; // Reset input
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const user = getUser();
        
        // Get token using the common.js function
        const token = getToken();
        
        console.log('Upload attempt - User:', user ? user.name : 'null', 'Token exists:', !!token);
        
        if (!token) {
            console.error('No authentication token found');
            showAlert(t('profile.notLoggedIn'), 'error');
            window.location.href = '/login.html';
            return;
        }
        
        if (!user) {
            console.error('No user data found');
            showAlert(t('profile.sessionExpired'), 'error');
            window.location.href = '/login.html';
            return;
        }
        
        console.log('Uploading file to /api/files/upload...');
        
        // Step 1: Upload file to server
        const uploadResponse = await fetch('/api/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        console.log('Upload response status:', uploadResponse.status, uploadResponse.statusText);
        
        // Check response status first
        if (!uploadResponse.ok) {
            if (uploadResponse.status === 401 || uploadResponse.status === 403) {
                console.error('Authentication failed - token may be expired or invalid');
                showAlert(t('profile.sessionExpired'), 'error');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
                return;
            }
            const errorText = await uploadResponse.text();
            console.error('Upload failed:', errorText);
            throw new Error(`Upload failed: ${errorText || uploadResponse.statusText}`);
        }
        
        // Parse JSON response
        let uploadResult;
        try {
            const responseText = await uploadResponse.text();
            console.log('Upload response text:', responseText);
            uploadResult = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            throw new Error('Invalid response from server. Please try again.');
        }
        
        console.log('Upload result:', uploadResult);
        
        if (!uploadResult.success) {
            throw new Error(uploadResult.message || 'Failed to upload file');
        }
        
        const imageUrl = uploadResult.data.url;
        console.log('Image uploaded successfully, URL:', imageUrl);
        
        // Step 2: Update profile picture URL in user/leader profile
        const endpoint = user.role === 'LEADER' 
            ? `/leaders/${user.id}/profile-picture`
            : `/users/${user.id}/profile-picture`;
        
        console.log('Updating profile picture via:', endpoint);
        
        const updateResponse = await apiRequest(endpoint, {
            method: 'PATCH',
            body: JSON.stringify({ profilePictureUrl: imageUrl })
        });
        
        if (updateResponse.success) {
            showAlert(t('profile.profilePictureUpdated'), 'success');
            document.getElementById('profilePic').src = imageUrl;
            
            // Update user data in localStorage for real-time sync
            const currentUser = getUser();
            if (currentUser) {
                currentUser.profilePictureUrl = imageUrl;
                localStorage.setItem('municipal_user', JSON.stringify(currentUser));
                console.log('✅ Updated profilePictureUrl in localStorage for real-time sync');
            }
        } else {
            throw new Error(updateResponse.message || 'Failed to update profile picture');
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        showAlert(t('profile.uploadFailed'), 'error');
    } finally {
        // Reset file input
        e.target.value = '';
    }
});

// Logout function
window.logout = function() {
    localStorage.clear();
    window.location.href = '/login.html';
};
