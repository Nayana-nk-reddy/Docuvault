# 📄 DocuVault

<p align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge"/>
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white"/>

</p>

<h3 align="center">
🔐 Secure Document Management & Sharing Platform
</h3>

---

# 📖 Overview

**DocuVault** is a secure full-stack document management system that enables users to upload, store, organize, and securely share digital documents.

The application uses **JWT Authentication**, **Role-Based Access Control (RBAC)**, and **MongoDB** to provide secure document access while allowing administrators to manage users and monitor system activity.

---

# ✨ Features

- 🔐 Secure User Authentication
- 🔑 JWT Token-Based Login
- 🔒 Password Encryption using bcrypt
- 👤 User Registration & Login
- 📂 Secure Document Upload
- 📥 Download Documents
- 🤝 Document Sharing
- 👨‍💼 Admin Dashboard
- 👥 Role-Based Access Control
- 📊 Activity Logs
- 🔍 User Management
- 📱 Responsive User Interface

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- HTML5
- CSS3
- Tailwind CSS
- JavaScript

## Backend

- Python
- Flask
- Flask-CORS
- JWT Authentication
- bcrypt

## Database

- MongoDB

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 📂 Project Structure

```text
DocuVault
│
├── client
│   ├── src
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── app
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   └── db.py
│   │
│   ├── requirements.txt
│   ├── config.py
│   └── run.py
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/Nayana-nk-reddy/Docvault.git
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Backend Setup

```bash
cd server

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python run.py
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **server** directory.

```env
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/docvault
FLASK_ENV=development
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Role-Based Access Control
- Protected API Endpoints
- Secure File Management
- Activity Logging

---

# 📊 Project Workflow

```text
           User
             │
             ▼
     React Frontend
             │
        REST API Calls
             │
             ▼
      Flask Backend
             │
 JWT Authentication
             │
             ▼
     MongoDB Database
```

---

# 🚀 Future Enhancements

- Email Verification
- Password Reset
- Cloud Storage Integration
- Two-Factor Authentication (2FA)
- File Versioning
- Search & Filter
- Email Notifications
- Dark Mode

---

# 🎯 Project Highlights

- ✅ Full Stack Web Application
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Secure Document Upload & Sharing
- ✅ Activity Logging
- ✅ RESTful API Development
- ✅ Responsive User Interface

---

# 👩‍💻 Author

## Nayana N K

🎓 Computer Science Graduate

💼 Aspiring Software Engineer

💻 Full Stack Developer


<p align="center">
Made with ❤️ by <b>Nayana N K</b>
</p>
