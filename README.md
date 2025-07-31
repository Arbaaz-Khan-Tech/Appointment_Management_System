

## 📄 `README.md`

```md
# 🏥 Clinic Front Desk Management System

A complete full-stack application to streamline appointment booking, queue tracking, doctor scheduling, and patient management in clinics. Built using industry-standard technologies and clean architecture.

---

## 🔧 Tech Stack

| Layer       | Technology                            |
|------------|----------------------------------------|
| Backend     | NestJS + TypeORM + MySQL              |
| Frontend    | Next.js (App Router) + Tailwind CSS + shadcn/ui |
| Auth        | JWT-based Authentication              |
| Styling     | Tailwind CSS + shadcn/ui              |
| Data        | MySQL (Relational Database)           |
| API Client  | Axios                                 |

---

## ✅ Core Features

- 🔐 User Registration & Login (JWT-based)
- 🧑‍⚕️ Doctor Management (CRUD)
- 🧍 Patient Management (CRUD)
- 🔢 Live Queue Management
- 📅 Appointment Booking System
- 🟢 Doctor availability detection
- 📊 Dashboard with daily stats
- 🔒 Authenticated frontend routing

---

## 📁 Project Structure

```'

📦 project-root
├── backend/              # NestJS app
│   └── src/              # Modules: auth, doctors, patients, queue, appointments
│   └── .env              # MySQL + JWT config
│
├── frontend-clinic/      # Next.js frontend
│   └── src/app/          # App Router Pages (login, dashboard, patients, doctors)
│   └── public/logo.png   # Clinic logo
│   └── .env.local        # API base URL

````

---

## 🚀 Local Development Setup

### 🖥️ Prerequisites

- Node.js (v18+)
- MySQL Server (v8+)
- Git

---

## 🛠️ Backend Setup (NestJS + MySQL)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/clinic-system.git
cd clinic-system/backend
npm install
````

### 2. Create `.env` file

```env
# .env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=clinic_db

JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d
```

### 3. Start MySQL & Create DB

In your MySQL CLI or GUI:

```sql
CREATE DATABASE clinic_db;
```

> Make sure credentials match your `.env`.

### 4. Run Backend

```bash
npm run start:dev
```

This will start the server at:

```
http://localhost:3000
```

Backend APIs available at `/auth`, `/users`, `/doctors`, `/patients`, `/queue`, `/appointments`.

---

## 🎨 Frontend Setup (Next.js + Tailwind + shadcn)

### 1. Setup Frontend

```bash
cd ../frontend-clinic
npm install
```

### 2. Create `.env.local`

```env
# .env.local
PORT=3001
```

### 3. Run Frontend

```bash
npm run dev
```

App runs at:

```
http://localhost:3001
```

---

## 🧪 Test Credentials

After registration (`/register`), log in at `/login`.

Backend stores users in MySQL. Passwords are hashed using `bcrypt`.


## 🧠 Developer Notes

* Designed with scalable modular architecture using NestJS.
* Data validations with DTOs and class-transformer.
* Fully responsive and accessible UI built with Tailwind + shadcn.
* Secure routes using JWT + AuthGuard.

---

## 📦 Deployment

This project is production-ready.

To deploy:

* Use PlanetScale or MySQL on RDS for DB
* Backend on Render/Vercel/DigitalOcean
* Frontend on Vercel (Next.js native)

---

## 🙋‍♀️ Author

**Your Name**
GitHub: [@Arbaaz Khan](https://github.com/Arbaaz-Khan-Tech)
Email: [Mail Me](mailto:arbukhan1971@gmail.com)

---






