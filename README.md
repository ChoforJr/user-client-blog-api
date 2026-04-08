# Blog API User Client

A modern, responsive React-based frontend client for the Blog API. This application allows users to browse and read blog posts in a user-friendly interface.

## Related Projects

This is part of a three-part Blog API ecosystem:

- 📱 **[Blog API Backend](https://github.com/ChoforJr/blog-api)** - RESTful API server
- 👥**[Admin Client](https://github.com/ChoforJr/admin-client-blog-api)** - Admin dashboard client

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Available Scripts](#available-scripts)
- [Related Projects](#related-projects)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## ✨ Features

- **Browse Posts**: View all published blog posts with pagination
- **Post Details**: Read individual posts with complete content
- **User Authentication**: Sign in to access personalized features
- **Account Management**: Manage user profile and preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error pages for a better user experience
- **Fast Performance**: Built with Vite for optimized load times

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **Git** (for cloning the repository)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChoforJr/user-client-blog-api.git
   cd user-client-blog-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment (if needed)**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

## 🎯 Getting Started

1. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

2. **Build for production**

   ```bash
   npm run build
   ```

3. **Preview production build**

   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── App Components/          # Main App layout and logic
├── HomePage Components/     # Home page view
├── Posts Components/        # Posts list view
├── Post Components/         # Individual post view
├── SignIn Components/       # Authentication view
├── Account Components/      # User account management
├── App.jsx                  # Root app component
├── ItemContext.jsx          # Context API setup
├── routes.jsx               # Route definitions
├── ErrorPage.jsx            # Error boundary page
└── main.jsx                 # Application entry point

tests/
├── setup.js                 # Test configuration
```

## 🛠️ Technologies Used

- **React** (v19.1.1) - UI library
- **React Router DOM** (v7.8.2) - Client-side routing
- **Vite** (v7.1.2) - Build tool and dev server
- **Lucide React** (v0.541.0) - Icon library
- **Vitest** (v3.2.4) - Testing framework
- **ESLint** (v9.33.0) - Code linting

## 📝 Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Create production build          |
| `npm run preview` | Preview production build locally |
| `npm run test`    | Run tests with Vitest            |
| `npm run lint`    | Run ESLint to check code quality |

## Author

**FORSAKANG CHOFOR JUNIOR**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)
