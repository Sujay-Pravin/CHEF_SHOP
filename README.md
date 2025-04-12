# 🍽️ AskChef Food Ordering Platform

A modern, full-stack food ordering application featuring an intuitive admin dashboard, secure payment integration, and AI-powered recipe suggestions. Built with React, Express.js, and MongoDB.

## ✨ Key Features

- 🛒 User-friendly food ordering interface
- 🔐 Secure payment processing with Razorpay
- 👨‍💼 Comprehensive admin dashboard
- 🤖 AI-powered recipe suggestions
- 🎨 Modern, responsive design
- 🔑 User authentication & authorization
- 🎫 Promo code system
- 📱 Mobile-responsive interface

## 🏗️ Project Structure

```
askchef/
├── frontend/     # 🌐 Customer-facing React application
├── admin/        # 👨‍💼 Admin dashboard React application
└── backend/      # ⚙️ Express.js API server
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### 📥 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/askchef.git
cd askchef
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin dependencies
cd ../admin
npm install
```

3. 🔐 Set up environment variables:

Copy the example environment files and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# Admin
cp admin/.env.example admin/.env
```

### ⚙️ Required Environment Variables

#### Backend (.env)

```env
PORT=4000                         # Server port
MONGODB_URI=your_mongodb_uri      # MongoDB connection string
JWT_SECRET=your_jwt_secret       # Secret for JWT authentication
RAZORPAY_KEY_ID=your_key_id      # Razorpay API key ID
RAZORPAY_KEY_SECRET=your_secret  # Razorpay API secret key
STRIPE_SECRET_KEY=your_key       # Stripe secret key
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000        # Backend API URL
VITE_GEMINI_API_KEY=your_gemini_api_key  # Google Gemini API key
```

#### Admin (.env)

```env
VITE_API_URL=http://localhost:4000  # Backend API URL
```

## 🏃‍♂️ Running the Application

1. Start the backend server:

```bash
cd backend
npm run server
```

2. Start the frontend application:

```bash
cd frontend
npm run dev
```

3. Start the admin dashboard:

```bash
cd admin
npm run dev
```

## 📡 API Endpoints

The application services are available at:

- 🔧 Backend API: `http://localhost:4000/api`
- 🌐 Frontend: `http://localhost:3000`
- 👨‍💼 Admin Dashboard: `http://localhost:3001`

## 🔒 Security Best Practices

- 🚫 Never commit .env files to version control
- 🔑 Keep API keys and secrets secure
- 📝 Use environment variables for sensitive information
- 🛡️ Follow security best practices for production deployment
- 🔐 Regularly update dependencies for security patches

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Submit a pull request

## 📜 License

This project is for educational and personal use. Modify and improve as you like!

## 🙏 Credits

This project was initially inspired by the tutorial from [GreatStack](https://youtu.be/DBMPXJJfQEA?si=ymVZ3RG_HJETXvj4). We have built upon the original tutorial and made several significant improvements:

### ✨ Our Enhancements

- 🎨 Improved UI/UX design and aesthetics
- 🔧 Enhanced backend functionality
- 🎫 Implementation of a promo code system
- ❌ Added order cancellation feature
- 📋 Added detailed order tracking for customers
- 👀 Added detailed customer order view in admin dashboard
- 💳 Replaced Stripe with Razorpay payment gateway for better Indian market compatibility
- 📱 Improved order cards alignment and responsiveness
- 🤖 Integrated AI-based recipe generator feature
  - Helps users generate recipes based on available ingredients
  - Provides value even when users don't want to order food

Special thanks to GreatStack for providing the foundation for this project!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
