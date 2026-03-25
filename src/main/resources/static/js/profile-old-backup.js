// Profile page functionality
let isEditing = false;
let originalData = {};

document.addEventListener('DOMContentLoaded', () => {
    if (requireAuth()) {
        setupProfilePage();
        loadProfile();
    }
});

// Setup profile page based on role
function setupProfilePage() {
    const user = getUser();
    if (!user) return;
    
    // Show/hide elements based on role
    if (user.role === 'LEADER') {
        document.getElementById('profilePictureSection').style.display = 'block';
        document.getElementById('addressGroup').style.display = 'none';
        document.getElementById('wardGroup').style.display = 'none';
        document.getElementById('jurisdictionGroup').style.display = 'block';
        document.getElementById('designationGroup').style.display = 'block';
        document.getElementById('newComplaintLink').style.display = 'none';
    } else {
        document.getElementById('contactLeaderLink').style.display = 'block';
        document.getElementById('wardLabel').textContent = 'Ward Number';
    }
}

// Load profile data
async function loadProfile() {
    const user = getUser();
    if (!user || !user.id) {
        showAlert('User information not found', 'error');
        return;
    }
    
    try {
        let endpoint;
        if (user.role === 'LEADER') {
            endpoint = `/leaders/${user.id}`;
        } else {
            endpoint = `/users/${user.id}`;
        }
        
        const response = await apiRequest(endpoint, {
            method: 'GET'
        });
        
        if (response && response.success && response.data) {
            displayProfile(response.data, user.role);
        } else {
            showAlert('Failed to load profile data', 'error');
        }
    } catch (error) {
        showAlert('Failed to load profile: ' + (error.message || 'Unknown error'), 'error');
        console.error('Profile load error:', error);
    }
}

// Display profile data
function displayProfile(data, role) {
    originalData = { ...data };
    
    document.getElementById('name').value = data.name || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('email').value = data.email || '';
    
    if (role === 'LEADER') {
        document.getElementById('jurisdiction').value = data.jurisdiction || '';
        document.getElementById('designation').value = data.designation || '';
        
        // Load profile picture if exists
        if (data.profilePictureUrl) {
            document.getElementById('profilePicPreview').src = data.profilePictureUrl;
        }
    } else {
        document.getElementById('address').value = data.address || '';
        document.getElementById('wardNumber').value = data.wardNumber || '';
    }
}

// Toggle edit mode
function toggleEdit() {
    isEditing = true;
    const inputs = document.querySelectorAll('#profileForm input:not([type="file"]), #profileForm textarea');
    inputs.forEach(input => {
        // All fields can be edited now
        input.disabled = false;
    });
    
    document.getElementById('formActions').style.display = 'block';
    document.getElementById('editBtn').style.display = 'none';
}

// Cancel edit mode
function cancelEdit() {
    isEditing = false;
    const inputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
    inputs.forEach(input => input.disabled = true);
    
    document.getElementById('formActions').style.display = 'none';
    document.getElementById('editBtn').style.display = 'inline-block';
    
    // Restore original data
    const user = getUser();
    displayProfile(originalData, user.role);
}

// Save profile changes
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = getUser();
    if (!user) return;
    
    const updatedData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    if (user.role === 'LEADER') {
        updatedData.jurisdiction = document.getElementById('jurisdiction').value;
        updatedData.designation = document.getElementById('designation').value;
    } else {
        updatedData.address = document.getElementById('address').value;
        updatedData.wardNumber = document.getElementById('wardNumber').value;
    }
    
    // Check if phone or email changed
    const phoneChanged = updatedData.phone !== originalData.phone;
    const emailChanged = updatedData.email !== originalData.email;
    
    if (phoneChanged || emailChanged) {
        // Show OTP verification modal
        const changedField = phoneChanged ? 'phone' : 'email';
        const changedValue = phoneChanged ? updatedData.phone : updatedData.email;
        showOTPVerificationModal(changedField, changedValue, updatedData);
    } else {
        // No phone/email change, proceed with update
        await updateProfile(updatedData);
    }
});

