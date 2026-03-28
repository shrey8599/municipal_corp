# Quick Test Reference

## Test Login Credentials

### Ward Officers
- **Ward 5 Officer**
  - Phone: `1111111111`
  - No password (OTP-based)

- **Ward 10 Officer**
  - Phone: `3333333333`
  - No password (OTP-based)

### Citizens
- **Test Citizen (Ward 5)**
  - Phone: `2222222222`
  - Has 2 complaints filed

- **John Doe (Ward 5)**
  - Phone: `5555555555`
  - Has 2 complaints (1 open, 1 suggestion)

- **Jane Smith (Ward 10)**
  - Phone: `6666666666`
  - Has 2 complaints (1 resolved, 1 in progress)

- **Bob Johnson (Ward 10)**
  - Phone: `7777777777`
  - Has 1 suggestion

## Test Workflow

### For Citizens:
1. Login with phone number (e.g., 2222222222)
2. Enter any OTP (system accepts all OTPs)
3. View pre-existing complaints
4. File new complaints
5. View contact ward officer page

### For Ward Officers:
1. Login with phone number (e.g., 1111111111)
2. Enter any OTP
3. View assigned complaints by ward
4. Update complaint status
5. Add news/announcements
6. View profile

## Test Data Covers

- ✅ Multiple wards (5, 10)
- ✅ Leader-citizen relationships
- ✅ Different complaint statuses (OPEN, IN_PROGRESS, RESOLVED)
- ✅ Different complaint types (COMPLAINT, SUGGESTION, FEEDBACK)
- ✅ Different categories (ROADS, STREET_LIGHTS, WATER_SUPPLY, DRAINAGE, GARBAGE, PARKS, OTHER)
- ✅ Multiple citizens per ward
- ✅ Multiple tickets per citizen

## Common Test Scenarios

### Scenario 1: New Officer Checking Assigned Complaints
- Login as: Ward 5 Officer (1111111111)
- Expected: See all 4 complaints assigned to Ward 5
- Status breakdown: 2 OPEN, 1 IN_PROGRESS

### Scenario 2: Citizen Filing New Complaint
- Login as: John Doe (5555555555)
- Action: File a new ROADS complaint
- Expected: New complaint appears in "My Complaints"

### Scenario 3: Officer Resolving Complaint
- Login as: Ward 5 Officer
- Action: Mark "Street Light Not Working" as RESOLVED
- Expected: Status updates, appears in RESOLVED section

### Scenario 4: Language Toggle
- Login as: Any user
- Action: Click language dropdown in header
- Expected: All UI text switches to Hindi/English
- Note: Database values don't change

## H2 Database Console

Access: `http://localhost:9999/h2-console`
- **URL**: `jdbc:h2:mem:municipal_db`
- **Username**: `sa`
- **Password**: (leave empty)

## Important Notes

- OTP authentication accepts **any 6-digit code**
- Test data **resets on every app restart** (from data.sql)
- To make changes permanent, edit `src/main/resources/data.sql`
- News created by officers uses current timestamp (varies)
- Mock images: Profile pictures use default avatar if not set

## Files to Know

- **Test Data**: `src/main/resources/data.sql`
- **Test Documentation**: `TEST_DATA_CURRENT_STATE.md` (this repo)
- **Database Config**: `src/main/resources/application.properties`
- **Data Initializer**: `src/main/java/com/example/municipalcorp/config/DataInitializer.java`
