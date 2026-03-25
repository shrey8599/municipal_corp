// Authentication flow handler
let currentIdentifier = '';
let currentRole = '';
let currentOtp = '';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (isAuthenticated() && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Step 1: Phone number submission
    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    
    try {
        const response = await apiRequest('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({
                identifier: phone,
                role: role
            }),
            skipAuth: true
        });
        
        if (response.success) {
            currentIdentifier = phone;
            currentRole = role;
            currentOtp = response.data.otp; // For development only
            
            document.getElementById('phoneDisplay').textContent = phone;
            document.getElementById('phoneStep').classList.remove('active');
            document.getElementById('otpStep').classList.add('active');
            
            showAlert(`OTP sent to ${phone}. (Dev: ${currentOtp})`, 'success');
        }
    } catch (error) {
        showAlert(error.message || 'Failed to send OTP', 'error');
    }
        });
    }

    // Step 2: OTP verification
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otp = document.getElementById('otp').value;
    
    try {
        const response = await apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                identifier: currentIdentifier,
                otp: otp
            }),
            skipAuth: true
        });
        
        if (response.success) {
            const data = response.data;
            
            if (data.isRegistered) {
                // User is already registered, save token and redirect
                saveAuth(data.token, {
                    id: data.userId,
                    name: data.userName,
                    role: data.role
                });
                showAlert('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // New user needs to register
                if (currentRole === 'LEADER') {
                    // Ward Officers should be pre-registered by admin
                    showAlert('Ward Officers must be registered by an administrator. Please contact the Municipal Corporation office.', 'error');
                    // Go back to phone step
                    document.getElementById('otpStep').classList.remove('active');
                    document.getElementById('phoneStep').classList.add('active');
                    document.getElementById('otp').value = '';
                } else {
                    // Citizen can self-register
                    document.getElementById('otpStep').classList.remove('active');
                    document.getElementById('registerStep').classList.add('active');
                    
                    // Customize form for citizen
                    document.getElementById('wardLabel').textContent = 'Ward Number *';
                    document.getElementById('wardNumber').placeholder = 'e.g., 15';
                    document.getElementById('leaderSelectGroup').style.display = 'block';
                    document.getElementById('leaderId').setAttribute('required', 'required');
                    
                    // Load leaders for dropdown
                    await loadLeaders();
                    document.getElementById('name').focus();
                }
            }
        }
    } catch (error) {
        showAlert(error.message || 'Invalid OTP', 'error');
    }
        });
    }

    // Step 3: Registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: currentIdentifier,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        wardNumber: document.getElementById('wardNumber').value,
        leaderId: parseInt(document.getElementById('leaderId').value)
    };
    
    try {
        const response = await apiRequest(`/auth/register?identifier=${currentIdentifier}`, {
            method: 'POST',
            body: JSON.stringify(formData),
            skipAuth: true
        });
        
        if (response.success) {
            const { user, token } = response.data;
            
            saveAuth(token, {
                id: user.id,
                name: user.name,
                role: user.role
            });
            
            showAlert('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showAlert(error.message || 'Registration failed', 'error');
    }
        });
    }
});

// Load leaders for registration form
async function loadLeaders() {
    try {
        const response = await apiRequest('/leaders', {
            method: 'GET',
            skipAuth: true
        });
        
        const select = document.getElementById('leaderId');
        select.innerHTML = '<option value="">Select Ward Officer...</option>';
        
        if (response.success && response.data) {
            response.data.forEach(leader => {
                const option = document.createElement('option');
                option.value = leader.id;
                option.textContent = `${leader.name} - ${leader.jurisdiction}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load leaders:', error);
        showAlert('Could not load ward officers', 'error');
    }
}

// Back button handler
function goBackToPhone() {
    document.getElementById('otpStep').classList.remove('active');
    document.getElementById('phoneStep').classList.add('active');
    document.getElementById('otp').value = '';
}
