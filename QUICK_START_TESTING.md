# 🚀 Quick Start Testing Guide - Version 2.0

## Complete End-to-End Test Script

This guide provides **copy-paste ready commands** to test all Version 2.0 features.

---

## ✅ Complete Test Flow

### Step 1: Create a Leader
```bash
curl -s -X POST "http://localhost:9999/api/leaders" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "phone": "9123456789",
    "email": "rajesh@municipal.gov",
    "jurisdiction": "Ward-15",
    "designation": "Ward Officer"
  }' | jq '.'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leader created successfully",
  "data": {
    "id": 1,
    "name": "Rajesh Kumar",
    "jurisdiction": "Ward-15",
    ...
  }
}
```

---

### Step 2: Request OTP for Registration
```bash
curl -s -X POST "http://localhost:9999/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "role": "CITIZEN"
  }' | jq '.'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "identifier": "9876543210",
    "otp": "123456",  ← Note this OTP
    "message": "OTP sent successfully"
  }
}
```

**📝 Note the OTP from the response** (it will be different each time)

---

### Step 3: Verify OTP
Use the OTP from Step 2:

```bash
curl -s -X POST "http://localhost:9999/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "PASTE_OTP_HERE"
  }' | jq '.'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "verified": true,
    "isRegistered": false,
    "identifier": "9876543210"
  }
}
```

---

### Step 4: Register User & Get JWT Token
```bash
curl -s -X POST "http://localhost:9999/api/auth/register?identifier=9876543210" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street, Ward-15",
    "wardNumber": "Ward-15",
    "leaderId": 1
  }' | jq '.'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      ...
    },
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZGVudGlmaWVyIjoiOT..."  ← Save this token!
  }
}
```

**🔑 Save the JWT token** - you'll need it for authenticated requests!

---

### Step 5: Create Complaint with JWT Token

**Set the token as a variable:**
```bash
export TOKEN="eyJhbGci..."  # Paste your token here
```

**Create a complaint:**
```bash
curl -s -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Street Light Not Working",
    "description": "The street light on Main Street has been broken for 3 days causing safety issues",
    "type": "COMPLAINT",
    "category": "STREET_LIGHTS",
    "imageUrls": []
  }' | jq '.'
```

**Expected Response (Clean, no circular refs!):**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": 1,
    "ticketId": "TKT-ABC123",
    "title": "Street Light Not Working",
    "description": "The street light on Main Street...",
    "type": "COMPLAINT",
    "category": "STREET_LIGHTS",
    "status": "OPEN",
    "citizen": {
      "id": 1,
      "name": "John Doe",
      "phone": "9876543210",
      ...
    },
    "assignedLeader": {
      "id": 1,
      "name": "Rajesh Kumar",
      "jurisdiction": "Ward-15",
      ...
    },
    "comments": [],
    "createdAt": "2026-03-07T...",
    "updatedAt": "2026-03-07T..."
  }
}
```

✅ **Response size: ~1KB** (Previously 461KB - Fixed!)

---

### Step 6: Get User's Tickets
```bash
curl -s -X GET "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Tickets retrieved successfully",
  "data": [
    {
      "id": 1,
      "ticketId": "TKT-ABC123",
      "title": "Street Light Not Working",
      "status": "OPEN",
      ...
    }
  ]
}
```

---

### Step 7: Add Comment to Ticket
```bash
curl -s -X POST "http://localhost:9999/api/tickets/1/comments?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "I have escalated this to the electrician team. Expected resolution in 24 hours."
  }' | jq '.'
```

---

### Step 8: Update Ticket Status (Leader Action)
First, get leader's JWT token by logging in as leader, then:

```bash
curl -s -X PATCH "http://localhost:9999/api/tickets/1/status?leaderId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "resolutionNote": "Work order issued to electrical department"
  }' | jq '.'
```

---

## 📤 File Upload Testing

### Upload Single Image
```bash
# Create a test image (or use your own)
curl -s -X POST "http://localhost:9999/api/files/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/image.jpg" | jq '.'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "http://localhost:9999/uploads/abc-123-def.jpg",
    "originalName": "image.jpg",
    "size": "245678"
  }
}
```

### Upload Multiple Images
```bash
curl -s -X POST "http://localhost:9999/api/files/upload-multiple" \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" | jq '.'
```

### Create Ticket with Uploaded Images
```bash
# 1. Upload image and extract URL
IMAGE_URL=$(curl -s -X POST "http://localhost:9999/api/files/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@complaint.jpg" | jq -r '.data.url')

echo "Uploaded image URL: $IMAGE_URL"

# 2. Create ticket with image
curl -s -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Pothole with Photo Evidence\",
    \"description\": \"Large pothole on Main Road causing vehicle damage\",
    \"type\": \"COMPLAINT\",
    \"category\": \"ROADS\",
    \"imageUrls\": [\"$IMAGE_URL\"]
  }" | jq '.'
