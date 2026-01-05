# Nish Chat

Nish Chat is a real-time messaging application designed for university students. It provides a secure platform for students to connect, verifying their identity through their university email addresses.

## Features

- **Real-time Messaging:** Instant chat functionality powered by Socket.io.
- **Student Verification:** Secure registration requiring university email verification (`@edu`).
- **User Authentication:** Secure login and registration with JWT authentication.
- **Profile Management:** Users can update their profiles (avatars, names).
- **Mobile First:** Built with React Native and Expo for a seamless mobile experience.

## Tech Stack

### Frontend
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **State Management & Network:** Axios, Context API
- **Real-time:** Socket.io-client
- **UI:** Phosphor React Native, Expo Vector Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Tokens), Bcryptjs
- **Email Services:** Nodemailer

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (Local or Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omergokdass/nish-chat
   cd nish-chat
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   # Email Configuration (for verification)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```
   *Note: Ensure your MongoDB server is running.*

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Checks `constants/index.ts` or `services/authService.ts` to ensure the API URL matches your backend (default is often `http://localhost:3000` or your machine's IP for mobile testing).

   Start the frontend application:
   ```bash
   npx expo start
   ```
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan the QR code with Expo Go on your physical device

## Project Structure

```
nish-chat/
├── backend/          # Node.js/Express Server
│   ├── config/       # Database config
│   ├── controllers/  # Route controllers
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── socket/       # Socket.io logic
└── frontend/         # React Native (Expo) App
    ├── app/          # Expo Router pages
    ├── components/   # Reusable UI components
    ├── services/     # API services
    └── assets/       # Images and fonts
```
