# DevPulse - Issue Tracking System

DevPulse is a robust issue tracking and management system built with Express.js and PostgreSQL. It provides a complete API for managing issues, user authentication, and role-based access control.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Dev Tool**: tsx (TypeScript execution)

## 📦 Project Structure

```
devPulse/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   └── index.ts              # Environment configuration
│   ├── db/
│   │   └── index.ts              # Database connection & initialization
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication middleware
│   │   ├── maintainer.ts         # Role-based authorization middleware
│   │   └── index.d.ts            # TypeScript declarations
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   └── issues/
│   │       ├── issues.controller.ts
│   │       ├── issues.route.ts
│   │       └── issues.service.ts
│   └── utils/
│       ├── index.ts
│       ├── jwt.ts
│       ├── sendErrorResponse.ts
│       └── sendResponse.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Steps

1. **Clone and Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DB_CONNECTION_STRING=postgresql://user:password@localhost:5432/devpulse
   SALT_ROUNDS=10
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Database Setup**
   Create the PostgreSQL tables. The application initializes the database on startup.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   The server will start on the configured port (default: 3000)

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### 1. **User Registration / Sign Up**

- **Endpoint**: `POST /api/auth/signup`
- **Description**: Register a new user account
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string (valid email)",
    "password": "string",
    "role": "string (optional, default: 'contributor')"
  }
  ```
- **Example Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "contributor"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor",
      "created_at": "2024-06-01T10:00:00Z",
      "updated_at": "2024-06-01T10:00:00Z"
    }
  }
  ```
- **Error Response** (409):
  ```json
  {
    "statusCode": 409,
    "success": false,
    "message": "User already exist!"
  }
  ```

---

### 2. **User Login**

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and obtain JWT token
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "string (valid email)",
    "password": "string"
  }
  ```
- **Example Request**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "contributor",
        "created_at": "2024-06-01T10:00:00Z",
        "updated_at": "2024-06-01T10:00:00Z"
      }
    }
  }
  ```
- **Error Responses**:
  - (400) User not found:
    ```json
    {
      "statusCode": 400,
      "success": false,
      "message": "No user register with this email please register first!"
    }
    ```
  - (401) Wrong password:
    ```json
    {
      "statusCode": 401,
      "success": false,
      "message": "Password is wrong!"
    }
    ```

---

## 🐛 Issues Endpoints

### 3. **Create Issue**

- **Endpoint**: `POST /api/issues`
- **Description**: Create a new issue (requires authentication)
- **Authentication**: Required (JWT token in Authorization header)
- **Request Headers**:
  ```
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "type": "string (bug | feature_request)"
  }
  ```
- **Example Request**:
  ```json
  {
    "title": "Login button not responsive",
    "description": "The login button on the homepage is not responding to clicks",
    "type": "bug"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "Issue created successfully",
    "data": {
      "id": 1,
      "title": "Login button not responsive",
      "description": "The login button on the homepage is not responding to clicks",
      "type": "bug",
      "status": "open",
      "reporter_id": 1,
      "created_at": "2024-06-01T10:30:00Z",
      "updated_at": "2024-06-01T10:30:00Z"
    }
  }
  ```
- **Error Response** (401):
  ```json
  {
    "statusCode": 401,
    "success": false,
    "message": "Unauthorized"
  }
  ```

---

### 4. **Get All Issues**

- **Endpoint**: `GET /api/issues`
- **Description**: Retrieve all issues with optional filtering and sorting
- **Authentication**: Not required
- **Query Parameters**:
  - `sort`: `"newest"` (default) or `"oldest"` - Sort by creation date
  - `type`: `"bug"` or `"feature_request"` - Filter by issue type (optional)
  - `status`: `"open"`, `"in_progress"`, or `"resolved"` - Filter by status (optional)
- **Example Requests**:
  ```
  GET /api/issues
  GET /api/issues?sort=oldest
  GET /api/issues?type=bug
  GET /api/issues?status=open
  GET /api/issues?type=bug&status=open&sort=newest
  ```
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Issues retrived successfully",
    "data": [
      {
        "id": 1,
        "title": "Login button not responsive",
        "description": "The login button on the homepage is not responding to clicks",
        "type": "bug",
        "status": "open",
        "reporter": {
          "id": 1,
          "name": "John Doe",
          "role": "contributor"
        },
        "created_at": "2024-06-01T10:30:00Z",
        "updated_at": "2024-06-01T10:30:00Z"
      },
      {
        "id": 2,
        "title": "Add dark mode",
        "description": "Implement dark mode theme for the application",
        "type": "feature_request",
        "status": "in_progress",
        "reporter": {
          "id": 2,
          "name": "Jane Smith",
          "role": "contributor"
        },
        "created_at": "2024-06-01T09:15:00Z",
        "updated_at": "2024-06-01T11:00:00Z"
      }
    ]
  }
  ```

