# Municipal Corporation Complaints App - API Testing Guide

Base URL: `http://localhost:9999`

## 🔐 Authentication Flow

### 1. Request OTP
```bash
curl -X POST http://localhost:9999/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "role": "CITIZEN"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "message": "OTP sent successfully",
    "identifier": "9876543210",
    "otp": "123456"
  }
}
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:9999/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "123456"
  }'
```

**Response (New User):**
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

**Response (Existing User):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "verified": true,
    "isRegistered": true,
    "identifier": "9876543210",
    "userId": 1,
    "userName": "John Doe",
    "role": "CITIZEN",
    "token": "jwt-token-1"
  }
}
```

### 3. Register New User (if not registered)
```bash
curl -X POST "http://localhost:9999/api/auth/register?identifier=9876543210" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street, Mumbai",
    "wardNumber": "Ward-15",
    "leaderId": 1
  }'
```

## 👤 User Management

### Get Current User Profile
```bash
curl -X GET "http://localhost:9999/api/users/me?userId=1"
```

### Update User Profile
```bash
curl -X PUT "http://localhost:9999/api/users/me?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "phone": "9876543210",
    "email": "john.updated@example.com",
    "address": "456 New Street, Mumbai",
    "wardNumber": "Ward-15"
  }'
```

### Change Associated Leader
```bash
curl -X PUT "http://localhost:9999/api/users/me/leader?userId=1&leaderId=2"
```

## 🎫 Ticket Management (Citizen)

### Create Ticket
```bash
curl -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Street Light Not Working",
    "description": "The street light near my house has been broken for 3 days",
    "type": "COMPLAINT",
    "category": "STREET_LIGHTS",
    "imageUrls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }'
```

**Categories:**
- DRAINAGE
- ROADS
- PARKS
- STREET_LIGHTS
- WATER_SUPPLY
- GARBAGE_COLLECTION
- OTHER

**Types:**
- COMPLAINT
- FEEDBACK

### Get My Tickets
```bash
curl -X GET "http://localhost:9999/api/tickets?userId=1"
```

### Get Specific Ticket
```bash
curl -X GET "http://localhost:9999/api/tickets/1"
```

### Get Ticket by Ticket ID
```bash
curl -X GET "http://localhost:9999/api/tickets/by-ticket-id/TKT-ABC12345"
```

## 👔 Leader/Admin Operations

### Get All Active Leaders
```bash
curl -X GET "http://localhost:9999/api/leaders"
```

### Get Leaders by Jurisdiction
```bash
curl -X GET "http://localhost:9999/api/leaders?jurisdiction=Ward-15"
```

### Get Leader by ID
```bash
curl -X GET "http://localhost:9999/api/leaders/1"
```

### Create New Leader
```bash
curl -X POST "http://localhost:9999/api/leaders" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "phone": "9123456789",
    "email": "rajesh@municipal.gov",
    "jurisdiction": "Ward-15",
    "designation": "Ward Officer"
  }'
```

### Update Leader
```bash
curl -X PUT "http://localhost:9999/api/leaders/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar Updated",
    "phone": "9123456789",
    "email": "rajesh.updated@municipal.gov",
    "jurisdiction": "Ward-15",
    "designation": "Senior Ward Officer"
  }'
```

### Deactivate Leader
```bash
curl -X DELETE "http://localhost:9999/api/leaders/1"
```

## 🎯 Admin Ticket Management

### Get All Tickets for Leader
```bash
curl -X GET "http://localhost:9999/api/admin/tickets?leaderId=1"
```

### Get Tickets by Status
```bash
curl -X GET "http://localhost:9999/api/admin/tickets?leaderId=1&status=OPEN"
```

**Statuses:**
- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

### Update Ticket Status
```bash
curl -X PUT "http://localhost:9999/api/admin/tickets/1/status?status=IN_PROGRESS"
```

### Add Comment to Ticket
```bash
curl -X POST "http://localhost:9999/api/admin/tickets/1/comments?commentedBy=Rajesh%20Kumar" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "We have received your complaint and our team will visit the location tomorrow."
  }'
```

### Close Ticket
```bash
curl -X PUT "http://localhost:9999/api/admin/tickets/1/close" \
  -H "Content-Type: application/json" \
  -d '{
    "resolutionNote": "Street light has been repaired and is now working properly."
  }'
```

## 🔍 Complete End-to-End Flow Example

### 1. Create a Leader First
```bash
curl -X POST "http://localhost:9999/api/leaders" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "phone": "9123456789",
    "email": "rajesh@municipal.gov",
    "jurisdiction": "Ward-15",
    "designation": "Ward Officer"
  }'
```

### 2. Request OTP as Citizen
```bash
curl -X POST http://localhost:9999/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "role": "CITIZEN"
  }'
```

### 3. Verify OTP
```bash
curl -X POST http://localhost:9999/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "YOUR_OTP_HERE"
  }'
```

### 4. Register as Citizen
```bash
curl -X POST "http://localhost:9999/api/auth/register?identifier=9876543210" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street, Mumbai",
    "wardNumber": "Ward-15",
    "leaderId": 1
  }'
```

### 5. Create Complaint
```bash
curl -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken Street Light",
    "description": "Street light near house number 123 is not working",
    "type": "COMPLAINT",
    "category": "STREET_LIGHTS",
    "imageUrls": []
  }'
```

### 6. Leader Views Tickets
```bash
curl -X GET "http://localhost:9999/api/admin/tickets?leaderId=1"
```

### 7. Leader Updates Status
```bash
curl -X PUT "http://localhost:9999/api/admin/tickets/1/status?status=IN_PROGRESS"
```

### 8. Leader Adds Comment
```bash
curl -X POST "http://localhost:9999/api/admin/tickets/1/comments?commentedBy=Rajesh%20Kumar" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Team dispatched to location. Will be fixed by tomorrow."
  }'
```

### 9. Leader Closes Ticket
```bash
curl -X PUT "http://localhost:9999/api/admin/tickets/1/close" \
  -H "Content-Type: application/json" \
  -d '{
    "resolutionNote": "Street light repaired successfully. Tested and working."
  }'
```

### 10. Citizen Views Ticket Status
```bash
curl -X GET "http://localhost:9999/api/tickets?userId=1"
```

## 🧪 Testing with Postman

Import these requests into Postman:

1. Create a new Collection: "Municipal Corp API"
2. Add environment variables:
   - `baseUrl`: `http://localhost:9999`
   - `userId`: `1` (update after registration)
   - `leaderId`: `1` (update after creating leader)
   - `ticketId`: `1` (update after creating ticket)

3. Use `{{baseUrl}}`, `{{userId}}`, etc. in your requests

## 📊 Database Console

Access H2 Console: http://localhost:9999/h2-console

**Connection Settings:**
- JDBC URL: `jdbc:h2:mem:municipal_db`
- Username: `sa`
- Password: (leave empty)

## 🚀 Quick Health Check

```bash
curl http://localhost:9999/api/health
```

**Response:**
```json
{
  "status": "UP",
  "message": "Municipal Corp Application is running!"
}
```

## 📝 Notes

- OTP is automatically logged in the console for development
- In production, implement actual SMS/Email service
- JWT tokens are currently mocked - implement proper JWT in production
- File upload service needs implementation for image storage
- All endpoints return `ApiResponse<T>` wrapper with:
  - `success`: boolean
  - `message`: string
  - `data`: T (response payload)

## 🐛 Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

**Validation Error Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "title": "must not be blank",
    "category": "must not be blank"
  }
}
```
