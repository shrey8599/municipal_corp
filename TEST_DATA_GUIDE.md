# 🎉 Automatic Test Data Initialization

Your Municipal Corp application now **automatically creates test data** every time the server starts!

## ✅ What Was Added

A new `DataInitializer` class that runs on application startup and populates the H2 database with:
- **3 Leaders** (Ward Officers)
- **4 Citizens** (Users)
- **7 Sample Tickets** (Various statuses and categories)

---

## 📱 Test Accounts

### Leaders (Ward Officers)

| Phone Number | Name | Ward | Email |
|--------------|------|------|-------|
| `1111111111` | Ward Officer - Ward 5 | 5 | officer.ward5@municipal.gov |
| `3333333333` | Ward Officer - Ward 10 | 10 | officer.ward10@municipal.gov |
| `4444444444` | Senior Ward Officer | 1,2,3 | senior.officer@municipal.gov |

### Citizens (Users)

| Phone Number | Name | Ward | Email | Assigned Leader | Tickets |
|--------------|------|------|-------|----------------|---------|
| `2222222222` | Test Citizen | 5 | citizen1@test.com | Ward Officer (Ward 5) | 2 tickets |
| `5555555555` | John Doe | 5 | john.doe@test.com | Ward Officer (Ward 5) | 2 tickets |
| `6666666666` | Jane Smith | 10 | jane.smith@test.com | Ward Officer (Ward 10) | 2 tickets |
| `7777777777` | Bob Johnson | 10 | bob.johnson@test.com | Ward Officer (Ward 10) | 1 ticket |

---

## 🎫 Sample Tickets Created

### Ward 5 Tickets (Citizen: `2222222222` & `5555555555`)

1. **Street Light Not Working** - OPEN
   - Category: STREET_LIGHTS
   - Type: COMPLAINT
   
2. **Pothole on Main Street** - IN_PROGRESS
   - Category: ROADS
   - Type: COMPLAINT

3. **Garbage Collection Missed** - OPEN
   - Category: GARBAGE_COLLECTION
   - Type: COMPLAINT

4. **New Park Request** - OPEN
   - Category: OTHER
   - Type: SUGGESTION

### Ward 10 Tickets (Citizen: `6666666666` & `7777777777`)

5. **Water Leakage** - RESOLVED ✓
   - Category: WATER_SUPPLY
   - Type: COMPLAINT

6. **Drainage Issue** - IN_PROGRESS
   - Category: DRAINAGE
   - Type: COMPLAINT

7. **Tree Trimming Required** - OPEN
   - Category: OTHER
   - Type: SUGGESTION

---

## 🚀 How to Use Test Data

### Login as Citizen

1. Go to: `http://localhost:9999/login.html`
2. Enter phone: `2222222222` (or any other citizen phone)
3. Click "Send OTP"
4. Check browser console (F12 → Network → Response) for OTP code
5. Enter OTP and click "Verify"

**Example**:
```bash
curl -X POST http://localhost:9999/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "2222222222"}'
# Returns OTP in response
```

### Login as Leader

1. Go to: `http://localhost:9999/login.html`
2. Enter phone: `1111111111` (or any other leader phone)
3. Click "Send OTP"
4. Enter OTP and verify

### View Profile & Associated Leader

**Citizen View**:
- Login as `2222222222`
- Go to "Profile" to see your info
- Go to "Contact Ward Officer" to see assigned leader details

**Leader View**:
- Login as `1111111111`
- Go to "Dashboard" to see all tickets in your ward
- Go to "Profile" to edit your officer information

### Test New Profile Page (Individual Field Editing)

- Go to: `http://localhost:9999/profile-new.html`
- Login with any test account
- Click ✏️ icon next to any field to edit individually
- Test phone/email OTP verification

---

## 🔄 Auto-Initialization Details

### When Does It Run?

- **Every time the server starts**
- **After Spring Boot context is loaded**
- **Before the application accepts requests**

### What Happens?

