# Lokasamyoga (NGO Management Platform)

A full-stack web application built to manage NGO activities, campaigns, donations, and volunteer applications.

## 🚀 Tech Stack

### Frontend
- **React 19**
- **TypeScript**
- **Vite**
- **React Router v7**
- **Lucide React** (icons)

### Backend
- **Node.js** & **Express.js** 
- **MongoDB** (via **Mongoose**)
- **JWT** (JSON Web Tokens for authentication)
- **Bcrypt.js** (Password hashing)

## 📁 Project Structure

This repository is organized as a monorepo containing two main directories:

- `/frontend` - The React application
- `/backend` - The Express/Node.js REST API

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Database (Local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with the required environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Features
- **User Authentication**: Secure login and registration flows via JWT.
- **Role-based Access**: Secured protected routes.
- **Campaigns & Donations**: Manage and view various NGO campaigns and monetary donations.
- **Responsive System**: Built using modern tooling suitable for all devices.
