# Implementation Plan: Backend for Field Reporter

### ## Approach
To build a backend for the Field Reporter project, a Node.js application using Express.js will be employed. This approach aligns with the existing JavaScript ecosystem of the frontend, facilitating easier development and potential code sharing. The backend will implement a RESTful API to expose data, allowing for user authentication and retrieval of data currently stored in the client-side IndexedDB. For the database, PostgreSQL is chosen for its robustness, scalability, and strong support for structured data, making it suitable for managing user and field reporting data. Data synchronization will initially involve the client pushing its local IndexedDB data to the backend.

**Alternatives considered:**
-   **Python with FastAPI/Django**: While powerful, this would introduce a new language stack to the project.
-   **Go with Gin/Echo**: Offers high performance but also introduces a new language.
-   **Serverless Functions (AWS Lambda/Google Cloud Functions)**: Could be viable for individual endpoints but might complicate database management and real-time synchronization in a tightly coupled local data scenario.

### ## Steps

1.  **Install Dependencies & Project Setup** (30 min)
    *   Initialize a new Node.js project for the backend.
    *   Install core dependencies: `express`, `pg` (for PostgreSQL client), `dotenv`, `bcryptjs` (for password hashing), `jsonwebtoken` (for JWT).
    *   Set up a basic project structure (e.g., `src/`, `config/`, `models/`, `routes/`).
    *   Create a `.env` file for environment variables (DB credentials, JWT secret).

    ```bash
    mkdir backend
    cd backend
    npm init -y
    npm install express pg dotenv bcryptjs jsonwebtoken
    ```

2.  **Database Setup & Migration** (60 min)
    *   Set up a PostgreSQL database.
    *   Create a migration script or initial SQL schema to replicate the IndexedDB object stores (users, stores, checkins, various activity tables) as tables in PostgreSQL.
        *   **Key tables**: `users`, `stores`, `login_logs`, `checkin_sessions`, `availability_records`, `placement_records`, `activation_records`, `visibility_records`, `tl_focus_records`, `tl_objectives_records`, `objectives_records`, `other_objectives_records`, `listings_records`, `brands`, `brand_stocks_records`, `performance_records`, `daily_planner_records`, `checklist_records`.
    *   Implement a database connection utility using `pg`.

3.  **Authentication Module** (90 min)
    *   Create user model/schema to interact with the `users` table.
    *   Implement user registration (optional, or manual for initial setup).
    *   Implement user login endpoint (`POST /api/auth/login`) using `bcryptjs` for password verification.
    *   Generate and return JSON Web Tokens (JWT) upon successful login.
    *   Implement a JWT middleware to protect API routes.

4.  **Data API Endpoints** (180 min)
    *   Create RESTful API endpoints for each major data entity (e.g., `/api/stores`, `/api/users`, `/api/activities/:storeId`).
    *   **GET /api/users**: Get all users (admin only).
    *   **GET /api/stores**: Get all stores (or user-specific).
    *   **GET /api/stores/:id**: Get a single store.
    *   **POST /api/stores**: Create a new store.
    *   **PUT /api/stores/:id**: Update an existing store.
    *   **DELETE /api/stores/:id**: Delete a store.
    *   **POST /api/data/sync**: A generic endpoint to receive bulk data from the client (e.g., entire IndexedDB contents or recent changes). This will require robust parsing and upsert logic on the backend to handle existing records and new ones.
    *   Implement corresponding database queries using `pg` for each endpoint.
    *   Ensure all data modification endpoints are protected by the JWT middleware.

5.  **Basic Admin Frontend** (120 min)
    *   Create a simple web interface (e.g., using EJS, Pug, or plain HTML/JS) to:
        *   Login to the backend.
        *   Display a list of users and their roles.
        *   Display a list of all stores and their details.
        *   Provide basic filtering/search for data.
        *   Show an aggregated view of data from activity tables.

6.  **Integration with Existing Frontend (Future Sync)** (TBD)
    *   Update the existing Cordova app to:
        *   Send authentication requests to the new backend.
        *   Implement "Data Sync" logic to push IndexedDB data to the `/api/data/sync` endpoint.
        *   Implement logic to pull data from the backend to populate IndexedDB (for initial load or multi-device sync).

### ## Timeline
| Phase | Duration |
|-------|----------|
| Dependencies & Setup | 30 min |
| Database Setup & Migration | 60 min |
| Authentication Module | 90 min |
| Data API Endpoints | 180 min |
| Basic Admin Frontend | 120 min |
| **Total** | **8 hours** |

### ## Rollback Plan
-   **Version Control**: Ensure all backend changes are committed to a dedicated Git branch. If issues arise, revert to the previous stable commit.
-   **Database Backup**: Before running any migrations, take a backup of the PostgreSQL database.
-   **Containerization**: If using Docker, old stable images can be quickly redeployed.

### ## Security Checklist
-   [x] **Input validation**: Implement server-side input validation for all API endpoints.
-   [x] **Auth checks**: Protect all sensitive API routes with JWT authentication middleware.
-   [ ] **Rate limiting**: Implement rate limiting for authentication and critical write endpoints to prevent brute-force attacks.
-   [x] **Error handling**: Implement comprehensive error handling for API endpoints, returning appropriate HTTP status codes and error messages.
-   [x] **Password Hashing**: Use `bcryptjs` for strong password hashing (already in plan).
-   [ ] **CORS**: Configure CORS policies to allow requests only from trusted origins (frontend application).
-   [ ] **Environment Variables**: Store sensitive information (DB credentials, JWT secret) securely using environment variables.
