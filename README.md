# 🔐 Personal Data Vault

A **full-stack web application** to securely store **personal credentials, documents, and sensitive files**.  
Built with a focus on **data security, privacy, and ease of access**, making it an ideal **safe cloud-based vault**.

---

## 🚀 Features

- **User Authentication & Authorization**
  - Secure **JWT-based authentication** with cookies
  - Role-based route protection (frontend + backend)

- **Secure Password Storage**
  - User passwords hashed using **bcrypt** before storing in PostgreSQL

- **Document & File Management**
  - Upload, view, and manage files securely
  - Files stored in **AWS S3 bucket**, with metadata in PostgreSQL

- **Protected Dashboard**
  - Accessible only after login
  - Displays user profile, uploaded documents, and account details

- **Modern UI**
  - Built with **React + Tailwind CSS**
  - Smooth authentication flows (signup, login, logout, file upload, profile view)

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Context API, Tailwind CSS  
**Backend:** Node.js, Express.js, TypeScript (class-based services/controllers)  
**Database:** PostgreSQL  
**Storage:** AWS S3 Bucket  
**Authentication:** JWT + Cookies, bcrypt password hashing  

---

## 📂 Project Structure


personal-data-vault/
│── backend/ # Node.js + Express backend
│ ├── controllers/ # Request handlers
│ ├── services/ # Business logic
│ ├── routes/ # API routes
│ ├── models/ # Database models
│ ├── database/ # Database connection
│ └── server.js # App entry point
│
│── frontend/ # React + Tailwind frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Global state management
│ │ ├── pages/ # Application pages
│ │ └── App.jsx # Root component
│ └── package.json
│
└── README.md


---

## ⚙️ Setup & Installation

### 1️⃣ Backend Setup

```bash
cd backend
npm install

create a .env inside backend/:
PORT=8080
DATABASE_URL=postgresql://username:password@localhost:5432/vaultdb
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name


Run the backend server:
npm run dev


Frontend Setup
cd ../frontend
npm install

Run the frontend server:
npm run dev