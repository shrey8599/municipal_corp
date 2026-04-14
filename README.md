# Municipal Corporation Complaints App

A Spring Boot application for managing municipal complaints and feedback from citizens, with role-based access for citizens, ward officers, leaders, and a super admin.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.2.3, Java 21 |
| Database | MySQL 8 |
| Frontend | Vanilla JS, HTML/CSS (static files served by Spring) |
| Auth | OTP-based (phone/email) + JWT |
| Port | 9999 |
| i18n | English / Hindi (lang.js) |

---

## Running Locally

**Prerequisites**: Java 21, MySQL 8 running on `localhost:3306`

```bash
# Create database (first time only)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS municipal_corp;"

# Run
./mvnw spring-boot:run
```

App starts at `http://localhost:9999`

Default DB credentials (override via env vars):
```
MYSQL_USER=shrey8599
MYSQL_PASSWORD=BEAMER@123beamer
```

### Run with Docker (local)

```bash
cd dash_config
docker compose up --build
```

This spins up both MySQL and the app. MySQL is exposed on host port `3307` to avoid conflicts.

---

## Deploying to Railway

1. Push to GitHub — Railway auto-deploys on every push.
2. In your Railway project, add a **MySQL** database plugin.
3. On the app service → **Variables** tab, add:

| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
| `SPRING_DATASOURCE_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `SPRING_DATASOURCE_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

Railway builds using `dash_config/Dockerfile` (configured in `railway.toml`).

---

## Pages & URLs

| Page | URL | Who Uses It |
|---|---|---|
| Homepage | `/` or `/index.html` | Everyone |
| Citizen Login | `/login.html` | Citizens |
| Citizen Dashboard | `/dashboard.html` | Citizens |
| File Complaint | `/create-ticket.html` | Citizens |
| Complaint Details | `/ticket-details.html?id=X` | Citizens |
| My Tickets | `/my-tickets.html` | Citizens |
| Profile | `/profile.html` | Citizens |
| Contact Leader | `/contact-leader.html` | Citizens |
| Super Admin Login | `/super-admin-dashboard.html` | Super Admin |
| Super Admin Dashboard | `/super-admin-dashboard-enhanced.html` | Super Admin |

---

## User Roles & Login

### Citizen
1. Go to `/login.html`
2. Enter 10-digit phone number → Send OTP → enter OTP
3. First time: fill registration form (name, email, ward, leader)
4. Returns JWT token stored in `localStorage`

### Ward Officer / Leader
Same OTP flow, but select role **Ward Officer** on the login page.

### Super Admin
1. Go to `/super-admin-dashboard.html`
2. Phone: **9999999999** → Send OTP → verify
3. Auto-redirects to `/super-admin-dashboard-enhanced.html`

**Test credentials seeded by `DataInitializer`**:

| Role | Phone | Notes |
|---|---|---|
| Super Admin | 9999999999 | State: Rajasthan, City: Kota |
| Ward Officer | 8888888888 | Ward 1, Kota |
| Citizen | 7777777777 | Linked to above officer |

---

## API Reference

Base URL: `http://localhost:9999`

### Auth

```
POST /api/auth/send-otp
Body: { "identifier": "9876543210", "role": "CITIZEN" }

POST /api/auth/verify-otp
Body: { "identifier": "9876543210", "otp": "123456" }

POST /api/auth/register?identifier=9876543210
Body: { "name": "...", "phone": "...", "email": "...", "address": "...", "wardNumber": "...", "leaderId": 1 }
```

All subsequent requests require:
```
Authorization: Bearer <jwt-token>
```

### Tickets

```
GET    /api/tickets              — list (citizen sees own; officer sees assigned)
POST   /api/tickets              — create (citizen)
GET    /api/tickets/{id}         — detail
PUT    /api/tickets/{id}/status  — update status (officer)
POST   /api/tickets/{id}/comments — add comment
POST   /api/tickets/{id}/close   — close with resolution note (officer)
```

### Ward Officers (Super Admin only)

```
GET    /api/admin/officers
POST   /api/admin/officers
PUT    /api/admin/officers/{id}
DELETE /api/admin/officers/{id}
```

### Leaders & Regions

```
GET  /api/leaders
GET  /api/leaders/{id}
POST /api/regions                — create/update region political figures
GET  /api/regions?city=Kota      — get region by city
```

---

## Super Admin Dashboard Features

- **Ward Officers**: Create (with OTP verification), edit, delete
- **Analytics**: Ticket status breakdown, officer workload, resolution time
- **Settings**: Corporation name, city, contact info, political figure images (CM/PM/MLA)
- **Language**: English / Hindi toggle (via sidebar)

### Political Figure Image Scope Rules

| Figure | Scope |
|---|---|
| CM (Chief Minister) | State-wide — same image shown across all cities in the state |
| PM (Prime Minister) | Nationwide — same image for all regions |
| MLA | City-only — each city has its own MLA image |

---

## Project Structure

```
src/main/
  java/com/example/municipalcorp/
    controller/     — REST controllers
    model/          — JPA entities
    repository/     — Spring Data repos
    service/        — business logic
    config/         — Security, data init
  resources/
    application.properties
    data.sql
    static/         — HTML pages + JS/CSS
      js/
        auth.js           — OTP login flow
        common.js         — shared utilities
        lang.js           — i18n (EN/HI)
        super-admin-enhanced.js  — super admin dashboard logic
        dashboard.js      — citizen dashboard
        profile.js        — profile management
        create-ticket.js  — complaint creation
        ticket-details.js — ticket detail + comments
dash_config/
  Dockerfile        — multi-stage build (JDK 21 → JRE 21)
  docker-compose.yml — app + MySQL services
railway.toml        — Railway deployment config
```

---

## Entities

| Entity | Key Fields |
|---|---|
| User | id, name, phone, email, role, wardNumber, address |
| Leader | id, name, phone, role, jurisdictionArea, state, city, geoFence |
| Ticket | id, title, description, category, status, citizenId, leaderId |
| TicketComment | id, ticketId, authorId, content, timestamp |
| OTPVerification | id, identifier, otp, expiresAt, used |
| Region | id, city, state, cmName, cmPhoto, pmName, pmPhoto, mlaName, mlaPhoto |

---

## Ticket Lifecycle

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

Categories: `DRAINAGE`, `ROADS`, `PARKS`, `STREET_LIGHTS`, `WATER_SUPPLY`, `GARBAGE`, `OTHER`
