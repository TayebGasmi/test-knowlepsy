# Event Management Application

A fullstack monorepo web application for event management built with React.js, Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login) with JWT
- Event CRUD operations (Create, Read, Delete)
- Event filtering by date and location
- Basic statistics and charts
- Responsive design with Tailwind CSS
- Form validation with Zod and React Hook Form
- Accessibility features

## Tech Stack

### Frontend
- React.js with functional components and hooks
- Redux Toolkit with RTK Query
- React Router v6+
- Tailwind CSS
- Recharts for statistics
- Zod + React Hook Form for validation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Zod validation
- MVC architecture
- Jest + Supertest for testing

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose

### Quick Setup

Run the automated setup script:
```bash
node setup.js
```

This will:
- Create environment files with default values
- Install all dependencies for root, backend, and frontend
- Provide next steps for running the application

### Manual Installation

1. Clone the repository and navigate to the project directory

2. Install all dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. Set up environment variables:
   - Copy `backend/env.example` to `backend/.env`
   - Copy `frontend/env.example` to `frontend/.env`
   - Update the values as needed (the setup script generates secure defaults)

4. Start MongoDB with Docker:
   ```bash
   npm run docker:up
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:backend` - Start only the backend
- `npm run dev:frontend` - Start only the frontend
- `npm run build` - Build both applications for production
- `npm run test` - Run backend tests
- `npm run docker:up` - Start MongoDB container
- `npm run docker:down` - Stop MongoDB container

## Project Structure

```
event-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── local-config/
│   │   └── docker-compose.yml
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
└── package.json
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

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)
