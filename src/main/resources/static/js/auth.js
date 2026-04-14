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
                    // Leader select stays hidden until city is chosen
                    document.getElementById('leaderSelectGroup').style.display = 'none';

                    // Populate state dropdown
                    initRegStateDropdown();

                    // Attempt to capture geolocation in background
                    captureGeolocation();

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
        leaderId: parseInt(document.getElementById('leaderId').value),
        state: document.getElementById('regState').value,
        city: document.getElementById('regCity').value,
        latitude: _geoLatitude,
        longitude: _geoLongitude
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

// ─── State / City / Leader cascade for registration ─────────────────────────

// Geo capture state
let _geoLatitude = null;
let _geoLongitude = null;

// Same state→cities map used in the super-admin dashboard
const REG_STATES_AND_CITIES = {
    'Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Tirupati','Nellore','Rajahmundry','Kakinada','Eluru'],
    'Arunachal Pradesh': ['Itanagar','Tawang','Pasighat','Tezu','Roing'],
    'Assam': ['Guwahati','Silchar','Dibrugarh','Nagaon','Jorhat','Barpeta','Tezpur'],
    'Bihar': ['Patna','Gaya','Bhagalpur','Muzaffarpur','Darbhanga','Purnia','Arrah'],
    'Chhattisgarh': ['Raipur','Bhilai','Durg','Rajnandgaon','Bilaspur','Raigarh'],
    'Goa': ['Panaji','Margao','Vasco da Gama','Ponda','Bicholim'],
    'Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Kutch'],
    'Haryana': ['Faridabad','Gurgaon','Hisar','Rohtak','Panipat','Ambala','Yamunanagar'],
    'Himachal Pradesh': ['Shimla','Mandi','Solan','Kangra','Kullu','Hamirpur'],
    'Jharkhand': ['Ranchi','Jamshedpur','Dhanbad','Giridih','Bokaro','Deoghar','Hazaribagh'],
    'Karnataka': ['Bangalore','Mangalore','Mysore','Belagavi','Hubballi','Davangere','Tumkur','Kolar'],
    'Kerala': ['Kochi','Thiruvananthapuram','Kozhikode','Kottayam','Pathanamthitta','Malappuram'],
    'Madhya Pradesh': ['Bhopal','Indore','Jabalpur','Gwalior','Ujjain','Sagar','Dewas'],
    'Maharashtra': ['Mumbai','Pune','Nagpur','Thane','Aurangabad','Nashik','Vasai','Kolhapur'],
    'Manipur': ['Imphal','Bishnupur','Kakching','Thoubal','Senapati'],
    'Meghalaya': ['Shillong','Tura','Jowai','Nongstoin','Baghmara'],
    'Mizoram': ['Aizawl','Lunglei','Saiha','Kolasib','Champhai'],
    'Nagaland': ['Kohima','Dimapur','Wokha','Mon','Tuensang'],
    'Odisha': ['Bhubaneswar','Rourkela','Cuttack','Berhampur','Balasore','Sambhalpur'],
    'Punjab': ['Chandigarh','Ludhiana','Amritsar','Patiala','Jalandhar','Bathinda','Hoshiarpur'],
    'Rajasthan': ['Jaipur','Jodhpur','Kota','Bikaner','Ajmer','Udaipur','Bhilwara','Keshod'],
    'Sikkim': ['Gangtok','Pelling','Mangan','Namchi','Gyalshing'],
    'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Salem','Tiruppur','Erode','Vellore'],
    'Tripura': ['Agartala','Udaipur','Ambassa','Dharmanagar','Kailashahar'],
    'Uttar Pradesh': ['Lucknow','Kanpur','Varanasi','Ghaziabad','Agra','Meerut','Allahabad','Noida'],
    'Uttarakhand': ['Dehradun','Haldwani','Nainital','Pithoragarh','Pauri','Rudraprayag'],
    'West Bengal': ['Kolkata','Dakshineswar','Howrah','Durgapur','Asansol','Siliguri','Darjeeling']
};

function initRegStateDropdown() {
    const sel = document.getElementById('regState');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select your state...</option>';
    Object.keys(REG_STATES_AND_CITIES).sort().forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        sel.appendChild(opt);
    });
    // Reset city and leader selects
    document.getElementById('regCity').innerHTML = '<option value="">Select your city...</option>';
    document.getElementById('leaderSelectGroup').style.display = 'none';
}

function onRegStateChange() {
    const state = document.getElementById('regState').value;
    const citySelect = document.getElementById('regCity');
    citySelect.innerHTML = '<option value="">Select your city...</option>';
    document.getElementById('leaderSelectGroup').style.display = 'none';
    document.getElementById('leaderId').innerHTML = '<option value="">Select Ward Officer...</option>';

    if (state && REG_STATES_AND_CITIES[state]) {
        REG_STATES_AND_CITIES[state].sort().forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }
}

async function onRegCityChange() {
    const state = document.getElementById('regState').value;
    const city = document.getElementById('regCity').value;
    if (!state || !city) return;
    await loadLeaders(state, city);
}

async function loadLeaders(state, city) {
    const select = document.getElementById('leaderId');
    const helpText = document.getElementById('leaderHelp');
    select.innerHTML = '<option value="">Loading ward officers...</option>';
    document.getElementById('leaderSelectGroup').style.display = 'block';

    try {
        const response = await apiRequest(
            `/leaders/by-city?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`,
            { method: 'GET', skipAuth: true }
        );

        select.innerHTML = '<option value="">Select Ward Officer...</option>';

        if (response.success && response.data && response.data.length > 0) {
            response.data.forEach(leader => {
                const option = document.createElement('option');
                option.value = leader.id;
                option.textContent = `${leader.name} — Ward ${leader.jurisdiction || leader.wardNumber || ''}`;
                select.appendChild(option);
            });
            if (helpText) helpText.textContent = `${response.data.length} ward officer(s) found in ${city}`;
        } else {
            if (helpText) helpText.textContent = `No ward officers found for ${city}. Please contact the municipal office.`;
        }
    } catch (error) {
        console.error('Failed to load leaders:', error);
        select.innerHTML = '<option value="">Error loading officers</option>';
        if (helpText) helpText.textContent = 'Could not load ward officers. Please try again.';
    }
}

function captureGeolocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
        pos => {
            _geoLatitude  = pos.coords.latitude;
            _geoLongitude = pos.coords.longitude;
        },
        () => { /* permission denied or unavailable — silently skip */ },
        { timeout: 8000, maximumAge: 60000 }
    );
}

// Back button handler
function goBackToPhone() {
    document.getElementById('otpStep').classList.remove('active');
    document.getElementById('phoneStep').classList.add('active');
    document.getElementById('otp').value = '';
}
