# 🚀 Municipal Corp API - Enhanced Features v2.0

## 🎉 What's New in Version 2.0

Your Municipal Corporation Complaints Management System has been **significantly enhanced** with production-ready features!

### ✨ New Features Added

1. **JWT Token Authentication** 🔐
   - Real JWT tokens (not mocked anymore)
   - 24-hour token expiry
   - Secure HS512 algorithm
   - Bearer token support

2. **Swagger/OpenAPI Documentation** 📚
   - Interactive API documentation UI
   - Built-in API testing interface
   - Automatic endpoint discovery
   - Request/response examples

3. **File Upload Service** 📤
   - Image upload for complaints
   - Multiple file upload support
   - File type validation (JPEG, PNG, GIF)
   - Local file storage

4. **Unit Tests** ✅
   - OTPService tests (6 test cases)
   - UserService tests (7 test cases)
   - JwtUtil tests (7 test cases)
   - 100% test success rate

5. **JSON Serialization Fix** 🔧
   - Fixed circular reference issues
   - Clean DTO responses
   - Proper entity relationships

---

## 🔐 JWT Authentication Flow

### Step 1: Request OTP
```bash
curl -X POST "http://localhost:9999/api/auth/send-otp" \
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
    "identifier": "9876543210",
    "otp": "123456",
    "message": "OTP sent successfully"
  }
}
```

### Step 2: Verify OTP
```bash
curl -X POST "http://localhost:9999/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "123456"
  }'
```

**Response (Not Registered):**
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

### Step 3: Register User
```bash
curl -X POST "http://localhost:9999/api/auth/register?identifier=9876543210" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street",
    "wardNumber": "Ward-15",
    "leaderId": 1
  }'
```

**Response (includes JWT token):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZGVudGlmaWVyIjoiOTg3NjU0MzIxMCIsInJvbGUiOiJDSVRJWkVOI..."
  }
}
```

### Step 4: Use JWT Token for Authenticated Requests
```bash
TOKEN="your-jwt-token-here"

curl -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Street Light Not Working",
    "description": "The street light is broken",
    "type": "COMPLAINT",
    "category": "STREET_LIGHTS",
    "imageUrls": []
  }'
```

---

## 📚 Swagger/OpenAPI Documentation

### Access Interactive API Docs

**URL:** http://localhost:9999/swagger-ui.html

**Features:**
- Browse all API endpoints
- Test APIs directly from the browser
- See request/response schemas
- Try out authentication with JWT tokens
- View API descriptions and examples

**OpenAPI JSON:**
```bash
curl http://localhost:9999/v3/api-docs
```

### Using Swagger UI

1. **Open Swagger UI** at http://localhost:9999/swagger-ui.html
2. **Click "Authorize"** button (top right)
3. **Enter JWT token** format: `Bearer <your-token>`
4. **Click "Authorize"** to set globally
5. **Try any endpoint** - token will be included automatically!

---

## 📤 File Upload API

### Upload Single Image
```bash
curl -X POST "http://localhost:9999/api/files/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**Response:**
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
curl -X POST "http://localhost:9999/api/files/upload-multiple" \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "2 files uploaded successfully",
  "data": [
    {
      "url": "http://localhost:9999/uploads/abc-123.jpg",
      "originalName": "image1.jpg",
      "size": "123456"
    },
    {
      "url": "http://localhost:9999/uploads/def-456.jpg",
      "originalName": "image2.jpg",
      "size": "234567"
    }
  ]
}
```

### Create Ticket with Images
```bash
# 1. Upload images first
IMAGE_URL=$(curl -X POST "http://localhost:9999/api/files/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@complaint.jpg" | jq -r '.data.url')

# 2. Create ticket with image URL
curl -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Pothole on Main Road\",
    \"description\": \"Large pothole causing accidents\",
    \"type\": \"COMPLAINT\",
    \"category\": \"ROADS\",
    \"imageUrls\": [\"$IMAGE_URL\"]
  }"
```

---

## ✅ Unit Tests Summary

### Test Coverage

**Total Tests:** 20 test cases
**Success Rate:** 100%

**Test Suites:**

1. **OTPServiceTest** (6 tests)
   - ✅ Generate 6-digit OTP
   - ✅ Verify valid OTP
   - ✅ Reject expired OTP
   - ✅ Reject invalid OTP
   - ✅ Handle missing OTP
   - ✅ Cleanup expired OTPs

2. **UserServiceTest** (7 tests)
   - ✅ Register citizen with valid data
   - ✅ Reject duplicate registration
   - ✅ Get user by ID
   - ✅ Handle invalid user ID
   - ✅ Check if phone registered
   - ✅ Check if email registered
   - ✅ Update associated leader

3. **JwtUtilTest** (7 tests)
   - ✅ Generate valid token
   - ✅ Extract identifier from token
   - ✅ Extract userId from token
   - ✅ Extract role from token
   - ✅ Validate token
   - ✅ Reject invalid token
   - ✅ Check token expiration

### Running Tests
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=OTPServiceTest

# Run with coverage
./mvnw clean verify jacoco:report
```

---

## 🔧 Configuration

### application.properties

