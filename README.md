# Daily Expense Tracker 🦉

A premium, award-winning-style SaaS expense tracking application. Track every rupee, manage multiple wallets, split expenses with friends, and get smart insights—all in one stunning, high-performance web app.

## Features ✨
- **Dashboard Analytics**: Get a bird's-eye view of your finances with beautiful real-time area and pie charts (powered by Recharts).
- **Multiple Wallets**: Track cash, bank accounts, and credit cards separately to know exactly where your money sits.
- **Smart Budgets & Goals**: Set intelligent budgets that adapt to your spending patterns and track your long-term savings goals.
- **Expense Splitting**: Split bills with friends & family effortlessly. Our algorithm minimizes transactions to settle up.
- **Premium Animations**: Buttery smooth, 60fps micro-interactions and route transitions built with Framer Motion.
- **Dark/Light Mode**: A flawless, system-aware theme toggle that saves your preference with zero FOUC (Flash of Unstyled Content).
- **Firebase Authentication**: Secure email/password and social OAuth login (Google & GitHub) backed by Firebase.
- **User Profiles**: Manage your account and customize your avatar on the fly.
- **100% Free**: No pricing tiers, no paywalls. All premium features are accessible right out of the box.

## Tech Stack 🛠️
- **Frontend Framework**: React 19 + Vite
- **Styling**: Vanilla CSS with modern Custom Properties (Variables)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: Firebase Auth
- **Routing**: React Router DOM

## Getting Started 🚀

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository and navigate to the project folder:
   `ash
   cd budget
   `
2. Install the dependencies:
   `ash
   npm install
   `

### Firebase Setup
1. Create a Firebase project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable Authentication (Email/Password, Google, and GitHub).
3. Copy the .env.example file to .env:
   `ash
   cp .env.example .env
   `
4. Fill in your Firebase configuration values in the .env file.

### Running Locally
Start the development server:
`ash
npm run dev
`
Navigate to http://localhost:5173 to view the app!

## Building for Production
To build the app for production, run:
`ash
npm run build
`
The optimized files will be generated in the dist folder. You can preview the production build using 
pm run preview.
