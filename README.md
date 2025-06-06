# Campus Events Hub

A full-stack web application for managing and participating in campus events. This platform allows students and staff to create, discover, and participate in various campus activities, from academic workshops to social gatherings.

## Features

- **User Authentication**
  - Secure registration and login system
  - Password hashing using bcrypt
  - JWT-based authentication

- **Event Management**
  - Create and publish events
  - Browse events by category
  - View event details including date, time, and location
  - Participate in events
  - View your event participations

- **Categories**
  - Academic events
  - Workshops
  - Sports activities
  - Social gatherings
  - And more...

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite database
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Responsive design

## Project Structure

```
campus-events-hub/
├── backend/
│   └── src/
│       └── server.js
├── frontend/
│   ├── assets/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── add-event.html
│   ├── my-participations.html
│   ├── app.js
│   ├── auth.js
│   ├── auth-utils.js
│   ├── add-event.js
│   ├── styles.css
│   ├── auth.css
│   ├── events-section.css
│   └── add-event.css
├── database.sql
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YoussefLe/Web_Project.git
   cd Web_Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   The database will be automatically initialized when you first run the server. Sample data is included in `database.sql`.

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:3000

2. Start the frontend server:
   ```bash
   cd frontend
   http-server -p 8080
   ```
   The frontend will be available at http://localhost:8080

## API Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Login user

- **Events**
  - GET `/api/events` - Get all events
  - POST `/api/events` - Create a new event
  - GET `/api/events/:id` - Get event details
  - POST `/api/events/:id/participate` - Participate in an event
  - GET `/api/events/my-participations` - Get user's event participations

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS protection
- Secure session management

## Contributers

- [Youssef Lamine](https://github.com/YoussefLe)
- [Ilyas Salioui](https://github.com/saliouiilyas)


