# 🏪 RateMyStore — Store Rating Platform

A full-stack web application where users can submit ratings (1–5) for stores registered on the platform. Built with **React**, **Express.js**, **MySQL**, and **Sequelize**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Seed Data](#seed-data)
  - [Running the Application](#running-the-application)
- [Demo Credentials](#-demo-credentials)
- [User Roles & Functionalities](#-user-roles--functionalities)
- [API Endpoints](#-api-endpoints)
- [Form Validations](#-form-validations)
- [Database Schema](#-database-schema)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/signup with role-based access control
- 👥 **Three User Roles** — System Administrator, Normal User, Store Owner
- ⭐ **Star Ratings** — Users can submit and modify ratings (1–5) for any store
- 📊 **Admin Dashboard** — Overview stats, user management, store management
- 🔍 **Search & Filter** — Filter listings by Name, Email, Address, and Role
- 🔃 **Sortable Tables** — All tables support ascending/descending sorting
- 🔑 **Password Management** — All users can update their password after login
- 🎨 **Modern Dark UI** — Glassmorphism design with smooth animations

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 19, React Router v7, Axios, Lucide Icons   |
| Backend    | Express.js 5, Node.js                            |
| Database   | MySQL                                            |
| ORM        | Sequelize 6                                      |
| Auth       | JSON Web Tokens (JWT), bcrypt                    |
| Build Tool | Vite 8                                           |

---

## 📁 Project Structure

```
Roxiler Assignment/
├── backend/
│   ├── config/
│   │   └── db.js              # Sequelize database connection
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT auth & role-based authorization
│   ├── models/
│   │   ├── User.js             # User model (UUID, name, email, password, address, role)
│   │   ├── Store.js            # Store model (UUID, name, email, address, ownerId)
│   │   ├── Rating.js           # Rating model (UUID, rating 1-5, userId, storeId)
│   │   └── index.js            # Model relationships & sync
│   ├── routes/
│   │   ├── auth.js             # Login, Register, Password update, Profile
│   │   ├── users.js            # Admin: dashboard stats, list/create users
│   │   ├── stores.js           # List stores, create store, store owner dashboard
│   │   └── ratings.js          # Submit & modify ratings
│   ├── .env                    # Environment variables
│   ├── index.js                # Express server entry point
│   ├── seed.js                 # Database seeder with sample data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx      # Admin: stats, user/store management
│   │   │   ├── UserDashboard.jsx       # Normal user: store listing & ratings
│   │   │   ├── StoreOwnerDashboard.jsx # Store owner: ratings received
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── Register.jsx            # Registration page (Normal users)
│   │   │   └── Navbar.jsx              # Navigation bar with password change
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Auth state management
│   │   ├── App.jsx                     # Routing & role-based redirects
│   │   ├── App.css                     # Component-specific styles
│   │   ├── index.css                   # Global design system
│   │   └── main.jsx                    # React entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MySQL** v8.0 or higher — [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

### Installation

**1. Clone the repository:**

```bash
git clone <repository-url>
cd "Roxiler Assignment"
```

**2. Install backend dependencies:**

```bash
cd backend
npm install
```

**3. Install frontend dependencies:**

```bash
cd ../frontend
npm install
```

### Database Setup

**1. Make sure MySQL is running** on your system.

**2. Create the database:**

You can create it manually via MySQL CLI:

```sql
CREATE DATABASE roxiler_rating_app;
```

Or the application will create it automatically when you run the seed script.

**3. Configure environment variables:**

Edit `backend/.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=roxiler_rating_app
JWT_SECRET=supersecretkey123
```

> ⚠️ Replace `your_mysql_password` with your actual MySQL root password.

### Seed Data

Run the seed script to populate the database with sample users, stores, and ratings:

```bash
cd backend
node seed.js
```

This creates:

| Role         | Email               | Password    |
|--------------|---------------------|-------------|
| Admin        | admin@system.com    | Admin@123   |
| Store Owner  | rahul@stores.com    | Rahul@123   |
| Store Owner  | priya@stores.com    | Priya@123   |
| Normal User  | amit@user.com       | Amit@1234   |
| Normal User  | sneha@user.com      | Sneha@123   |
| Normal User  | vikram@user.com     | Vikram@12   |

Plus **4 stores** and **8 sample ratings** so you can see the app in action immediately.

### Running the Application

**Start the backend** (Terminal 1):

```bash
cd backend
npm run dev
```

> Backend runs on: http://localhost:5000

**Start the frontend** (Terminal 2):

```bash
cd frontend
npm run dev
```

> Frontend runs on: http://localhost:5173

Open **http://localhost:5173** in your browser and log in with any of the demo credentials above.

---

## 🔑 Demo Credentials

Use these accounts to test different roles after running `node seed.js`:

### System Administrator
```
Email:    admin@system.com
Password: Admin@123
```

### Store Owners
```
Email:    rahul@stores.com     |  priya@stores.com
Password: Rahul@123            |  Priya@123
```

### Normal Users
```
Email:    amit@user.com   |  sneha@user.com   |  vikram@user.com
Password: Amit@1234       |  Sneha@123        |  Vikram@12
```

---

## 👤 User Roles & Functionalities

### 1. System Administrator

| Functionality | Description |
|---|---|
| Dashboard | View total users, total stores, total ratings |
| Add Users | Create Normal Users, Store Owners, or Admins |
| User Listing | View all users with Name, Email, Address, Role |
| Store Listing | View all stores with Name, Email, Address, Rating |
| Filters | Filter by Name, Email, Address, and Role |
| Sorting | Sort any column ascending/descending |
| Store Owner Rating | See average rating for Store Owner users |
| Password Update | Change own password |
| Logout | Secure logout |

### 2. Normal User

| Functionality | Description |
|---|---|
| Sign Up | Register with Name, Email, Address, Password |
| Login | Secure JWT-based login |
| Store Listing | Browse all registered stores |
| Search | Search stores by Name and Address |
| Rating | Submit ratings (1–5 stars) for any store |
| Modify Rating | Update previously submitted rating |
| View Rating | See overall store rating + own submitted rating |
| Password Update | Change own password |
| Logout | Secure logout |

### 3. Store Owner

| Functionality | Description |
|---|---|
| Login | Secure JWT-based login |
| Dashboard | View stores assigned to them |
| Average Rating | See average rating of each store |
| User Ratings | View list of users who submitted ratings |
| Sortable Table | Sort ratings by user name, email, rating, date |
| Password Update | Change own password |
| Logout | Secure logout |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description              | Access  |
|--------|----------------------|--------------------------|---------|
| POST   | `/api/auth/register` | Register a new user      | Public  |
| POST   | `/api/auth/login`    | Login & get JWT token    | Public  |
| PUT    | `/api/auth/password` | Update password          | Auth    |
| GET    | `/api/auth/profile`  | Get current user profile | Auth    |

### Users (Admin Only)

| Method | Endpoint              | Description                        | Access |
|--------|-----------------------|------------------------------------|--------|
| GET    | `/api/users/dashboard`| Get stats (users, stores, ratings) | Admin  |
| GET    | `/api/users`          | List all users (filterable/sortable) | Admin |
| POST   | `/api/users`          | Create new user                    | Admin  |

### Stores

| Method | Endpoint              | Description                          | Access       |
|--------|-----------------------|--------------------------------------|--------------|
| GET    | `/api/stores`         | List all stores (filterable/sortable)| Auth         |
| POST   | `/api/stores`         | Create a new store                   | Admin        |
| GET    | `/api/stores/my-stores`| Get store owner's stores + ratings  | Store Owner  |

### Ratings

| Method | Endpoint            | Description            | Access      |
|--------|---------------------|------------------------|-------------|
| POST   | `/api/ratings`      | Submit a new rating    | Normal User |
| PUT    | `/api/ratings/:id`  | Modify existing rating | Normal User |

---

## ✅ Form Validations

| Field    | Rules                                                              |
|----------|--------------------------------------------------------------------|
| Name     | Minimum 10 characters, Maximum 60 characters                      |
| Email    | Must follow standard email format                                  |
| Password | 8–16 characters, at least 1 uppercase letter, 1 special character  |
| Address  | Maximum 400 characters                                             |
| Rating   | Integer between 1 and 5                                            |

> Validations are enforced on both the **frontend** (client-side) and **backend** (server-side + database model level).

---

## 🗄 Database Schema

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users     │       │   Stores    │       │   Ratings   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (UUID PK)│───┐   │ id (UUID PK)│───┐   │ id (UUID PK)│
│ name        │   │   │ name        │   │   │ rating (1-5)│
│ email       │   │   │ email       │   │   │ userId (FK) │──→ Users.id
│ password    │   └──→│ ownerId(FK) │   └──→│ storeId(FK) │──→ Stores.id
│ address     │       │ address     │       │ createdAt   │
│ role (ENUM) │       │ createdAt   │       │ updatedAt   │
│ createdAt   │       │ updatedAt   │       └─────────────┘
│ updatedAt   │       └─────────────┘
└─────────────┘

Roles: ADMIN | NORMAL | STORE_OWNER
```

### Relationships

- **User → Store**: One-to-Many (A Store Owner can own multiple stores)
- **User → Rating**: One-to-Many (A user can rate multiple stores)
- **Store → Rating**: One-to-Many (A store can have multiple ratings)
- Each user can submit only **one rating per store** (enforced at API level)

---

## 📝 Additional Notes

- All tables support **ascending/descending sorting** by clicking column headers
- **Best practices** followed for both frontend and backend development
- Password is **hashed using bcrypt** before storing in the database
- **JWT tokens** expire after 30 days
- Frontend uses **glassmorphism dark theme** with responsive design
- The application uses **UUID** as primary keys for all models

---

## 📄 License

This project was built as part of the **Roxiler FullStack Intern Coding Challenge**.