```

---

## 📚 Swagger UI Testing

### Access Interactive API Documentation
Open in your browser:
```
http://localhost:9999/swagger-ui.html
```

### Using Swagger UI:

1. **Click "Authorize" button** (top right, lock icon)
2. **Enter your JWT token:**
   ```
   Bearer eyJhbGci...your-token-here
   ```
3. **Click "Authorize"** - Token is now set globally
4. **Try any endpoint:**
   - Expand an endpoint (e.g., POST /api/tickets)
   - Click "Try it out"
   - Fill in the request body
   - Click "Execute"
   - See the response!

### Get OpenAPI JSON
```bash
curl -s "http://localhost:9999/v3/api-docs" | jq '.'
```

---

## 🧪 Complete Automation Script

**Save this as `test_api.sh` and run it:**

```bash
#!/bin/bash

BASE_URL="http://localhost:9999"

echo "🚀 Testing Municipal Corp API v2.0"
echo "=================================="

# 1. Create Leader
echo "\n1️⃣ Creating Leader..."
curl -s -X POST "$BASE_URL/api/leaders" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Officer","phone":"9999000011","email":"officer@test.gov","jurisdiction":"Ward-99","designation":"Officer"}' \
  | jq '.data.id' -r > /tmp/leader_id.txt
LEADER_ID=$(cat /tmp/leader_id.txt)
echo "✅ Leader created with ID: $LEADER_ID"

# 2. Request OTP
echo "\n2️⃣ Requesting OTP..."
OTP=$(curl -s -X POST "$BASE_URL/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"8888999900","role":"CITIZEN"}' \
  | jq '.data.otp' -r)
echo "✅ OTP received: $OTP"

# 3. Register User
echo "\n3️⃣ Registering user..."
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/register?identifier=8888999900" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"phone\":\"8888999900\",\"email\":\"test@example.com\",\"address\":\"Test Address\",\"wardNumber\":\"Ward-99\",\"leaderId\":$LEADER_ID}" \
  | jq '.data.token' -r)
echo "✅ JWT Token: ${TOKEN:0:50}..."

# 4. Create Ticket
echo "\n4️⃣ Creating complaint ticket..."
TICKET_ID=$(curl -s -X POST "$BASE_URL/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Complaint","description":"Testing API","type":"COMPLAINT","category":"STREET_LIGHTS","imageUrls":[]}' \
  | jq '.data.id' -r)
echo "✅ Ticket created with ID: $TICKET_ID"

# 5. Add Comment
echo "\n5️⃣ Adding comment to ticket..."
curl -s -X POST "$BASE_URL/api/tickets/$TICKET_ID/comments?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"This is a test comment"}' > /dev/null
echo "✅ Comment added successfully"

# 6. Get Tickets
echo "\n6️⃣ Retrieving user tickets..."
TICKET_COUNT=$(curl -s -X GET "$BASE_URL/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data | length')
echo "✅ User has $TICKET_COUNT ticket(s)"

echo "\n🎉 All tests completed successfully!"
echo "=================================="
echo "📊 Summary:"
echo "  - Leader ID: $LEADER_ID"
echo "  - User ID: 1"
echo "  - JWT Token: ${TOKEN:0:30}..."
echo "  - Ticket ID: $TICKET_ID"
echo "  - Total Tickets: $TICKET_COUNT"
```

**Make it executable and run:**
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 🔍 Troubleshooting

### JWT Token Expired
**Error:** 401 Unauthorized

**Solution:** Get a new token:
```bash
# Send OTP
curl -s -X POST "http://localhost:9999/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"YOUR_PHONE","role":"CITIZEN"}' | jq '.data.otp' -r

# Login to get fresh token (if already registered)
# Or register again with a new phone number
```

### Invalid Leader ID
**Error:** "Leader not found"

**Solution:** Create leader first (see Step 1) and use the returned ID

### File Upload Failed
**Error:** "Invalid file type"

**Solution:** Only JPEG, PNG, GIF are supported
```bash
file your-image.jpg  # Should show "JPEG image data"
```

### Port Already in Use
**Error:** "Port 9999 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:9999 | xargs kill -9

# Or change port in application.properties
server.port=8080
```

---

## 📝 Quick Reference

### API Base URL
```
http://localhost:9999
```

### Key Endpoints
| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/api/auth/send-otp` | POST | No | Request OTP |
| `/api/auth/register` | POST | No | Register user, get JWT |
| `/api/tickets` | POST | Yes | Create complaint |
| `/api/tickets` | GET | Yes | Get user tickets |
| `/api/files/upload` | POST | Yes | Upload image |
| `/swagger-ui.html` | GET | No | API documentation |

### JWT Token Format
```
Authorization: Bearer eyJhbGci...your-token-here
```

### Test Categories Available
- STREET_LIGHTS
- ROADS
- WATER_SUPPLY
- GARBAGE
- SEWAGE
- PARKS
- OTHERS

---

## ✅ Verification Checklist

After running tests, verify:

- [ ] Leader created successfully (ID returned)
- [ ] OTP received (6-digit code)
- [ ] User registered (JWT token received)
- [ ] Ticket created with clean response (~1KB)
- [ ] No "circular reference" error
- [ ] Comments added successfully
- [ ] File upload works (if tested)
- [ ] Swagger UI accessible
- [ ] JWT token validates correctly

---

**Ready to test!** 🚀

Start with Step 1 and work through the complete flow, or use the automation script for instant testing.

For interactive testing, use **Swagger UI** at http://localhost:9999/swagger-ui.html