// Update profile without OTP (for name, address, etc.)
async function updateProfile(updatedData) {
    const user = getUser();
    
    try {
        let endpoint;
        if (user.role === 'LEADER') {
            endpoint = `/leaders/${user.id}`;
        } else {
            endpoint = `/users/${user.id}`;
        }
        
        const response = await apiRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });
        
        if (response.success) {
            showAlert('Profile updated successfully', 'success');
            cancelEdit();
            loadProfile();
        }
    } catch (error) {
        showAlert(error.message || 'Failed to update profile', 'error');
    }
}

// Show OTP verification modal for phone/email changes
function showOTPVerificationModal(fieldType, newValue, updatedData) {
    const fieldLabel = fieldType === 'phone' ? 'Phone Number' : 'Email';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;" onclick="event.stopPropagation()">
            <h2>Verify ${fieldLabel} Change</h2>
            <p style="color: var(--text-muted); margin: 15px 0;">We need to verify your new ${fieldLabel.toLowerCase()}: <strong>${newValue}</strong></p>
            
            <div id="otpSteps">
                <div id="sendOTPStep">
                    <p style="margin-bottom: 15px;">Click below to receive an OTP:</p>
                    <button onclick="sendVerificationOTP('${fieldType}', '${newValue}')" class="btn btn-primary btn-block">
                        📱 Send OTP
                    </button>
                </div>
                
                <div id="verifyOTPStep" style="display: none;">
                    <div class="form-group">
                        <label>Enter OTP</label>
                        <input type="text" id="verificationOTP" maxlength="6" placeholder="Enter 6-digit OTP" 
                               style="width: 100%; padding: 10px; font-size: 18px; text-align: center; letter-spacing: 5px;">
                    </div>
                    <button onclick="verifyAndUpdate('${fieldType}', '${newValue}', ${JSON.stringify(updatedData).replace(/"/g, '&quot;')})" 
                            class="btn btn-primary btn-block">
                        ✅ Verify & Update Profile
                    </button>
                    <button onclick="sendVerificationOTP('${fieldType}', '${newValue}')" class="btn btn-secondary btn-block" style="margin-top: 10px;">
                        🔄 Resend OTP
                    </button>
                </div>
            </div>
            
            <button onclick="closeOTPModal()" class="btn btn-secondary btn-block" style="margin-top: 15px;">
                Cancel
            </button>
        </div>
    `;
    
    modal.onclick = () => closeOTPModal();
    document.body.appendChild(modal);
}

// Send OTP for verification
async function sendVerificationOTP(fieldType, newValue) {
    try {
        const user = getUser();
        const response = await apiRequest('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({
                identifier: newValue,
                role: user.role
            })
        });
        
        if (response.success) {
            document.getElementById('sendOTPStep').style.display = 'none';
            document.getElementById('verifyOTPStep').style.display = 'block';
            showAlert('OTP sent successfully', 'success');
        }
    } catch (error) {
        showAlert('Failed to send OTP: ' + error.message, 'error');
    }
}

// Verify OTP and update profile
async function verifyAndUpdate(fieldType, newValue, updatedData) {
    const otp = document.getElementById('verificationOTP').value;
    
    if (!otp || otp.length !== 6) {
        showAlert('Please enter a valid 6-digit OTP', 'error');
        return;
    }
    
    try {
        // Verify OTP first
        const verifyResponse = await apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                identifier: newValue,
                otp: otp
            })
        });
        
        if (verifyResponse.success) {
            // OTP verified, now update profile
            closeOTPModal();
            await updateProfile(updatedData);
        }
    } catch (error) {
        showAlert('Invalid OTP. Please try again.', 'error');
    }
}

// Close OTP modal
function closeOTPModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Handle profile picture upload
document.getElementById('profilePicInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'error');
        return;
    }
    
    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        showAlert('Only JPG, PNG, and GIF images are allowed', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const user = getUser();
        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update leader profile with the new picture URL
            const updateResponse = await fetch(`${API_BASE_URL}/leaders/${user.id}/profile-picture`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ profilePictureUrl: data.data.url })
            });
            
            const updateData = await updateResponse.json();
            
            if (updateData.success) {
                document.getElementById('profilePicPreview').src = data.data.url;
                showAlert('Profile picture updated successfully', 'success');
            } else {
                showAlert('Failed to update profile picture', 'error');
            }
        } else {
            showAlert('Failed to upload image', 'error');
        }
    } catch (error) {
        showAlert('Failed to upload profile picture: ' + (error.message || 'Unknown error'), 'error');
        console.error('Upload error:', error);
    }
});
