// Super Admin Enhanced Dashboard JavaScript

let jwtToken = null;
let currentAdmin = null;
const API_BASE = 'http://localhost:9999/api';

// Tracks the OTP-verified phone for create officer flow (null = not yet verified)
let officerVerifiedPhone = null;

// In-memory store for political figure image URLs (loaded from API on init, updated on upload)
const settingImageUrls = {
    pmImageUrl: null,
    cmImageUrl: null,
    mlaImageUrl: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboardData();
    setupEventListeners();
    loadWardOfficers();
    initializeStates();
});

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('superAdminToken');
    const role = localStorage.getItem('superAdminRole');
    const name = localStorage.getItem('superAdminName');
    
    if (!token || role !== 'SUPER_ADMIN') {
        // Not authenticated - redirect to login page
        window.location.href = '/super-admin-dashboard.html';
        return;
    }
    
    jwtToken = token;
    
    // Load admin's assigned region: prefer explicit UI selection, fall back to login-time values
    let adminState = localStorage.getItem('superAdminState') || '';
    let adminCity  = localStorage.getItem('superAdminCity')  || '';
    const systemSettings = localStorage.getItem('systemSettings');
    if (systemSettings) {
        const settings = JSON.parse(systemSettings);
        if (settings.state) adminState = settings.state;
        if (settings.city)  adminCity  = settings.city;
    }
    
    currentAdmin = {
        name: name,
        role: role,
        state: adminState,
        city: adminCity
    };
    
    document.getElementById('adminName').textContent = name;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('createOfficerForm').addEventListener('submit', handleCreateOfficer);
    document.getElementById('editOfficerForm').addEventListener('submit', handleEditOfficer);
}

// Show page
function showPage(pageName, element) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageName).classList.add('active');
    
    // Add active class to clicked nav link (use the current element if passed)
    if (element) {
        element.classList.add('active');
    } else if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // Load data for the page
    if (pageName === 'dashboard') {
        loadDashboardData();
    } else if (pageName === 'wardOfficers') {
        loadWardOfficers();
    } else if (pageName === 'analytics') {
        loadAnalytics();
    } else if (pageName === 'cityNews') {
        loadCityNews();
    }
}

// Load dashboard data with proper chaining: City -> Leaders -> Citizens -> Tickets
function loadDashboardData() {
    // Step 1: Load leaders for admin's city
    fetchAPI('/leaders')
        .then(response => {
            let allLeaders = Array.isArray(response) ? response : (response.data || []);
            const cityLeaders = allLeaders.filter(leader => 
                leader.state === currentAdmin.state && leader.city === currentAdmin.city
            );
            
            document.getElementById('totalOfficers').textContent = cityLeaders.length;
            loadRecentOfficers(cityLeaders);
            
            // Step 2: Load citizens under these city leaders
            return fetchAPI('/users').then(response => {
                let allUsers = Array.isArray(response) ? response : (response.data || []);
                const leaderIds = cityLeaders.map(l => l.id);
                
                // Filter citizens who are associated with leaders in this city
                const cityCitizens = allUsers.filter(user => 
                    user.role === 'CITIZEN' && 
                    user.state === currentAdmin.state && 
                    user.city === currentAdmin.city
                );
                
                document.getElementById('totalCitizens').textContent = cityCitizens.length;
                
                // Step 3: Load tickets from these city leaders
                return fetchAPI('/tickets').then(response => {
                    let allTickets = Array.isArray(response) ? response : (response.data || []);
                    
                    // Filter tickets where assignedLeader is in cityLeaders (use ID-based matching)
                    const cityTickets = allTickets.filter(ticket => {
                        return ticket.assignedLeader && leaderIds.includes(ticket.assignedLeader.id);
                    });
                    
                    document.getElementById('totalTickets').textContent = cityTickets.length;
                    document.getElementById('openTickets').textContent = cityTickets.filter(t => t.status === 'OPEN').length;
                });
            });
        })
        .catch(err => {
            console.error('Error loading dashboard data:', err);
            document.getElementById('totalOfficers').textContent = '0';
            document.getElementById('totalCitizens').textContent = '0';
            document.getElementById('totalTickets').textContent = '0';
            document.getElementById('openTickets').textContent = '0';
        });
}

