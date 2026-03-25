# 🌐 Web UI Guide - Municipal Corporation Application

## ✅ UI is Now Live!

Your Municipal Corporation application now has a **complete web interface** that works alongside the REST API.

---

## 🔗 Access URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Homepage** | http://localhost:9999/ | Landing page with features |
| **Login/Register** | http://localhost:9999/login.html | OTP-based authentication |
| **Dashboard** | http://localhost:9999/dashboard.html | View all your complaints |
| **File Complaint** | http://localhost:9999/create-ticket.html | Submit new complaint with photos |
| **Complaint Details** | http://localhost:9999/ticket-details.html?id=X | View specific complaint and add comments |

---

## 🚀 How to Use the Web UI

### Step 1: Open the Application
1. Open your browser
2. Navigate to: **http://localhost:9999/**
3. Click **"Get Started"** button

### Step 2: Register/Login  
1. Enter your **10-digit mobile number**
2. Select role (**Citizen** or **Ward Officer**)
3. Click **"Send OTP"**
4. Enter the **6-digit OTP** shown in the response (for development)
5. If NEW user:
   - Fill registration form (Name, Email, Address, Ward Number)
   - Select your Ward Officer
   - Click **"Complete Registration"**
6. If EXISTING user:
   - You'll be automatically logged in

### Step 3: View Dashboard
- See statistics: Open, In Progress, Resolved complaints
- View all your complaints in a card layout
- Click any complaint card to view details

### Step 4: File a New Complaint
1. Click **"➕ New Complaint"** or navigate to **File Complaint** page
2. Fill in the form:
   - **Type**: Complaint / Request / Suggestion
   - **Category**: Street Lights, Roads, Water Supply, Garbage, Sewage, Parks, Others
   - **Title**: Brief description (max 100 chars)
   - **Description**: Detailed info (max 500 chars)
   - **Photos**: Upload images (optional, max 10MB each)
3. Click **"Submit Complaint"**

### Step 5: Track Complaint Status
1. Click on any complaint from dashboard
2. View details: Status, Assigned Officer, Timeline
3. Read updates and resolution notes
4. Add comments to communicate with the ward officer

---

## 📱 Features

### ✨ For Citizens
- ✅ OTP-based registration (no passwords!)
- ✅ File complaints with photos
- ✅ Track complaint status in real-time
- ✅ Add comments and updates
- ✅ View assigned ward officer
- ✅ Dashboard with statistics

### ✨ For Ward Officers
- ✅ View assigned complaints
- ✅ Add resolution notes
- ✅ Update complaint status
- ✅ Communicate with citizens via comments

### ✨ Technical Features
- ✅ Responsive design (works on mobile/tablet/desktop)
- ✅ JWT token authentication
- ✅ Persistent login (token stored in browser)
- ✅ Image upload with preview
- ✅ Clean, modern UI with animations
- ✅ Real-time form validation
- ✅ Alert notifications

---

## 🎨 UI Design

