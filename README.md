# Front Desk System - Clinic Management

# Application developed by Kaushik Challapalli , kaushikchris9@gmail.com

A comprehensive full-stack clinic management system designed for front desk operations. Built with NestJS backend and Next.js frontend, featuring modern UI, authentication, and real-time queue management.

## 🚀 Features

### Core Functionality
- **Authentication & Authorization** - JWT-based login/logout system
- **Queue Management** - Real-time patient queue with priority levels
- **Appointment Management** - Schedule, update, and track appointments
- **Doctor Management** - Doctor profiles with specializations and availability
- **Patient Management** - Comprehensive patient records and search
- **Dashboard** - Overview of daily operations and key metrics

### Advanced Features
- **Real-time Updates** - Live queue status and appointment changes
- **Priority Queuing** - Support for urgent, high, normal, and low priority patients
- **Search & Filter** - Advanced search across doctors, patients, and appointments
- **Status Tracking** - Track patient progress through the system
- **Responsive Design** - Modern, mobile-friendly interface

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-relational mapping
- **MySQL** - Database system
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware
- **bcryptjs** - Password hashing
- **class-validator** - Input validation

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API calls
- **date-fns** - Date manipulation utilities

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Allo Health Application"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Seed the database with sample data
npm run seed

# Start the development server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Login Credentials**: admin@clinic.com / admin123

## 📁 Project Structure

```
Allo Health Application/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── doctors/        # Doctor management
│   │   ├── patients/       # Patient management
│   │   ├── appointments/   # Appointment management
│   │   ├── queue/          # Queue management
│   │   ├── entities/       # Database entities
│   │   ├── config/         # Configuration files
│   │   └── database/       # Database seeder
│   └── package.json
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API service layer
│   │   └── lib/           # Utility functions
│   └── package.json
├── .vscode/               # VS Code configuration
└── README.md
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=clinic_db

# JWT
JWT_SECRET=your_jwt_secret_key

# Application
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

### Queue Management
- `GET /queue` - Get current queue
- `POST /queue` - Add patient to queue
- `PATCH /queue/:id/status` - Update queue entry status
- `DELETE /queue/:id` - Remove from queue

### Doctor Management
- `GET /doctors` - Get all doctors (with filters)
- `POST /doctors` - Create new doctor
- `GET /doctors/:id` - Get doctor by ID
- `PATCH /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Delete doctor

### Patient Management
- `GET /patients` - Get all patients (with search)
- `POST /patients` - Create new patient
- `GET /patients/:id` - Get patient by ID
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Appointment Management
- `GET /appointments` - Get appointments (with filters)
- `POST /appointments` - Create appointment
- `GET /appointments/:id` - Get appointment by ID
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

## 🎯 Usage Guide

### 1. Login
- Navigate to `/login`
- Use demo credentials: `admin@clinic.com` / `admin123`

### 2. Dashboard
- View daily statistics and recent activities
- Quick access to key functions

### 3. Queue Management
- Add patients to queue with priority levels
- Update patient status (waiting → with doctor → completed)
- Real-time queue updates

### 4. Appointments
- Schedule new appointments
- View daily/weekly appointment calendar
- Update appointment status

### 5. Doctor Management
- Add new doctors with specializations
- Update availability status
- Search and filter doctors

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - class-validator for request validation
- **CORS Configuration** - Properly configured cross-origin requests
- **Authorization Guards** - Protected routes and resources

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run start
```

### Production Environment Variables
- Set `NODE_ENV=production`
- Configure production database credentials
- Use secure JWT secrets
- Set proper CORS origins

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **NestJS** team for the excellent framework
- **Next.js** team for the React framework
- **Tailwind CSS** for the utility-first CSS framework
- **TypeORM** for the powerful ORM
- **Lucide** for the beautiful icons

---

**Built with ❤️ for efficient clinic management**