// Load recent officers table
function loadRecentOfficers(leaders) {
    const table = document.getElementById('recentOfficersTable');
    
    if (leaders.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #8D6E63;">No ward officers yet</td></tr>';
        return;
    }
    
    let html = '';
    leaders.slice(0, 5).forEach(leader => {
        html += `
            <tr>
                <td><strong>${leader.name}</strong></td>
                <td>${leader.phone}</td>
                <td>${leader.jurisdiction}</td>
                <td>${leader.designation || '-'}</td>
                <td>
                    <span style="color: ${leader.active ? '#2E7D32' : '#C62828'};">
                        ${leader.active ? '✓ Active' : '✗ Inactive'}
                    </span>
                </td>
            </tr>
        `;
    });
    
    table.innerHTML = html;
}

// Load all ward officers with proper city filtering
function loadWardOfficers() {
    fetchAPI('/leaders')
        .then(response => {
            let allLeaders = Array.isArray(response) ? response : (response.data || []);
            // Filter by admin's assigned state/city
            const cityLeaders = allLeaders.filter(leader => 
                leader.state === currentAdmin.state && leader.city === currentAdmin.city
            );
            displayOfficersTable(cityLeaders);
        })
        .catch(err => {
            console.error('Error loading officers:', err);
            showAlert('wardAlert', 'Error loading ward officers', 'error');
        });
}

