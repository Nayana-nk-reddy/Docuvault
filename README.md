# DocuVault – Secure Cloud-Based Document Sharing Platform

DocuVault is a professional-grade, full-stack web application designed for secure document management and sharing. It features role-based access control, industry-standard security, and a modern, responsive user interface.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct dashboards for Users and Admins.
- **Document Management**: Upload, download, delete, and rename files.
- **Secure Sharing**: Share documents with specific users.
- **Activity Tracking**: Detailed logs for all major actions (uploads, downloads, logins, etc.).
- **Modern UI**: Built with React and Tailwind CSS, featuring a responsive sidebar, dashboard cards, and toast notifications.
- **Admin Panel**: Manage all users, view system-wide stats, and monitor activity logs.

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Redux Toolkit, Tailwind CSS, Axios, Lucide React.
- **Backend**: Python Flask, JWT-Extended, Bcrypt, PyMongo.
- **Database**: MongoDB.
- **Storage**: Local filesystem (Modular design for easy S3/Cloudinary integration).

## 📋 Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (Running locally or a cloud instance)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Docvault
```

### 2. Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `server` directory (see `.env.example`).
Initialize the admin user:
```bash
python init_db.py
```
Run the server:
```bash
python run.py
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

## 🔐 Security Features

- **JWT Authentication**: Secure stateless authentication.
- **Bcrypt Hashing**: One-way password hashing for user privacy.
- **Middleware**: Protected routes and role verification on both frontend and backend.
- **File Validation**: Secure filename handling and type validation.

## 📁 Project Structure

```
Docvault/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views
│   │   ├── store/       # Redux state management
│   │   └── utils/       # API and helper functions
├── server/              # Flask backend
│   ├── app/
│   │   ├── models/      # MongoDB data logic
│   │   ├── routes/      # API endpoints
│   │   ├── utils/       # Helpers & Logger
│   │   └── middleware/  # Auth & Role checks
│   ├── uploads/         # Local file storage
│   └── run.py           # Entry point
└── README.md
```

## 📝 License

This project is licensed under the MIT License.
