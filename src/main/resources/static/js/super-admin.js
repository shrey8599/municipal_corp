// Super Admin Dashboard JavaScript

let currentUser = null;
let verifiedIdentifier = null;
let jwtToken = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const otpForm = document.getElementById('otpForm');
    const leaderForm = document.getElementById('leaderForm');
    const resendOtpLink = document.getElementById('resendOtp');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPSubmit);
    }
    
    if (leaderForm) {
        leaderForm.addEventListener('submit', handleLeaderRegistration);
    }
    
    if (resendOtpLink) {
        resendOtpLink.addEventListener('click', function(e) {
            e.preventDefault();
            resendOTP();
        });
    }
    
    // Check if super admin is already logged in
    checkExistingSession();
});

function checkExistingSession() {
    const token = localStorage.getItem('superAdminToken');
    const role = localStorage.getItem('superAdminRole');
    
    if (token && role === 'SUPER_ADMIN') {
        // User is already logged in - redirect to enhanced dashboard
        jwtToken = token;
        window.location.href = '/super-admin-dashboard-enhanced.html';
        return;
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('loginPhone').value.trim();
    
    if (!identifier) {
        showAlert('loginAlert', 'Please enter phone or email', 'error');
        return;
    }
    
    console.log('Sending OTP request for:', identifier);
    
    fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: identifier })
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('OTP send response:', data);
        
        if (data.success) {
            // Show OTP for demo (remove in production)
            const otp = data.data.otp;
            console.log('OTP received (demo):', otp);
            
            // For development: Display OTP directly in UI
            const devMessage = `✅ OTP sent successfully!\n\n📱 Development OTP: ${otp}\n\n⚠️ (For development only - remove in production)`;
            showAlert('loginAlert', devMessage, 'success');
            
            setTimeout(() => {
                document.getElementById('otpIdentifier').textContent = `OTP sent to: ${identifier} (Dev OTP: ${otp})`;
                verifiedIdentifier = identifier;
                showTab('otpTab');
            }, 1500);
        } else {
            showAlert('loginAlert', data.message || 'Failed to send OTP', 'error');
        }
    })
    .catch(error => {
        console.error('Error sending OTP:', error);
        showAlert('loginAlert', error.message || 'Error sending OTP. Please try again.', 'error');
    });
}

function handleOTPSubmit(event) {
    event.preventDefault();
    
    const otp = document.getElementById('otpInput').value.trim();
    
    if (!otp || otp.length !== 6) {
        showAlert('otpAlert', 'Please enter a 6-digit OTP', 'error');
        return;
    }
    
    if (!verifiedIdentifier) {
        showAlert('otpAlert', 'Session expired. Please try again.', 'error');
        showTab('loginTab');
        return;
    }
    
    console.log('Verifying OTP for:', verifiedIdentifier);
    
    fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier: verifiedIdentifier,
            otp: otp
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('OTP verify response:', data);
        
        if (data.success && data.data.verified) {
            const userData = data.data;
            
            // Check if user is already registered
            if (userData.isRegistered) {
                // Check role
                if (userData.role === 'SUPER_ADMIN') {
                    // Super admin login successful
                    jwtToken = userData.token;
                    currentUser = {
                        id: userData.userId,
                        name: userData.userName,
                        role: userData.role
                    };
                    
                    // Store in localStorage
                    localStorage.setItem('superAdminToken', jwtToken);
                    localStorage.setItem('superAdminRole', userData.role);
                    localStorage.setItem('superAdminName', userData.userName);
                    localStorage.setItem('superAdminId', userData.userId);
                    if (userData.state) localStorage.setItem('superAdminState', userData.state);
                    if (userData.city) localStorage.setItem('superAdminCity', userData.city);
                    
                    showAlert('otpAlert', 'Login successful! Redirecting to dashboard...', 'success');
                    
                    // Redirect to enhanced dashboard after successful login
                    setTimeout(() => {
                        window.location.href = '/super-admin-dashboard-enhanced.html';
                    }, 1000);
                } else {
                    showAlert('otpAlert', 'Access denied. Only super admins can access this panel.', 'error');
                }
            } else {
                // User not registered as super admin
                showAlert('otpAlert', 'This user is not registered as a super admin. Please contact the administrator.', 'error');
            }
        } else {
            showAlert('otpAlert', data.message || 'Invalid or expired OTP', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('otpAlert', 'Error verifying OTP. Please try again.', 'error');
    });
}