// Display officers in table
function displayOfficersTable(leaders) {
    const table = document.getElementById('officersTable');
    
    if (leaders.length === 0) {
        table.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #8D6E63;">No ward officers found</td></tr>';
        return;
    }
    
    let html = '';
    leaders.forEach(leader => {
        html += `
            <tr>
                <td><strong>${leader.name}</strong></td>
                <td>${leader.phone}</td>
                <td>${leader.email || '-'}</td>
                <td>${leader.jurisdiction}</td>
                <td>${leader.designation || '-'}</td>
                <td>
                    <span style="color: ${leader.active ? '#2E7D32' : '#C62828'};">
                        ${leader.active ? '✓ Active' : '✗ Inactive'}
                    </span>
                </td>
                <td>
                    <button class="btn-edit" onclick="showEditOfficerModal(${leader.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteOfficer(${leader.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    table.innerHTML = html;
}

// Handle create officer
function handleCreateOfficer(e) {
    e.preventDefault();

    if (!officerVerifiedPhone) {
        showAlert('wardAlert', 'Please verify the phone number via OTP first', 'error');
        return;
    }

    const officer = {
        name: document.getElementById('officerName').value.trim(),
        phone: officerVerifiedPhone,
        email: document.getElementById('officerEmail').value.trim() || null,
        jurisdiction: document.getElementById('officerJurisdiction').value.trim(),
        designation: document.getElementById('officerDesignation').value.trim(),
        state: currentAdmin.state,  // Add admin's state
        city: currentAdmin.city     // Add admin's city
    };
    
    // Validate
    if (!officer.name || !officer.jurisdiction) {
        showAlert('wardAlert', 'Please fill in all required fields (Name and Ward Number)', 'error');
        return;
    }
    
    // Create officer
    fetchAPI('/leaders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(officer)
    })
    .then(response => {
        if (response.success === true) {
            showAlert('wardAlert', '✓ Ward officer created successfully', 'success');
            officerVerifiedPhone = null;
            closeModal('createOfficerModal');
            document.getElementById('createOfficerForm').reset();
            loadWardOfficers();
            loadDashboardData();
        } else {
            showAlert('wardAlert', response.message || 'Error creating officer', 'error');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showAlert('wardAlert', 'Error creating ward officer', 'error');
    });
}

// Show edit modal
function showEditOfficerModal(leaderId) {
    fetchAPI(`/leaders/${leaderId}`)
        .then(response => {
            const leader = Array.isArray(response) ? response[0] : (response.data || response);
            document.getElementById('editOfficerId').value = leader.id;
            document.getElementById('editOfficerName').value = leader.name;
            document.getElementById('editOfficerPhone').value = leader.phone;
            document.getElementById('editOfficerEmail').value = leader.email || '';
            document.getElementById('editOfficerJurisdiction').value = leader.jurisdiction;
            document.getElementById('editOfficerDesignation').value = leader.designation || '';
            
            document.getElementById('editOfficerModal').classList.add('show');
        })
        .catch(err => {
            console.error('Error:', err);
            showAlert('wardAlert', 'Error loading officer details', 'error');
        });
}

// Handle edit officer
function handleEditOfficer(e) {
    e.preventDefault();
    
    const leaderId = document.getElementById('editOfficerId').value;
    const officer = {
        name: document.getElementById('editOfficerName').value,
        phone: document.getElementById('editOfficerPhone').value,
        email: document.getElementById('editOfficerEmail').value || null,
        jurisdiction: document.getElementById('editOfficerJurisdiction').value,
        designation: document.getElementById('editOfficerDesignation').value,
        state: currentAdmin.state,  // Keep admin's state
        city: currentAdmin.city     // Keep admin's city
    };
    
    // Update officer
    fetchAPI(`/leaders/${leaderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(officer)
    })
    .then(response => {
        if (response.success === true) {
            showAlert('wardAlert', '✓ Ward officer updated successfully', 'success');
            closeModal('editOfficerModal');
            loadWardOfficers();
            loadDashboardData();
        } else {
            showAlert('wardAlert', response.message || 'Error updating officer', 'error');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showAlert('wardAlert', 'Error updating ward officer', 'error');
    });
}

// Delete officer
function deleteOfficer(leaderId) {
    if (!confirm('Are you sure you want to delete this ward officer? This action cannot be undone.')) {
        return;
    }
    
    fetchAPI(`/leaders/${leaderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (response.success === true) {
            showAlert('wardAlert', '✓ Ward officer deleted successfully', 'success');
            loadWardOfficers();
            loadDashboardData();
        } else {
            showAlert('wardAlert', response.message || 'Error deleting officer', 'error');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showAlert('wardAlert', 'Error deleting ward officer', 'error');
    });
}

// Load analytics with proper chaining: City -> Leaders -> Tickets
// filteredLeaderId: if set, show stats only for that officer
function loadAnalytics(filteredLeaderId = null) {
    // Step 1: Get leaders for admin's city
    fetchAPI('/leaders')
        .then(response => {
            let allLeaders = Array.isArray(response) ? response : (response.data || []);
            const cityLeaders = allLeaders.filter(leader =>
                leader.state === currentAdmin.state && leader.city === currentAdmin.city
            );
            const leaderIds = cityLeaders.map(l => l.id);

            // Populate ward officer filter dropdown
            populateOfficerDropdown('analyticsOfficerFilter', cityLeaders, filteredLeaderId);

            // City officers count always reflects full city
            document.getElementById('cityOfficersCount').textContent = cityLeaders.length;

            return fetchAPI('/tickets').then(ticketResp => {
                let allTickets = Array.isArray(ticketResp) ? ticketResp : (ticketResp.data || []);

                // Determine which leaders to show
                let viewLeaders = cityLeaders;
                let viewTickets;
                if (filteredLeaderId) {
                    const fid = parseInt(filteredLeaderId, 10);
                    viewTickets = allTickets.filter(t => t.assignedLeader && t.assignedLeader.id === fid);
                    viewLeaders = cityLeaders.filter(l => l.id === fid);
                } else {
                    viewTickets = allTickets.filter(t => t.assignedLeader && leaderIds.includes(t.assignedLeader.id));
                }

                // --- Metrics ---
                const total     = viewTickets.length;
                const resolved  = viewTickets.filter(t => t.status === 'RESOLVED').length;
                const inProg    = viewTickets.filter(t => t.status === 'IN_PROGRESS').length;
                const open      = viewTickets.filter(t => t.status === 'OPEN').length;
                const closed    = viewTickets.filter(t => t.status === 'CLOSED').length;
                const resRate   = total > 0 ? Math.round((resolved / total) * 100) : 0;
                const avgTime   = calculateAverageResolutionTime(viewTickets);

                document.getElementById('resolvedTickets').textContent    = resolved;
                document.getElementById('inProgressTickets').textContent  = inProg;
                document.getElementById('analyticsOpenTickets').textContent = open;
                document.getElementById('analyticsTotalTickets').textContent = total;
                document.getElementById('closedTickets').textContent      = closed;
                document.getElementById('resolutionRate').textContent     = resRate + '%';
                document.getElementById('avgResolutionTime').textContent  = avgTime || '-';

                // --- Pie charts ---
                drawPieChart('statusPieChart', 'statusPieLegend', buildStatusData(viewTickets));
                drawPieChart('categoryPieChart', 'categoryPieLegend', buildCategoryData(viewTickets));
                drawPieChart('typePieChart', 'typePieLegend', buildTypeData(viewTickets));

                // --- Status summary table ---
                loadTicketStatusSummary(viewTickets);

                // --- Per-officer breakdown (hide when filtered to single officer) ---
                const breakdownSection = document.getElementById('officerBreakdownSection');
                if (filteredLeaderId) {
                    breakdownSection.style.display = 'none';
                } else {
                    breakdownSection.style.display = 'block';
                    loadOfficerBreakdown(cityLeaders, allTickets.filter(t => t.assignedLeader && leaderIds.includes(t.assignedLeader.id)));
                }
            });
        })
        .catch(err => {
            console.error('Error loading analytics:', err);
            ['resolvedTickets','inProgressTickets','analyticsOpenTickets','analyticsTotalTickets',
             'closedTickets','avgResolutionTime','cityOfficersCount'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });
            document.getElementById('resolutionRate').textContent = '-%';
            loadTicketStatusSummary([]);
        });
}

function filterAnalytics(leaderId) {
    loadAnalytics(leaderId || null);
}

// --- Analytics helpers ---

function buildStatusData(tickets) {
    const map = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
    tickets.forEach(t => { if (map[t.status] !== undefined) map[t.status]++; });
    const colors = { OPEN: '#D97642', IN_PROGRESS: '#F57C00', RESOLVED: '#2E7D32', CLOSED: '#8D6E63' };
    return Object.entries(map).map(([label, value]) => ({ label, value, color: colors[label] }));
}

function buildCategoryData(tickets) {
    const map = {};
    tickets.forEach(t => { map[t.category] = (map[t.category] || 0) + 1; });
    const palette = ['#D97642','#2A9D8F','#C9A961','#C62828','#0277BD','#F57C00','#6A1B9A'];
    return Object.entries(map).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
}

function buildTypeData(tickets) {
    const map = {};
    tickets.forEach(t => { map[t.type] = (map[t.type] || 0) + 1; });
    const palette = ['#D97642','#2A9D8F','#C9A961'];
    return Object.entries(map).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
}

function drawPieChart(canvasId, legendId, segments) {
    const canvas = document.getElementById(canvasId);
    const legendEl = document.getElementById(legendId);
    if (!canvas || !legendEl) return;

    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, r = Math.min(cx, cy) - 6;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = segments.reduce((s, seg) => s + seg.value, 0);

    if (total === 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();
        legendEl.innerHTML = '<span style="font-size:12px;color:#999;">No data</span>';
        return;
    }

    let startAngle = -Math.PI / 2;
    segments.forEach(seg => {
        if (seg.value === 0) return;
        const sweep = (seg.value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        startAngle += sweep;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Legend
    legendEl.innerHTML = segments
        .filter(s => s.value > 0)
        .map(s => `
        <div class="legend-item">
            <div class="legend-dot" style="background:${s.color}"></div>
            <span>${s.label.replace(/_/g,' ')} (${s.value})</span>
        </div>`).join('');
}

function loadOfficerBreakdown(leaders, tickets) {
    if (!leaders.length) {
        document.getElementById('officerBreakdownTable').innerHTML =
            '<tr><td colspan="7" style="text-align:center;color:#8D6E63;">No officers found</td></tr>';
        return;
    }
    let html = '';
    leaders.forEach(leader => {
        const lt = tickets.filter(t => t.assignedLeader && t.assignedLeader.id === leader.id);
        const total   = lt.length;
        const res     = lt.filter(t => t.status === 'RESOLVED').length;
        const inp     = lt.filter(t => t.status === 'IN_PROGRESS').length;
        const open    = lt.filter(t => t.status === 'OPEN').length;
        const rate    = total > 0 ? Math.round((res / total) * 100) : 0;
        const rateColor = rate >= 70 ? '#2E7D32' : rate >= 40 ? '#F57C00' : '#C62828';
        html += `<tr>
            <td><strong>${leader.name}</strong></td>
            <td>${leader.jurisdiction || '-'}</td>
            <td>${total}</td>
            <td>${res}</td>
            <td>${inp}</td>
            <td>${open}</td>
            <td><span style="font-weight:700;color:${rateColor}">${rate}%</span></td>
        </tr>`;
    });
    document.getElementById('officerBreakdownTable').innerHTML = html;
}

function calculateAverageResolutionTime(tickets) {
    const resolved = tickets.filter(t => t.status === 'RESOLVED' && t.closedAt && t.createdAt);
    if (resolved.length === 0) return null;
    const times = resolved.map(t =>
        Math.floor((new Date(t.closedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24))
    );
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    return `${avg} day${avg !== 1 ? 's' : ''}`;
}

function loadTicketStatusSummary(tickets) {
    const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const total = tickets.length;
    const colors = { OPEN: '#D97642', IN_PROGRESS: '#F57C00', RESOLVED: '#2E7D32', CLOSED: '#8D6E63' };
    let html = '';
    statuses.forEach(status => {
        const count = tickets.filter(t => t.status === status).length;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        html += `<tr>
            <td><strong>${status.replace(/_/g,' ')}</strong></td>
            <td>${count}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="background:#e0e0e0;height:16px;border-radius:4px;width:120px;overflow:hidden;">
                        <div style="background:${colors[status]};height:100%;width:${pct}%;"></div>
                    </div>
                    <span>${pct}%</span>
                </div>
            </td>
        </tr>`;
    });
    document.getElementById('ticketStatusTable').innerHTML = html || '<tr><td colspan="3" style="text-align:center;color:#8D6E63;">No ticket data</td></tr>';
}

// --- News tab ---

// Cache of city leaders so news filter can be populated without extra fetch
let _cityLeadersCache = [];

function loadCityNews(filteredLeaderId = null) {
    fetchAPI('/leaders')
        .then(resp => {
            let allLeaders = Array.isArray(resp) ? resp : (resp.data || []);
            _cityLeadersCache = allLeaders.filter(l =>
                l.state === currentAdmin.state && l.city === currentAdmin.city
            );
            const leaderIds = _cityLeadersCache.map(l => l.id);

            // Populate news filter dropdown
            populateOfficerDropdown('newsOfficerFilter', _cityLeadersCache, filteredLeaderId);

            // Fetch news – use per-leader endpoint if filtered, otherwise all
            const newsPromise = filteredLeaderId
                ? fetchAPI(`/news/leader/${filteredLeaderId}`)
                : fetchAPI('/news');

            return newsPromise.then(nResp => {
                let allNews = Array.isArray(nResp) ? nResp : (nResp.data || []);

                // When showing all: keep only news from this city's leaders
                if (!filteredLeaderId) {
                    allNews = allNews.filter(n => n.author && leaderIds.includes(n.author.id));
                }

                // Sort by createdAt descending (latest first)
                allNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                renderNewsGrid(allNews);
            });
        })
        .catch(err => {
            console.error('Error loading news:', err);
            document.getElementById('newsGrid').innerHTML =
                '<p style="color:#C62828;">Error loading news.</p>';
        });
}

function filterNews(leaderId) {
    loadCityNews(leaderId || null);
}

function renderNewsGrid(newsList) {
    const grid = document.getElementById('newsGrid');
    if (!newsList.length) {
        grid.innerHTML = '<p style="color:#8D6E63;padding:20px;">No news posts found for this selection.</p>';
        return;
    }
    grid.innerHTML = newsList.map(news => {
        const author = news.author ? news.author.name : 'Unknown Officer';
        const jurisdiction = news.author && news.author.jurisdiction ? ` · ${news.author.jurisdiction}` : '';
        const date = news.createdAt ? new Date(news.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : '';
        const likes = news.likesCount || 0;
        const images = news.imageUrls && news.imageUrls.length > 0
            ? `<img src="${escapeHtml(news.imageUrls[0])}" alt="News image"
                style="width:100%;height:160px;object-fit:cover;border-bottom:1px solid #E8D5C4;"
                onerror="this.style.display='none'">`
            : '';
        return `
        <div class="news-card">
            ${images}
            <div class="news-card-body">
                <div class="news-card-title">${escapeHtml(news.title)}</div>
                <div class="news-card-content">${escapeHtml(news.content)}</div>
            </div>
            <div class="news-card-footer">
                <span class="news-officer-badge">${escapeHtml(author)}${escapeHtml(jurisdiction)}</span>
                <span style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
                    <span class="news-likes">❤️ ${likes}</span>
                    <span style="font-size:11px;">${date}</span>
                </span>
            </div>
        </div>`;
    }).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Shared helper: populate an officer filter <select>
function populateOfficerDropdown(selectId, leaders, selectedId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">All Ward Officers</option>';
    leaders.forEach(leader => {
        const opt = document.createElement('option');
        opt.value = leader.id;
        opt.textContent = leader.name + (leader.jurisdiction ? ` (${leader.jurisdiction})` : '');
        sel.appendChild(opt);
    });
    if (selectedId) sel.value = selectedId;
}

// Modal functions
function showCreateOfficerModal() {
    // Reset OTP verification state
    officerVerifiedPhone = null;
    document.getElementById('officerPhoneInput').value = '';
    document.getElementById('officerOtpInput').value = '';
    document.getElementById('officerOtpRow').style.display = 'none';
    document.getElementById('officerStep1').style.display = 'block';
    document.getElementById('officerStep2').style.display = 'none';
    document.getElementById('officerOtpAlert').style.display = 'none';
    document.getElementById('officerSendOtpBtn').disabled = false;
    document.getElementById('officerSendOtpBtn').textContent = 'Send OTP';
    // Clear detail fields
    ['officerName','officerEmail','officerJurisdiction','officerDesignation'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('createOfficerModal').classList.add('show');
}

// OTP functions for officer creation
function showOfficerAlert(message, type) {
    const alertEl = document.getElementById('officerOtpAlert');
    alertEl.textContent = message;
    alertEl.className = `alert show alert-${type}`;
    alertEl.style.display = 'block';
    setTimeout(() => {
        alertEl.style.display = 'none';
        alertEl.className = 'alert';
    }, 5000);
}

function sendOfficerOtp() {
    const phone = document.getElementById('officerPhoneInput').value.trim();
    if (!phone || !/^\d{10}$/.test(phone)) {
        showOfficerAlert('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    const btn = document.getElementById('officerSendOtpBtn');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    // Clear any previous OTP input
    document.getElementById('officerOtpInput').value = '';

    fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({identifier: phone})
    })
    .then(r => r.json())
    .then(res => {
        btn.disabled = false;
        btn.textContent = 'Resend OTP';
        if (res.success !== false) {
            document.getElementById('officerOtpRow').style.display = 'block';
            showOfficerAlert('OTP sent to ' + phone, 'success');
        } else {
            showOfficerAlert(res.message || 'Failed to send OTP', 'error');
        }
    })
    .catch(() => {
        btn.disabled = false;
        btn.textContent = 'Send OTP';
        showOfficerAlert('Error sending OTP. Please try again.', 'error');
    });
}

function verifyOfficerOtp() {
    const phone = document.getElementById('officerPhoneInput').value.trim();
    const otp   = document.getElementById('officerOtpInput').value.trim();
    if (!otp || otp.length < 4) {
        showOfficerAlert('Please enter the OTP', 'error');
        return;
    }
    const btn = document.getElementById('officerVerifyOtpBtn');
    btn.disabled = true;
    btn.textContent = 'Verifying...';

    fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({identifier: phone, otp: otp})
    })
    .then(r => r.json())
    .then(res => {
        btn.disabled = false;
        btn.textContent = 'Verify OTP';
        const verified = res.data && res.data.verified;
        if (verified) {
            officerVerifiedPhone = phone;
            document.getElementById('officerPhone').value = phone;
            document.getElementById('officerVerifiedPhoneDisplay').textContent = phone;
            document.getElementById('officerStep1').style.display = 'none';
            document.getElementById('officerStep2').style.display = 'block';
            document.getElementById('officerOtpAlert').style.display = 'none';
        } else {
            showOfficerAlert('Invalid OTP. Please try again.', 'error');
        }
    })
    .catch(() => {
        btn.disabled = false;
        btn.textContent = 'Verify OTP';
        showOfficerAlert('Error verifying OTP. Please try again.', 'error');
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
};

// Alert function
function showAlert(alertId, message, type) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.textContent = message;
        alert.className = `alert show alert-${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
        }, 5000);
    }
}

// Load existing political figure image settings for the currently selected city
async function loadSystemImageSettings() {
    try {
        const stateEl = document.getElementById('stateSelect');
        const cityEl  = document.getElementById('citySelect');
        const state = (stateEl && stateEl.value) ? stateEl.value : currentAdmin.state;
        const city  = (cityEl  && cityEl.value)  ? cityEl.value  : currentAdmin.city;
        if (!state || !city) return;

        const response = await fetch(
            `${API_BASE}/region?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`,
            { cache: 'no-store' }
        );
        const result = await response.json();
        if (result.success && result.data) {
            const s = result.data;
            // Reset previews first
            ['pm','cm','mla'].forEach(key => {
                const wrap = document.getElementById(key + 'ImagePreviewWrap');
                const img  = document.getElementById(key + 'ImagePreview');
                if (img)  { img.src = ''; }
                if (wrap) { wrap.style.display = 'none'; }
            });
            settingImageUrls.pmImageUrl  = null;
            settingImageUrls.cmImageUrl  = null;
            settingImageUrls.mlaImageUrl = null;

            if (s.pmImageUrl) {
                settingImageUrls.pmImageUrl = s.pmImageUrl;
                const img  = document.getElementById('pmImagePreview');
                const wrap = document.getElementById('pmImagePreviewWrap');
                if (img)  { img.src = s.pmImageUrl; }
                if (wrap) { wrap.style.display = 'block'; }
            }
            if (s.cmImageUrl) {
                settingImageUrls.cmImageUrl = s.cmImageUrl;
                const img  = document.getElementById('cmImagePreview');
                const wrap = document.getElementById('cmImagePreviewWrap');
                if (img)  { img.src = s.cmImageUrl; }
                if (wrap) { wrap.style.display = 'block'; }
            }
            if (s.mlaImageUrl) {
                settingImageUrls.mlaImageUrl = s.mlaImageUrl;
                const img  = document.getElementById('mlaImagePreview');
                const wrap = document.getElementById('mlaImagePreviewWrap');
                if (img)  { img.src = s.mlaImageUrl; }
                if (wrap) { wrap.style.display = 'block'; }
            }
        }
    } catch (err) {
        console.error('Failed to load region image settings:', err);
    }
}

// Upload a settings image file and store the returned URL
async function previewAndUploadSettingsImage(inputId, previewId, settingKey, scope) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !input.files || !input.files[0]) return;

    // Warn before overwriting CM (state-wide) or PM (nationwide) if already set
    if (scope === 'cm' && settingImageUrls.cmImageUrl) {
        const selectedState = (document.getElementById('stateSelect') || {}).value || currentAdmin.state;
        const confirmed = confirm(
            `⚠️ The Chief Minister photo is shared across all cities in ${selectedState}.\n\nChanging it will update every city in that state.\n\nDo you want to continue?`
        );
        if (!confirmed) { input.value = ''; return; }
    }
    if (scope === 'pm' && settingImageUrls.pmImageUrl) {
        const confirmed = confirm(
            `⚠️ The Prime Minister photo is shared nationwide across all cities.\n\nChanging it will update every city in the system.\n\nDo you want to continue?`
        );
        if (!confirmed) { input.value = ''; return; }
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);

    // Upload to server
    const formData = new FormData();
    formData.append('file', input.files[0]);

    try {
        const response = await fetch(`${API_BASE}/files/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${jwtToken}` },
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            settingImageUrls[settingKey] = result.data.url;
            // Show the remove button wrapper now that an image is set
            const keyPrefix = settingKey.replace('ImageUrl', '');
            const wrap = document.getElementById(keyPrefix + 'ImagePreviewWrap');
            if (wrap) { wrap.style.display = 'block'; }
        } else {
            showAlert('settingsAlert', '⚠ Image upload failed. Please try again.', 'error');
        }
    } catch (err) {
        showAlert('settingsAlert', '⚠ Upload error: ' + err.message, 'error');
    }
}

