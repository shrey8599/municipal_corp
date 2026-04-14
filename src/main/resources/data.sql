-- Municipal Corp - Test Data Initialization Script for H2
-- This script contains the current test data state

-- Leaders
INSERT INTO leaders (id, phone, name, email, jurisdiction, designation, state, city, active, created_at, updated_at) VALUES
(1, '1111111111', 'Ward Officer - Ward 5', 'officer.ward5@municipal.gov', '5', 'Ward Officer', 'Rajasthan', 'Kota', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO leaders (id, phone, name, email, jurisdiction, designation, state, city, active, created_at, updated_at) VALUES
(2, '3333333333', 'Ward Officer - Ward 10', 'officer.ward10@municipal.gov', '10', 'Ward Officer', 'Rajasthan', 'Jaipur', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Users (Citizens)
INSERT INTO users (id, phone, name, email, address, ward_number, role, leader_id, state, city, active, created_at, updated_at) VALUES
(1, '2222222222', 'Test Citizen', 'citizen1@test.com', '123 Main Street', '5', 'CITIZEN', 1, 'Rajasthan', 'Kota', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, phone, name, email, address, ward_number, role, leader_id, state, city, active, created_at, updated_at) VALUES
(2, '5555555555', 'John Doe', 'john.doe@test.com', '456 Park Avenue', '5', 'CITIZEN', 1, 'Rajasthan', 'Kota', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, phone, name, email, address, ward_number, role, leader_id, state, city, active, created_at, updated_at) VALUES
(3, '6666666666', 'Jane Smith', 'jane.smith@test.com', '789 Oak Road', '10', 'CITIZEN', 2, 'Rajasthan', 'Jaipur', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users (id, phone, name, email, address, ward_number, role, leader_id, state, city, active, created_at, updated_at) VALUES
(4, '7777777777', 'Bob Johnson', 'bob.johnson@test.com', '321 Elm Street', '10', 'CITIZEN', 2, 'Rajasthan', 'Jaipur', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Tickets (Complaints)
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(1, 'TKT-A1B2C3D4', 'Street Light Not Working', 'The street light near my house has been out for 3 days', 'COMPLAINT', 'STREET_LIGHTS', 'OPEN', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(2, 'TKT-E5F6G7H8', 'Pothole on Main Street', 'Large pothole causing traffic issues', 'COMPLAINT', 'ROADS', 'IN_PROGRESS', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(3, 'TKT-I9J0K1L2', 'Garbage Collection Missed', 'Garbage has not been collected for 2 days in my area', 'COMPLAINT', 'GARBAGE_COLLECTION', 'OPEN', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(4, 'TKT-M3N4O5P6', 'New Park Request', 'Request for a new park in Ward 5', 'SUGGESTION', 'OTHER', 'OPEN', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(5, 'TKT-Q7R8S9T0', 'Water Leakage', 'Water pipe leaking near Bus Stop 10', 'COMPLAINT', 'WATER_SUPPLY', 'RESOLVED', 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Resolved during test data initialization');
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(6, 'TKT-U1V2W3X4', 'Drainage Issue', 'Water logging during rain', 'COMPLAINT', 'DRAINAGE', 'IN_PROGRESS', 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
INSERT INTO tickets (id, ticket_id, title, description, type, category, status, citizen_id, leader_id, created_at, updated_at, closed_at, resolution_note) VALUES
(7, 'TKT-Y5Z6A7B8', 'Tree Trimming Required', 'Overgrown trees blocking street view', 'SUGGESTION', 'OTHER', 'OPEN', 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL);