### Color Scheme
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#28a745)
- **Warning**: Yellow (#ffc107)
- **Danger**: Red (#dc3545)
- **Light**: Gray (#f8f9fa)

### Pages Overview

**1. Homepage (index.html)**
- Hero section with call-to-action
- Feature cards (6 key features)
- Statistics section
- CTA to register

**2. Login Page (login.html)**
- 3-step process: Phone → OTP → Registration
- Single page flow (no page reloads)
- Auto-progression through steps

**3. Dashboard (dashboard.html)**
- Sidebar navigation
- Statistics cards (Open, In Progress, Resolved, Total)
- Complaint cards with status badges
- Quick actions

**4. Create Complaint (create-ticket.html)**
- Form with all required fields
- Character counters for Title and Description
- Image upload with preview
- File size and type validation

**5. Complaint Details (ticket-details.html)**
- Full complaint information
- Image gallery (if photos uploaded)
- Comments section
- Add comment form

---

## 🔒 Authentication Flow

```
1. User enters phone number → API: POST /api/auth/send-otp
2. System sends OTP (shown in dev mode)
3. User enters OTP → API: POST /api/auth/verify-otp
4. If new user:
   - Show registration form
   - User fills details → API: POST /api/auth/register
   - Receive JWT token
5. If existing user:
   - Receive JWT token directly
6. Token stored in localStorage
7. All subsequent API calls include: Authorization: Bearer <token>
8. User can logout (clears token)
```

---

## 📂 File Structure

```
src/main/resources/static/
├── index.html              Landing page
├── login.html              Login/Registration
├── dashboard.html          User dashboard
├── create-ticket.html      File new complaint
├── ticket-details.html     View complaint details
├── css/
│   └── styles.css          Main stylesheet (responsive)
└── js/
    ├── common.js           Shared utilities, API wrapper
    ├── auth.js             Authentication logic
    ├── dashboard.js        Dashboard functionality
    ├── create-ticket.js    Complaint creation + file upload
    └── ticket-details.js   Complaint details + comments
```

---

## 🧪 Testing the UI

### Test Flow 1: New User Registration
```
1. Open http://localhost:9999/
2. Click "Get Started"
3. Enter phone: 1234567890, Role: Citizen
4. Click "Send OTP"
5. Note the OTP from response (e.g., "802004")
6. Enter OTP and verify
7. Fill registration form:
   - Name: Test User
   - Email: test@example.com
   - Address: 123 Test St
   - Ward: Ward-10
   - Select a Ward Officer
8. Submit registration
9. Redirected to dashboard
```

### Test Flow 2: Create Complaint
```
1. From dashboard, click "File New Complaint"
2. Select Type: Complaint
3. Select Category: Street Lights
4. Title: "Street light broken on Main St"
5. Description: "The light has been out for 3 days..."
6. (Optional) Upload a photo
7. Click "Submit Complaint"
8. Redirected to dashboard
9. See new complaint in the list
```

### Test Flow 3: View and Comment
```
1. Click on any complaint card
2. View full details
3. Scroll to comments section
4. Add a comment: "When will this be fixed?"
5. Click "Post Comment"
6. See comment appear
```

---

## 🐛 Troubleshooting

### Issue: 403 Forbidden on pages
**Solution**: Security config updated - all `.html`, `/css/**`, `/js/**` paths are public

### Issue: JWT token expired
**Solution**: Login again to get fresh token (24-hour expiry)

### Issue: Images not uploading
**Checklist**:
- File size < 10MB?
- File type is JPEG, PNG, or GIF?
- JWT token still valid?
- Check browser console for errors

### Issue: Complaints not loading
**Checklist**:
- Logged in user has correct ID?
- Backend API responding? (Check: http://localhost:9999/api/health)
- Check browser console for API errors

---

## 💡 Development Mode Notes

### OTP Display
- For development, OTP is displayed in the API response
- Production: Send via SMS gateway

### Token Storage
- Stored in browser's localStorage
- Persists across page refreshes
- Cleared on logout

### Database
- Using H2 in-memory database
- Data lost on server restart
- For production: Switch to PostgreSQL

---

## 🎯 Next Steps

### Enhancements You Can Add:
1. **Search/Filter** on dashboard (by status, category, date)
2. **Pagination** for large complaint lists
3. **Notifications** using WebSocket for real-time updates
4. **Profile Page** to edit user details
5. **Leader Dashboard** with advanced filters
6. **Analytics Page** with charts and graphs
7. **Dark Mode** toggle
8. **Export** complaints to PDF/Excel
9. **Email Notifications** on status changes
10. **Mobile App** using React Native (same APIs)

### Production Checklist:
- [ ] Change JWT secret to environment variable
- [ ] Integrate real SMS gateway for OTP
- [ ] Switch to PostgreSQL database
- [ ] Add rate limiting for API endpoints
- [ ] Enable HTTPS
- [ ] Add comprehensive error handling
- [ ] Set up logging and monitoring
- [ ] Add automated backups
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline

---

## 🎉 Summary

**Your Municipal Corporation application now has:**
- ✅ Complete web UI (5 HTML pages)
- ✅ Responsive CSS styling
- ✅ Interactive JavaScript (5 modules)
- ✅ JWT authentication flow
- ✅ File upload functionality
- ✅ Real-time form validation
- ✅ Clean, modern design
- ✅ Mobile-friendly layout

**Ready to use at:** http://localhost:9999/

**API still works:** Swagger UI at http://localhost:9999/swagger-ui.html

---

**Congratulations! Your application now has both a REST API AND a complete web interface! 🚀**