function resendOTP() {
    if (!verifiedIdentifier) {
        console.error('No identifier found');
        return;
    }
    
    fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: verifiedIdentifier })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const otp = data.data.otp;
            console.log('OTP resent (demo):', otp);
            const devMessage = `✅ OTP resent successfully!\n\n📱 New Demo OTP: ${otp}`;
            showAlert('otpAlert', devMessage, 'info');
        } else {
            showAlert('otpAlert', 'Failed to resend OTP', 'error');
        }
    })
    .catch(error => {
        console.error('Error resending OTP:', error);
        showAlert('otpAlert', error.message || 'Error resending OTP', 'error');
    });
}

function handleLeaderRegistration(event) {
    event.preventDefault();
    
    if (!jwtToken) {
        showAlert('dashboardAlert', 'Session expired. Please login again.', 'error');
        logout();
        return;
    }
    
    const leaderData = {
        name: document.getElementById('leaderName').value.trim(),
        phone: document.getElementById('leaderPhone').value.trim(),
        email: document.getElementById('leaderEmail').value.trim() || null,
        jurisdiction: document.getElementById('leaderJurisdiction').value.trim(),
        designation: document.getElementById('leaderDesignation').value.trim()
    };
    
    // Validate
    if (!leaderData.name || !leaderData.phone || !leaderData.jurisdiction || !leaderData.designation) {
        showAlert('dashboardAlert', 'Please fill in all required fields', 'error');
        return;
    }
    
    if (!/^\d{10}$/.test(leaderData.phone)) {
        showAlert('dashboardAlert', 'Phone number must be 10 digits', 'error');
        return;
    }
    
    console.log('Registering leader:', leaderData);
    
    // First verify OTP for the leader's phone/email
    fetch('/api/auth/super-admin/send-otp-for-leader', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
            identifier: leaderData.email || leaderData.phone
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('OTP sent for leader (demo):', data.data.otp);
            
            // For now, let's assume OTP is verified (in production, you'd show an OTP dialog)
            // Extract the OTP from response for demo
            const leaderOtp = data.data.otp;
            
            // Verify OTP
            return fetch('/api/auth/super-admin/verify-otp-for-leader', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    identifier: leaderData.email || leaderData.phone,
                    otp: leaderOtp
                })
            });
        } else {
            throw new Error(data.message || 'Failed to send OTP for leader');
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.verified) {
            // OTP verified, now register the leader
            return fetch('/api/auth/super-admin/register-leader', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(leaderData),
                searchParams: new URLSearchParams({
                    identifier: leaderData.email || leaderData.phone
                })
            });
        } else {
            throw new Error(data.message || 'Failed to verify OTP for leader');
        }
    })
    .then(response => {
        const url = new URL(response.url);
        url.searchParams.append('identifier', leaderData.email || leaderData.phone);
        
        // Make the actual registration call
        return fetch('/api/auth/super-admin/register-leader?identifier=' + encodeURIComponent(leaderData.email || leaderData.phone), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(leaderData)
        });
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Leader registered successfully:', data.data);
            
            // Show success
            document.getElementById('successName').textContent = data.data.name;
            document.getElementById('successPhone').textContent = data.data.phone;
            document.getElementById('successJurisdiction').textContent = data.data.jurisdiction;
            
            showAlert('dashboardAlert', 'Ward Officer registered successfully!', 'success');
            
            setTimeout(() => {
                showTab('successTab');
            }, 1000);
        } else {
            showAlert('dashboardAlert', data.message || 'Failed to register ward officer', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('dashboardAlert', error.message || 'Error registering ward officer. Please try again.', 'error');
    });
}

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

function showAlert(alertId, message, type) {
    const alert = document.getElementById(alertId);
    if (alert) {
        // Handle multi-line messages by replacing \n with <br>
        const htmlMessage = message.replace(/\n/g, '<br>');
        alert.innerHTML = htmlMessage;
        alert.className = `alert show alert-${type}`;
        
        // Auto-hide after 8 seconds for success and info alerts (5 seconds for others)
        const autoHideDelay = (type === 'success' || type === 'info') ? 8000 : 5000;
        setTimeout(() => {
            alert.classList.remove('show');
        }, autoHideDelay);
    }
}

function resetForm() {
    document.getElementById('leaderForm').reset();
    document.getElementById('dashboardAlert').classList.remove('show');
    showTab('dashboardTab');
}

function logout() {
    // Clear storage
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminRole');
    localStorage.removeItem('superAdminName');
    localStorage.removeItem('superAdminId');
    
    // Reset variables
    currentUser = null;
    verifiedIdentifier = null;
    jwtToken = null;
    
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('otpForm').reset();
    document.getElementById('leaderForm').reset();
    
    // Clear alerts
    document.querySelectorAll('.alert').forEach(alert => {
        alert.classList.remove('show');
    });
    
    // Show login tab
    showTab('loginTab');
}
