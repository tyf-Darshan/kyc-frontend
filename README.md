# E-KYC Frontend

A modern React frontend for the E-KYC authentication system with email verification and OTP support.

## Features

- **User Registration** - Create new accounts with validation
- **Login** - Secure login with email and password
- **OTP Verification** - 6-digit OTP verification with resend functionality
- **Email Verification in Dashboard** - Verify email after login before accessing features
- **Protected Routes** - Dashboard access restricted to authenticated users
- **Email Verification Guards** - Dashboard features locked until email is verified

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:3001`

### Build for Production

```bash
npm run build
```

## Architecture

### Pages
- **Register** - User registration page
- **Login** - User login page
- **VerifyOTP** - OTP verification during registration
- **Dashboard** - Protected dashboard with email verification modal

### Components
- **ProtectedRoute** - Route guard for authenticated users
- **EmailVerificationModal** - Modal for email verification in dashboard

### Services
- **api.js** - Axios instance with API endpoints

### Context
- **AuthContext** - Global auth state management

## Workflow

1. **Register** → User creates account
2. **OTP Verification** → User verifies email with OTP (must be done after registration before login)
3. **Login** → User logs in with email/password
4. **Dashboard** → User is redirected to dashboard with email verification modal
5. **Verify Email** → User verifies email in dashboard using OTP
6. **Access Features** → Once verified, user can access all dashboard features

## API Endpoints Used

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP

## Notes

- OTP must be verified immediately after registration OR from dashboard before accessing features
- The backend should require email verification (`isEmailVerified: true`) for KYC operations
- Token is stored in localStorage (use JWT in production)
- Email verification status is persisted in localStorage
