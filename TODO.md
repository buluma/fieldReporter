# TODO for Backend Development

## Phase: Dependencies & Project Setup
- [ ] Initialize a new Node.js project for the backend.
- [ ] Install core dependencies: `express`, `pg` (for PostgreSQL client), `dotenv`, `bcryptjs` (for password hashing), `jsonwebtoken` (for JWT).
- [ ] Set up a basic project structure (e.g., `src/`, `config/`, `models/`, `routes/`).
- [ ] Create a `.env` file for environment variables (DB credentials, JWT secret).

## Phase: Database Setup & Migration
- [ ] Set up a PostgreSQL database.
- [ ] Create a migration script or initial SQL schema to replicate the IndexedDB object stores as tables in PostgreSQL.
- [ ] Implement a database connection utility using `pg`.

## Phase: Authentication Module
- [ ] Create user model/schema to interact with the `users` table.
- [ ] Implement user registration (optional, or manual for initial setup).
- [ ] Implement user login endpoint (`POST /api/auth/login`) using `bcryptjs` for password verification.
- [ ] Generate and return JSON Web Tokens (JWT) upon successful login.
- [ ] Implement a JWT middleware to protect API routes.

## Phase: Data API Endpoints
- [ ] Create RESTful API endpoints for each major data entity.
- [ ] Implement corresponding database queries using `pg` for each endpoint.
- [ ] Ensure all data modification endpoints are protected by the JWT middleware.

## Phase: Basic Admin Frontend
- [ ] Create a simple web interface to login to the backend.
- [ ] Display a list of users and their roles.
- [ ] Display a list of all stores and their details.
- [ ] Provide basic filtering/search for data.
- [ ] Show an aggregated view of data from activity tables.

## Phase: Integration with Existing Frontend (Future Sync)
- [ ] Update the existing Cordova app to send authentication requests to the new backend.
- [ ] Implement "Data Sync" logic to push IndexedDB data to the `/api/data/sync` endpoint.
- [ ] Implement logic to pull data from the backend to populate IndexedDB (for initial load or multi-device sync).
