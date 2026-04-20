<div align="center">
  <h1>🌟 Lokasamyoga</h1>
  <p><strong>A Modern Power-Packed NGO Management Platform</strong></p>
  <p>Built to streamline operations, manage campaigns, track donations, and coordinate volunteer efforts.</p>
</div>

---

## 📖 Overview

**Lokasamyoga** is a fully-featured, full-stack web application designed to empower Non-Governmental Organizations (NGOs). It provides a unified platform to manage day-to-day activities, organize fundraising campaigns, securely process donations, and handle volunteer applications with ease.

## ✨ Features

- 🔐 **Secure Authentication**: Robust user registration and login flows using JWT.
- 🛡️ **Role-Based Access Control**: Securely protected routes tailored for different user roles (Volunteers, Donors, Admins).
- 📢 **Campaign Management**: Create, view, and manage various NGO campaigns effortlessly.
- 💰 **Donation Tracking**: Transparently track and manage monetary contributions.
- 📱 **Responsive Design**: A beautiful, modern interface crafted to work seamlessly across all devices.

## 🚀 Tech Stack

### Frontend
- **React 19** - For building a fast and dynamic user interface.
- **TypeScript** - For type-safe code and better developer experience.
- **Vite** - Next-generation frontend tooling for blazing-fast builds.
- **React Router v7** - For robust routing and navigation.
- **Lucide React** - For sleek, customizable SVG icons.

### Backend
- **Node.js & Express.js** - Powerful and scalable server-side framework.
- **MongoDB & Mongoose** - Flexible NoSQL database and elegant object modeling.
- **JSON Web Tokens (JWT)** - For secure, stateless user authentication.
- **Bcrypt.js** - For industry-standard password hashing.

## 📁 Project Structure

This repository is structured as a monorepo, keeping the codebase organized and maintainable:

```text
lokasamyoga/
├── backend/          # Express/Node.js REST API
│   ├── models/       # Mongoose Schemas (User, Campaign, etc.)
│   ├── routes/       # API Routes (Auth, Admin, etc.)
│   ├── server.js     # Entry point
│   └── package.json
└── frontend/         # React Application (Vite + TS)
    ├── src/          # Source Code (Components, Contexts, Pages)
    ├── public/       # Static Assets
    └── package.json
```

## 🛠️ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or a MongoDB Atlas URI)

### 1. Backend Setup

Open a terminal and set up the backend server:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
touch .env
```

Add the following environment variables to the `.backend/.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
# For development
node server.js
```

### 2. Frontend Setup

Open a new terminal window/tab and set up the frontend client:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will typically be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions are always welcome! Feel free to fork the repository, make changes, and submit pull requests to help improve Lokasamyoga.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ for a better world.</p>
</div>