```properties
# Server
server.port=9999

# Database
spring.datasource.url=jdbc:h2:mem:municipal_db
spring.h2.console.enabled=true

# JWT Settings
jwt.secret=mySecretKeyForJWTTokenGenerationMustBeLongEnoughForHS256Algorithm
jwt.expiration=86400000

# File Upload
file.upload-dir=uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB

# Swagger
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

### JWT Configuration

**Algorithm:** HS512
**Token Expiry:** 24 hours (86400000 ms)
**Token Format:** `Bearer <token>`

**Token Structure:**
```json
{
  "userId": 1,
  "identifier": "9876543210",
  "role": "CITIZEN",
  "sub": "9876543210",
  "iat": 1772831109,
  "exp": 1772917509
}
```

---

## 📊 API Changes Summary

### Updated Endpoints

**AuthController:**
- ✅ Now returns real JWT tokens (not mocked)
- ✅ Token included in registration response
- ✅ Token included in login response

**New Endpoints:**
- ✅ `POST /api/files/upload` - Upload single image
- ✅ `POST /api/files/upload-multiple` - Upload multiple images

**Security:**
- ✅ All protected endpoints now require `Authorization: Bearer <token>` header
- ✅ JWT filter validates and extracts user info from token
- ✅ Automatic role-based access control

---

## 🧪 Testing the Enhanced Features

### Complete E2E Test Flow

```bash
# 1. Create a leader
curl -X POST "http://localhost:9999/api/leaders" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "phone": "9123456789",
    "email": "rajesh@municipal.gov",
    "jurisdiction": "Ward-15",
    "designation": "Ward Officer"
  }'

# 2. Request OTP
OTP_RESPONSE=$(curl -s -X POST "http://localhost:9999/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"9876543210","role":"CITIZEN"}')

OTP=$(echo $OTP_RESPONSE | jq -r '.data.otp')
echo "OTP: $OTP"

# 3. Register and get JWT token
REGISTER_RESPONSE=$(curl -s -X POST "http://localhost:9999/api/auth/register?identifier=9876543210" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main Street",
    "wardNumber": "Ward-15",
    "leaderId": 1
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# 4. Create complaint with JWT authentication
curl -X POST "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Street Light Not Working",
    "description": "The street light has been broken for 3 days",
    "type": "COMPLAINT",
    "category": "STREET_LIGHTS",
    "imageUrls": []
  }'

# 5. Get user's tickets with JWT
curl -X GET "http://localhost:9999/api/tickets?userId=1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 New Files Added

```
src/main/java/com/example/municipalcorp/
├── config/
│   └── OpenAPIConfig.java                    (NEW)
├── controller/
│   └── FileUploadController.java             (NEW)
├── security/
│   ├── JwtUtil.java                           (NEW)
│   └── JwtAuthenticationFilter.java           (NEW)
└── service/
    └── FileStorageService.java                (NEW)

src/test/java/com/example/municipalcorp/
├── security/
│   └── JwtUtilTest.java                       (NEW)
└── service/
    ├── OTPServiceTest.java                    (NEW)
    └── UserServiceTest.java                   (NEW)
```

---

## 🎯 Feature Comparison

| Feature | V1.0 (Before) | V2.0 (Now) |
|---------|---------------|------------|
| **Authentication** | Mock JWT tokens | Real JWT with HS512 |
| **API Documentation** | None | Swagger/OpenAPI UI |
| **File Upload** | URL strings only | Full service + endpoints |
| **Unit Tests** | 1 basic test | 20 comprehensive tests |
| **JSON Serialization** | Circular reference issues | Clean DTO responses |
| **Security Filter** | Basic | JWT filter with role extraction |

---

## 🚀 Quick Start

### 1. Start Application
```bash
export JAVA_HOME=/Users/sgupt411/.asdf/installs/java/temurin-21.0.4+7.0.LTS
java -jar target/municipal-corp-0.0.1-SNAPSHOT.jar
```

### 2. Access URLs
- **Application:** http://localhost:9999
- **Swagger UI:** http://localhost:9999/swagger-ui.html
- **OpenAPI Docs:** http://localhost:9999/v3/api-docs
- **H2 Console:** http://localhost:9999/h2-console
- **Health Check:** http://localhost:9999/api/health

### 3. Test Authentication
```bash
# Get OTP
curl -X POST http://localhost:9999/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier":"9876543210","role":"CITIZEN"}'

# Use OTP from response to register and get JWT token
```

---

## 📝 Notes

### JWT Token Security
- **Secret Key:** Change in production (currently in application.properties)
- **Expiry:** 24 hours (configurable)
- **Algorithm:** HS512 (secure)
- **Storage:** Client should store in localStorage or cookies

### File Upload
- **Location:** Files stored in `uploads/` directory
- **Max Size:** 10MB per file
- **Supported:** JPEG, PNG, GIF
- **Access:** Files accessible at `/uploads/filename`

### Swagger UI Tips
- Use "Authorize" button to set JWT token globally
- Test endpoints directly from the browser
- View request/response schemas
- Copy cURL commands for terminal use

---

## 🎊 Summary

**Version 2.0 brings production-ready features:**
- ✅ Real JWT authentication
- ✅ Interactive API documentation
- ✅ File upload service
- ✅ Comprehensive unit tests
- ✅ Fixed JSON serialization
- ✅ Enhanced security

**Ready for:**
- Frontend integration with React/Angular
- Mobile app development
- Production deployment (with config changes)
- CI/CD pipeline integration
- Automated testing

---

**Application Status:** ✅ **RUNNING** with enhanced features!

**Next:** Open http://localhost:9999/swagger-ui.html and explore the interactive API documentation!
