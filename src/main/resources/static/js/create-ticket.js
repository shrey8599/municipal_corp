// Create ticket functionality
let uploadedFiles = [];
let uploadedImageUrls = [];

document.addEventListener('DOMContentLoaded', () => {
    if (requireAuth()) {
        setupFileUpload();
        setupCharCounters();
    }
});

// Setup file upload
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        
        for (const file of files) {
            if (file.size > 10 * 1024 * 1024) {
                showAlert(`File ${file.name} ${t('createTicket.fileTooLarge')}`, 'error');
                continue;
            }
            
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                showAlert(`File ${file.name} ${t('createTicket.invalidFormat')}`, 'error');
                continue;
            }
            
            try {
                const url = await uploadFile(file);
                uploadedImageUrls.push(url);
                
                // Show preview
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${url}" alt="Preview">
                    <button class="preview-remove" onclick="removeImage('${url}')">×</button>
                `;
                previewContainer.appendChild(previewItem);
                
                showAlert(`${file.name} ${t('createTicket.uploadSuccess')}`, 'success');
            } catch (error) {
                showAlert(`${t('createTicket.uploadFailed')} ${file.name}`, 'error');
            }
        }
        
        fileInput.value = '';
    });
}

// Upload file to server
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
    }
    
    return data.data.url;
}

// Remove uploaded image
function removeImage(url) {
    uploadedImageUrls = uploadedImageUrls.filter(u => u !== url);
    event.target.parentElement.remove();
}

// Setup character counters
function setupCharCounters() {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    
    if (title) {
        title.addEventListener('input', (e) => {
            const count = e.target.value.length;
            e.target.parentElement.querySelector('.char-count').textContent = `${count}/100 characters`;
        });
    }
    
    if (description) {
        description.addEventListener('input', (e) => {
            const count = e.target.value.length;
            e.target.parentElement.querySelector('.char-count').textContent = `${count}/500 characters`;
        });
    }
}

// Submit ticket form
document.getElementById('ticketForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = getUser();
    if (!user || !user.id) {
        showAlert(t('createTicket.userNotFound'), 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = t('createTicket.submitting');
    
    const ticketData = {
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        imageUrls: uploadedImageUrls
    };
    
    try {
        const response = await apiRequest(`/tickets?userId=${user.id}`, {
            method: 'POST',
            body: JSON.stringify(ticketData)
        });
        
        if (response.success) {
            showAlert(t('createTicket.submitSuccess'), 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    } catch (error) {
        showAlert(error.message || t('createTicket.submitFailed'), 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = t('createTicket.submit');
    }
});

// Function to update category options translations when language changes
window.updateCreateTicketTranslations = function() {
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        // Update category options
        const options = categorySelect.querySelectorAll('option');
        const categoryKeys = ['categoryPlaceholder', 'categoryStreetLights', 'categoryRoads', 'categoryWater', 'categoryGarbage', 'categorySewage', 'categoryParks', 'categoryOthers'];
        
        options.forEach((option, index) => {
            if (index < categoryKeys.length) {
                const key = categoryKeys[index];
                option.textContent = t(`createTicket.${key}`);
            }
        });
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && !submitBtn.disabled) {
        submitBtn.textContent = t('createTicket.submit');
    }
    
    // Apply all page translations
    applyPageTranslations();
};