// Remove a settings image
function removeSettingsImage(inputId, previewId, wrapId, settingKey, scope) {
    if (scope === 'cm') {
        const selectedState = (document.getElementById('stateSelect') || {}).value || currentAdmin.state;
        const confirmed = confirm(
            `⚠️ Removing the Chief Minister photo will clear it for all cities in ${selectedState}.

Do you want to continue?`
        );
        if (!confirmed) return;
    }
    if (scope === 'pm') {
        const confirmed = confirm(
            `⚠️ Removing the Prime Minister photo will clear it nationwide for all cities.

Do you want to continue?`
        );
        if (!confirmed) return;
    }

    // Clear preview and in-memory URL
    const input = document.getElementById(inputId);
    const wrap  = document.getElementById(wrapId);
    const img   = document.getElementById(previewId);
    if (input) input.value = '';
    if (img)   { img.src = ''; }
    if (wrap)  { wrap.style.display = 'none'; }
    settingImageUrls[settingKey] = null;
}

// Save settings
function saveSettings() {
    const corporationName = document.getElementById('corporationName').value;
    const selectedState = document.getElementById('stateSelect').value;
    const selectedCity = document.getElementById('citySelect').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactPhone = document.getElementById('contactPhone').value;
    
    // Validate required fields
    if (!corporationName || !selectedState || !selectedCity) {
        showAlert('settingsAlert', '⚠ Please fill in all required fields (Corporation Name, State, City)', 'error');
        return;
    }
    
    const settings = {
        corporationName: corporationName,
        state: selectedState,
        city: selectedCity,
        contactEmail: contactEmail,
        contactPhone: contactPhone
    };
    
    // Save to localStorage
    localStorage.setItem('systemSettings', JSON.stringify(settings));

    // Update the in-memory currentAdmin so all data functions use the new city immediately
    if (currentAdmin) {
        currentAdmin.state = selectedState;
        currentAdmin.city = selectedCity;
    }

    showAlert('settingsAlert', '✓ Settings saved successfully. Reloading data for ' + selectedCity + '...', 'success');

    // Persist political figure image URLs to backend (PM/CM auto-propagated server-side)
    const imagePayload = {
        pmImageUrl: settingImageUrls.pmImageUrl || null,
        cmImageUrl: settingImageUrls.cmImageUrl || null,
        mlaImageUrl: settingImageUrls.mlaImageUrl || null
    };
    fetch(`${API_BASE}/region?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(imagePayload)
    }).catch(err => console.error('Failed to persist region image settings:', err));

    // Reload data for the currently visible page with the new city
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id;
        if (pageId === 'dashboard') {
            loadDashboardData();
        } else if (pageId === 'wardOfficers') {
            loadWardOfficers();
        } else if (pageId === 'analytics') {
            loadAnalytics();
        }
    }
}

// Indian States and Cities Data
const STATES_AND_CITIES = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Rajahmundry', 'Kakinada', 'Eluru'],
    'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Pasighat', 'Tezu', 'Roing'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Nagaon', 'Jorhat', 'Barpeta', 'Tezpur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Durg', 'Rajnandgaon', 'Bilaspur', 'Raigarh'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Ponda', 'Bicholim'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Kutch'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Rohtak', 'Panipat', 'Ambala', 'Yamunanagar'],
    'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Kangra', 'Kullu', 'Hamirpur'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Giridih', 'Bokaro', 'Deoghar', 'Hazaribagh'],
    'Karnataka': ['Bangalore', 'Mangalore', 'Mysore', 'Belagavi', 'Hubballi', 'Davangere', 'Tumkur', 'Kolar'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Kottayam', 'Pathanamthitta', 'Malappuram'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Aurangabad', 'Nashik', 'Vasai', 'Kolhapur'],
    'Manipur': ['Imphal', 'Bishnupur', 'Kakching', 'Thoubal', 'Senapati'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Kolasib', 'Champhai'],
    'Nagaland': ['Kohima', 'Dimapur', 'Wokha', 'Mon', 'Tuensang'],
    'Odisha': ['Bhubaneswar', 'Rourkela', 'Cuttack', 'Berhampur', 'Balasore', 'Sambhalpur'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar', 'Bathinda', 'Hoshiarpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Keshod'],
    'Sikkim': ['Gangtok', 'Pelling', 'Mangan', 'Namchi', 'Gyalshing'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruppur', 'Erode', 'Vellore'],
    'Tripura': ['Agartala', 'Udaipur', 'Ambassa', 'Dharmanagar', 'Kailashahar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Ghaziabad', 'Agra', 'Meerut', 'Allahabad', 'Noida'],
    'Uttarakhand': ['Dehradun', 'Haldwani', 'Nainital', 'Pithoragarh', 'Pauri', 'Rudraprayag'],
    'West Bengal': ['Kolkata', 'Dakshineswar', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Darjeeling']
};

// Initialize state selector dropdown
function initializeStates() {
    const stateSelect = document.getElementById('stateSelect');
    if (!stateSelect) return;
    
    const states = Object.keys(STATES_AND_CITIES).sort();
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
    
    // Load saved state if exists
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.state) {
            stateSelect.value = settings.state;
            loadCitiesForState();
            if (settings.city) {
                document.getElementById('citySelect').value = settings.city;
            }
        }
    }

    // Reload region images when city changes in settings
    const citySelectEl = document.getElementById('citySelect');
    if (citySelectEl) {
        citySelectEl.addEventListener('change', () => loadSystemImageSettings());
    }

    // Load existing political figure image previews from backend
    loadSystemImageSettings();
}

// Load cities based on selected state
function loadCitiesForState() {
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    const selectedState = stateSelect.value;
    
    // Clear existing cities
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    if (selectedState && STATES_AND_CITIES[selectedState]) {
        const cities = STATES_AND_CITIES[selectedState].sort();
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}
function fetchAPI(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : API_BASE + endpoint;
    
    // Add authorization header if not present and token exists
    if (!options.headers) options.headers = {};
    if (!options.headers['Authorization'] && jwtToken) {
        options.headers['Authorization'] = `Bearer ${jwtToken}`;
    }
    // Always bypass browser cache so refreshes after create/edit/delete show fresh data
    if (!options.method || options.method === 'GET') {
        options.cache = 'no-store';
    }
    
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        });
}

// Logout
function logout() {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminRole');
    localStorage.removeItem('superAdminName');
    localStorage.removeItem('superAdminId');
    
    window.location.href = '/super-admin-dashboard.html';
}
