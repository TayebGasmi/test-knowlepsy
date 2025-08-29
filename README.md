# Event Management Application

A fullstack monorepo web application for event management built with React.js, TypeScript, Node.js, Express, and MongoDB. Managed with pnpm workspaces for efficient dependency management.

## Features

- 🔐 **User authentication** (signup/login) with JWT
- 📅 **Event CRUD operations** (Create, Read, Delete)
- 🔍 **Event filtering** by date, location, and search
- 📊 **Dashboard with statistics** and interactive charts
- 🎨 **Modern responsive design** with Tailwind CSS and dark mode
- ✅ **Form validation** with Zod and React Hook Form
- ♿ **Accessibility features** with ARIA labels and focus management
- 🚀 **TypeScript support** for better development experience

## Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Redux Toolkit** with RTK Query for state management
- **React Router v6+** for navigation
- **Tailwind CSS** with dark mode support
- **Recharts** for interactive statistics
- **Zod + React Hook Form** for validation
- **Vite** for fast development and building

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT authentication** with secure token management
- **Zod validation** for request validation
- **MVC architecture** with clean separation of concerns
- **Jest + Supertest** for comprehensive testing

## Getting Started

### Prerequisites
- **Node.js 18+**
- **pnpm** (recommended) or npm
- **Docker and Docker Compose**

### Quick Setup

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd event-management
   ```

3. **Install all dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up environment variables**:
   ```bash
   # Backend environment
   cp backend/env.example backend/.env
   
   # Frontend environment  
   cp frontend/env.example frontend/.env
   ```

5. **Start MongoDB**:
   ```bash
   pnpm run docker:up
   ```

6. **Start the development servers**:
   ```bash
   pnpm run dev
   ```

### Alternative Setup with npm

If you prefer using npm:
```bash
npm install
npm run docker:up
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

### Available Scripts

#### Development
- `pnpm run dev` - Start both frontend and backend in development mode
- `pnpm run dev:backend` - Start only the backend server
- `pnpm run dev:frontend` - Start only the frontend development server

#### Building & Testing
- `pnpm run build` - Build both applications for production
- `pnpm run test` - Run backend tests with Jest

#### Database Management
- `pnpm run docker:up` - Start MongoDB container
- `pnpm run docker:down` - Stop MongoDB container

#### Individual Workspace Commands
```bash
# Backend specific commands
pnpm --filter event-management-backend dev
pnpm --filter event-management-backend test
pnpm --filter event-management-backend build

# Frontend specific commands  
pnpm --filter event-management-frontend dev
pnpm --filter event-management-frontend build
```

## Project Structure

```
event-management/
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── models/             # MongoDB models (User, Event)
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth, error handling
│   │   ├── utils/              # JWT, validation helpers
│   │   ├── __tests__/          # Jest test files
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point
│   ├── local-config/
│   │   └── docker-compose.yml  # MongoDB container setup
│   ├── env.example             # Environment variables template
│   ├── package.json
│   └── jest.config.js
├── frontend/                    # React TypeScript SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── routes/             # React Router setup
│   │   ├── store/              # Redux store, slices, APIs
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx             # Main app component
│   │   └── index.tsx           # App entry point
│   ├── env.example             # Environment variables template
│   ├── package.json
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.ts          # Vite build configuration
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── package.json                # Root package configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events (with optional filters)
- `POST /api/events` - Create new event
- `DELETE /api/events/:id` - Delete event

## Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://root:root@localhost:27017/event_management?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

## Key Features Explained

### 🔐 Authentication System
- **JWT-based authentication** with secure token storage
- **Protected routes** that redirect unauthenticated users
- **User registration and login** with form validation
- **Automatic token refresh** handling

### 📅 Event Management
- **Create events** with title, description, date, location, and capacity
- **View event details** with organizer information and attendee lists
- **Delete events** (only by organizers)
- **Event filtering** by date range, location, and search terms
- **Pagination** for large event lists

### 📊 Dashboard & Analytics
- **Statistics overview** showing total events, upcoming events, past events, and total attendees
- **Interactive charts** displaying events by month using Recharts
- **Recent events** quick access

### 🎨 User Experience
- **Dark/Light mode** toggle with system preference detection
- **Responsive design** that works on all devices
- **Loading states** and error handling throughout the app
- **Toast notifications** for user feedback
- **Accessibility features** with proper ARIA labels and keyboard navigation

## Development Notes

### TypeScript Integration
- **Full TypeScript support** in the frontend with strict type checking
- **Type-safe Redux** with proper typing for state and actions
- **Form validation** with Zod schemas shared between frontend and backend

### Performance Optimizations
- **Code splitting** with React Router lazy loading
- **Optimized Redux** with RTK Query for efficient data fetching
- **Vite** for fast development builds and HMR

### Testing Strategy
- **Backend testing** with Jest and Supertest
- **API endpoint testing** with full database integration
- **Authentication flow testing** with JWT token validation

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill existing Node processes
   taskkill /f /im node.exe  # Windows
   killall node              # macOS/Linux
   ```

2. **MongoDB connection issues**:
   ```bash
   # Ensure Docker is running and start MongoDB
   pnpm run docker:up
   
   # Check container status
   docker ps
   ```

3. **pnpm workspace issues**:
   ```bash
   # Clear pnpm cache and reinstall
   pnpm store prune
   rm -rf node_modules */node_modules
   pnpm install
   ```

4. **TypeScript compilation errors**:
   ```bash
   # Check TypeScript configuration
   cd frontend && npx tsc --noEmit
   ```
