# Artist Trading Platform

A modern web application that enables users to invest in and trade shares of their favorite artists. Built with React, Firebase, and modern web technologies.

## 🌟 Features

- **Artist Discovery**
  - Browse and search for artists
  - View detailed artist profiles and statistics
  - Real-time price updates and market data

- **Trading Interface**
  - Real-time order book
  - Place buy/sell orders
  - View trade history
  - Cancel open orders

- **Portfolio Management**
  - Track investments
  - Monitor performance
  - View transaction history
  - Watchlist functionality

- **User Features**
  - Secure authentication
  - Profile management
  - Investment tracking
  - Customizable watchlists

## 🚀 Technologies

- **Frontend**
  - React.js
  - CSS Modules
  - Context API for state management
  - React Router for navigation

- **Backend & Database**
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Storage
  - Firebase Security Rules

- **Development Tools**
  - Create React App
  - ESLint
  - Prettier
  - Git

## 📦 Installation

1. Clone the repository:
   git clone https://github.com/tfthushaar/artist-trading-platform.git
2. Install dependencies:
   cd artist-trading-platform
   npm install
3. Create a `.env` file in the root directory and add your Firebase configuration:
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
4. Start the development server:
   npm start


## 📚 Documentation

### Components

- **Common Components**: Reusable UI components
- **Investor Components**: Portfolio and trading interfaces
- **Artist Components**: Artist profiles and statistics

### Services

- **artistService**: Handles artist-related operations
- **investorService**: Manages investor portfolios and watchlists
- **tradingService**: Handles order placement and execution

### Styles

- Global styles and theme configuration
- CSS modules for component-specific styling
- Responsive design utilities

## 🔒 Security

- Firebase Authentication for user management
- Firestore Security Rules for data protection
- Input validation and sanitization
- Protected routes and components

## 🚀 Deployment

1. Build the production version:
   npm run build
2. Deploy to Firebase Hosting:
   firebase deploy


## 🔮 Future Improvements

- [ ] Advanced trading features (limit orders, stop losses)
- [ ] Social features and artist interaction
- [ ] Mobile application
- [ ] Advanced analytics and reporting
- [ ] Integration with music streaming platforms