1. Clears existing data (tickets, users, leaders, OTPs)
2. Creates 3 Leaders with different wards
3. Creates 4 Citizens and associates them with leaders
4. Creates 7 Sample tickets with various statuses
5. Logs completion with account summary

### Check Initialization Logs

```bash
tail -100 server.log | grep DataInitializer
```

You'll see:
```
🔄 Starting test data initialization...
✅ Created 3 leaders
✅ Created 4 citizens
✅ Created 7 tickets
🎉 Test data initialization completed successfully!
📱 Test Accounts:
   Leader 1: Phone 1111111111 (Ward 5)
   ...
```

---

## 🛠️ Customizing Test Data

To add more test data or modify existing data, edit:
```
src/main/java/com/example/municipalcorp/config/DataInitializer.java
```

### Add a New Leader

```java
Leader leader4 = createLeader(
    "8888888888",           // Phone
    "Officer Name",         // Name
    "email@ward.gov",       // Email
    "15",                   // Ward/Jurisdiction
    "Assistant Officer"     // Designation
);
```

### Add a New Citizen

```java
User citizen5 = createCitizen(
    "9999999999",           // Phone
    "New Citizen",          // Name
    "new@test.com",         // Email
    "123 New Street",       // Address
    "5",                    // Ward Number
    leader1                 // Assigned Leader
);
```

### Add a New Ticket

```java
createTicket(
    citizen1,                           // Citizen who created ticket
    "New Complaint",                    // Title
    "Description of the issue",         // Description
    ComplaintType.COMPLAINT,            // Type: COMPLAINT, FEEDBACK, SUGGESTION
    ComplaintCategory.STREET_LIGHTS,    // Category
    TicketStatus.OPEN                   // Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
);
```

---

## 📊 Database Schema

The test data is stored in H2 in-memory database:

- **Users Table**: Citizens with phone, email, ward, associated leader
- **Leaders Table**: Ward officers with jurisdiction and designation
- **Tickets Table**: Complaints/requests with category, status, and assignment
- **OTP Verifications Table**: OTP codes for authentication (auto-cleaned)

---

## 🔍 Verifying Test Data

### Check Leaders

```bash
curl -s http://localhost:9999/api/leaders | jq '.'
```

### Check User (Requires Authentication)

```bash
# First, login to get token
OTP=$(curl -s -X POST http://localhost:9999/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier":"2222222222"}' | jq -r '.data.otp')

TOKEN=$(curl -s -X POST http://localhost:9999/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"2222222222\",\"otp\":\"$OTP\"}" | jq -r '.data.token')

# Now fetch user with leader info
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:9999/api/users/1 | jq '.'
```

### Check Tickets (Requires Authentication)

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:9999/api/tickets | jq '.'
```

---

## 🎯 Benefits

✅ **No manual data entry needed**
✅ **Consistent test data across server restarts**
✅ **Quick testing and development**
✅ **Realistic data with relationships** (citizens ↔ leaders ↔ tickets)
✅ **Various ticket statuses for testing workflows**
✅ **Multiple wards for testing jurisdiction logic**

---

## ⚠️ Important Notes

1. **H2 In-Memory Database**: Data resets on server restart (test data auto-recreates)
2. **OTP in Development**: OTP codes are returned in API responses for easy testing
3. **Production**: Replace H2 with PostgreSQL/MySQL for persistent data
4. **Disable Auto-Init**: Comment out `@Component` annotation in `DataInitializer.java` if not needed

---

## 🚦 Server Status

**Current Server**: Running on port `9999`
**Test Data**: ✅ Loaded successfully
**Available Endpoints**: 
- Login: http://localhost:9999/login.html
- Dashboard: http://localhost:9999/dashboard.html
- Profile: http://localhost:9999/profile.html
- New Profile (Individual Edit): http://localhost:9999/profile-new.html
- Contact Leader: http://localhost:9999/contact-leader.html

**Ready to test!** 🎉
