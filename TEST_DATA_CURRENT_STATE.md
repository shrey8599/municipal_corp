# Test Data Guide - Municipal Corp Application

## Overview
The application uses a SQL initialization script (`data.sql`) to load persistent test data on every application startup. This ensures consistent test data across development environments.

## Current Test Data State

### Ward Officers (Leaders)

| ID | Phone | Name | Email | Ward | Role |
|----|----- |------|-------|------|------|
| 1 | 1111111111 | Ward Officer - Ward 5 | officer.ward5@municipal.gov | 5 | Ward Officer |
| 2 | 3333333333 | Ward Officer - Ward 10 | officer.ward10@municipal.gov | 10 | Ward Officer |

### Citizens (Users)

| ID | Phone | Name | Email | Address | Ward | Leader |
|----|-----|----|-------|---------|------|--------|
| 1 | 2222222222 | Test Citizen | citizen1@test.com | 123 Main Street | 5 | Leader 1 |
| 2 | 5555555555 | John Doe | john.doe@test.com | 456 Park Avenue | 5 | Leader 1 |
| 3 | 6666666666 | Jane Smith | jane.smith@test.com | 789 Oak Road | 10 | Leader 2 |
| 4 | 7777777777 | Bob Johnson | bob.johnson@test.com | 321 Elm Street | 10 | Leader 2 |

### Test Complaints/Tickets

| ID | Title | Type | Category | Status | Citizen | Assigned To |
|----|-------|------|---------|--------|---------|------------|
| 1 | Street Light Not Working | COMPLAINT | STREET_LIGHTS | OPEN | Test Citizen (1) | Leader 1 |
| 2 | Pothole on Main Street | COMPLAINT | ROADS | IN_PROGRESS | Test Citizen (1) | Leader 1 |
| 3 | Garbage Collection Missed | COMPLAINT | GARBAGE_COLLECTION | OPEN | John Doe (2) | Leader 1 |
| 4 | New Park Request | SUGGESTION | OTHER | OPEN | John Doe (2) | Leader 1 |
| 5 | Water Leakage | COMPLAINT | WATER_SUPPLY | RESOLVED | Jane Smith (3) | Leader 2 |
| 6 | Drainage Issue | COMPLAINT | DRAINAGE | IN_PROGRESS | Jane Smith (3) | Leader 2 |
| 7 | Tree Trimming Required | SUGGESTION | OTHER | OPEN | Bob Johnson (4) | Leader 2 |

## How to Modify Test Data

### Option 1: Update SQL Script (Recommended)
Edit `src/main/resources/data.sql` directly:

1. Open the file
2. Modify the INSERT statements with your desired test data
3. Restart the application
4. The new data will load automatically

### Option 2: Add More Test Data
Add new INSERT statements to `data.sql` following the same pattern:

```sql
INSERT INTO users (id, phone, name, email, address, ward_number, role, leader_id, active, created_at, updated_at) VALUES
(5, '8888888888', 'New Citizen', 'new@test.com', '999 New Street', '5', 'CITIZEN', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at) VALUES
(8, 'TKT-NEW129', 'New Complaint', 'Description here', 'COMPLAINT', 'ROADS', 'OPEN', 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
```

### Option 3: Manual Testing with H2 Console
1. Start the application
2. Navigate to: `http://localhost:9999/h2-console`
3. Connection URL: `jdbc:h2:mem:municipal_db`
4. Use: `sa` (no password)
5. Run SQL queries directly to modify data

> **Note**: Changes made via H2 Console will be lost on application restart since data.sql is re-executed.

## Important Notes

- **Database Reset**: Every time you start the application, the database is recreated from `data.sql`
- **ddl-auto Setting**: Currently set to `create-drop` to ensure a fresh state from the SQL script
- **Data Persistence**: To make manual changes permanent, update `data.sql`
- **Test Profiles**: For different test environments, create separate profile-specific files:
  - `data-dev.sql` (for development)
  - `data-test.sql` (for automated tests)
  - `data-prod.sql` (for production-like testing)

## Adding Profile-Specific Data

To use different test data based on Spring profiles:

1. Create `application-dev.properties`:
```properties
spring.sql.init.data-locations=classpath:data-dev.sql
```

2. Create `src/main/resources/data-dev.sql` with dev-specific data

3. Run with: `java -jar app.jar --spring.profiles.active=dev`

## Related Files

- **Data Initialization**: `src/main/resources/data.sql`
- **DataInitializer Class**: `src/main/java/com/example/municipalcorp/config/DataInitializer.java`
- **Database Config**: `src/main/resources/application.properties`
- **H2 Console**: `http://localhost:9999/h2-console`

## Troubleshooting

**Q**: Data not loading?
- Check that `spring.sql.init.mode=always` is in application.properties
- Verify `data.sql` is in `src/main/resources/`
- Check server logs for SQL errors

**Q**: ID sequences conflicting?
- Update the `ALTER SEQUENCE` statements in `data.sql` to match your highest IDs

**Q**: Want to preserve manual changes?
- Either commit them to `data.sql`, or switch `ddl-auto` to `update` instead of `create-drop` (but data will persist across restarts)