---

### 5. **Get Single Issue**

- **Endpoint**: `GET /api/issues/:id`
- **Description**: Retrieve details of a specific issue
- **Authentication**: Not required
- **URL Parameters**:
  - `id`: Issue ID (integer)
- **Example Request**:
  ```
  GET /api/issues/1
  ```
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Issue retrived successfully",
    "data": {
      "id": 1,
      "title": "Login button not responsive",
      "description": "The login button on the homepage is not responding to clicks",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2024-06-01T10:30:00Z",
      "updated_at": "2024-06-01T10:30:00Z"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "statusCode": 404,
    "success": false,
    "message": "Issue not found!"
  }
  ```

---

### 6. **Update Issue**

- **Endpoint**: `PATCH /api/issues/:id`
- **Description**: Update an existing issue (only by reporter or maintainer)
- **Authentication**: Required (JWT token in Authorization header)
- **Request Headers**:
  ```
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```
- **URL Parameters**:
  - `id`: Issue ID (integer)
- **Request Body** (all fields optional):
  ```json
  {
    "title": "string",
    "description": "string",
    "type": "string (bug | feature_request)"
  }
  ```
- **Example Request**:
  ```json
  {
    "title": "Login button not responsive on mobile",
    "status": "in_progress"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Issue updated successfully",
    "data": {
      "id": 1,
      "title": "Login button not responsive on mobile",
      "description": "The login button on the homepage is not responding to clicks",
      "type": "bug",
      "status": "open",
      "reporter_id": 1,
      "created_at": "2024-06-01T10:30:00Z",
      "updated_at": "2024-06-01T11:45:00Z"
    }
  }
  ```
- **Error Responses**:
  - (403) Unauthorized to update:
    ```json
    {
      "statusCode": 403,
      "success": false,
      "message": "You don't have access!"
    }
    ```
  - (404) Issue not found:
    ```json
    {
      "statusCode": 404,
      "success": false,
      "message": "Issue not found!"
    }
    ```

---

### 7. **Delete Issue**

- **Endpoint**: `DELETE /api/issues/:id`
- **Description**: Delete an issue (only by maintainer)
- **Authentication**: Required (JWT token in Authorization header)
- **Authorization**: Maintainer role required
- **Request Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters**:
  - `id`: Issue ID (integer)
- **Example Request**:
  ```
  DELETE /api/issues/1
  ```
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Issue deleted successfully"
  }
  ```
- **Error Responses**:
  - (401) Unauthorized:
    ```json
    {
      "statusCode": 401,
      "success": false,
      "message": "Unauthorized"
    }
    ```
  - (403) Not a maintainer:
    ```json
    {
      "statusCode": 403,
      "success": false,
      "message": "You don't have access!"
    }
    ```
  - (404) Issue not found:
    ```json
    {
      "statusCode": 404,
      "success": false,
      "message": "Issue not found!"
    }
    ```

---

## 🔑 Authentication

### JWT Token Usage

All protected endpoints require a JWT token passed in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Details

- **Algorithm**: HS256
- **Expiration**: 24 hours (1 day)
- **Secret**: Configured in `.env` (JWT_SECRET)
- **Payload Contains**: User ID, name, email, and role

---

## 👥 User Roles

### 1. **Contributor**

- Can create new issues
- Can update their own issues
- Can view all issues
- Cannot delete issues
- Cannot delete others' issues

### 2. **Maintainer**

- Can create issues
- Can update any issue
- Can view all issues
- Can delete any issue

---

## 📝 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'contributor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Issues Table

```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  reporter_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Starts the server with hot-reloading using tsx watch.

### Build TypeScript

```bash
tsc
```

---

## 📋 Status Codes Reference

| Code | Description                                      |
| ---- | ------------------------------------------------ |
| 200  | OK - Request successful                          |
| 201  | Created - Resource created successfully          |
| 400  | Bad Request - Invalid request parameters         |
| 401  | Unauthorized - Missing or invalid authentication |
| 403  | Forbidden - User doesn't have permission         |
| 404  | Not Found - Resource not found                   |
| 409  | Conflict - Resource already exists               |
| 500  | Internal Server Error                            |

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ Error handling and logging
- ✅ Environment variable configuration

---

## 📦 Dependencies

### Production

- `express` - Web framework
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT handling
- `bcrypt` - Password hashing
- `dotenv` - Environment variable management

### Development

- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution and watch mode
- `@types/*` - TypeScript type definitions

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

ISC

---

## 👨‍💻 Author

DevPulse Development Team

---

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.
