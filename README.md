# Task Manager Backend

A secure RESTful API backend for a task management application built with modern Node.js technologies.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x - Fast and minimal web framework
- **Database**: PostgreSQL with Prisma ORM
- **ORM**: Prisma 6.x - Modern database toolkit with type safety
- **Authentication**: JWT (JSON Web Tokens) for stateless auth
- **Security**: 
  - bcrypt 6.x - Password hashing and verification
  - CORS - Cross-Origin Resource Sharing middleware
- **Environment**: dotenv - Environment variable management
- **Development**: Nodemon - Auto-restart on file changes

## Database Schema

### User Model
- `id` (Int, Primary Key) - Auto-incrementing user ID
- `email` (String, Unique) - User's email address
- `password` (String) - Bcrypt-hashed password
- `tasks` (Relation) - One-to-many relationship with Task

### Task Model
- `id` (Int, Primary Key) - Auto-incrementing task ID
- `title` (String) - Task description
- `status` (String) - Task status (Todo, In Progress, Done, etc.)
- `userId` (Int, Foreign Key) - Reference to User
- `user` (Relation) - Back-reference to User

## API Endpoints

### Authentication
- `POST /register` - Create new user account
  - Body: `{ email: string, password: string }`
  - Returns: User object (without password)

- `POST /login` - Authenticate user and get JWT token
  - Body: `{ email: string, password: string }`
  - Returns: `{ token: string }`

### Tasks (Protected - Requires JWT)
- `GET /tasks` - Retrieve all tasks for authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of Task objects

- `POST /tasks` - Create new task for authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title: string }`
  - Returns: Created Task object

## Problems & Solutions

### Problem: Password Security
**Issue**: Plain-text password storage or weak hashing could expose user credentials.

**Solution**:
- Implemented bcrypt (npm package: `bcrypt ^6.0.0`) with salt rounds of 10
- Passwords are hashed during registration: `bcrypt.hash(req.body.password, 10)`
- Password verification uses secure comparison: `bcrypt.compare(inputPassword, hashedPassword)`
- Hashed passwords are stored in the database, never plain text

### Problem: Stateless Authentication at Scale
**Issue**: Sessions require server-side storage, creating scalability bottlenecks.

**Solution**:
- Implemented JWT (JSON Web Tokens) for stateless authentication
- No session storage needed - token contains user ID and is cryptographically signed
- Middleware validates token on each protected route: `auth` middleware
- Tokens verified using `process.env.JWT_SECRET` - must be set in `.env`

### Problem: Database Access Control
**Issue**: Users could access other users' tasks through unauthorized queries.

**Solution**:
- Protected all task routes with `auth` middleware requiring valid JWT
- Task queries filtered by authenticated user: `where: { userId: req.user.id }`
- User ID extracted from JWT token payload prevents unauthorized access

### Problem: Cross-Origin Requests
**Issue**: Frontend (likely different port/domain) couldn't communicate with backend.

**Solution**:
- Added CORS middleware: `app.use(cors())`
- Allows controlled cross-origin requests between frontend and backend

### Problem: Type Safety & Database Consistency
**Issue**: Manual SQL queries are error-prone and lack type checking.

**Solution**:
- Implemented Prisma ORM for type-safe database queries
- Automatic migrations and schema validation
- Auto-generated TypeScript types matching database schema

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
JWT_SECRET=your-secret-key-here
PORT=3000
```

## Setup & Installation

```bash
# Install dependencies
npm install

# Setup database (run migrations)
npx prisma migrate dev

# Start development server (with auto-reload)
npm start

# Server runs on http://localhost:3000
```

## Security Considerations

✅ **Implemented**:
- Password hashing with bcrypt
- JWT-based stateless authentication
- CORS protection
- Environment variable separation for secrets
- Input validation via Prisma schema

⚠️ **Recommended for Production**:
- Add input validation/sanitization (joi, zod)
- Implement rate limiting
- Add HTTPS/TLS encryption
- Set strong JWT_SECRET (use 32+ character random string)
- Add error handling and logging
- Implement refresh tokens with expiration
- Add request logging and monitoring

## Author

Ifrene Arlando A.
