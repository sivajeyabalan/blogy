# Memories - Backend API

A robust RESTful API server built with Node.js and Express.js that powers the Memories social media application. The backend provides secure authentication, file upload capabilities, and comprehensive CRUD operations for managing posts and user data with PostgreSQL database integration.

## ✨ Features

### 🔐 Authentication & Security

- **JWT Authentication** - Secure token-based authentication system
- **Google OAuth Integration** - Seamless Google sign-in support
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Configurable cross-origin resource sharing
- **Request Timeout** - 5-minute timeout for file uploads and long requests

### 📝 Post Management

- **CRUD Operations** - Create, read, update, and delete posts
- **Image Upload** - Cloudinary integration for image storage and optimization
- **Search & Filter** - Advanced search by title, content, and tags
- **Pagination** - Efficient data loading with configurable page limits
- **Like System** - User interaction with posts
- **Comment System** - Threaded discussions on posts

### 👥 User Management

- **User Registration** - Email/password and Google OAuth signup
- **User Authentication** - Secure login with JWT tokens
- **Profile Management** - User data and image handling
- **Session Management** - Persistent user sessions

### 🗄️ Database Features

- **PostgreSQL Integration** - Robust relational database support
- **Connection Pooling** - Optimized database connections
- **Query Optimization** - Efficient database queries with proper indexing
- **Data Validation** - Input validation and sanitization

### 🚀 Performance & Reliability

- **Health Check Endpoint** - Server and database status monitoring
- **Error Handling** - Comprehensive error handling and logging
- **Graceful Shutdown** - Proper server shutdown procedures
- **Request Logging** - Detailed request and error logging

## 🛠️ Tech Stack

### Core Framework

- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Web application framework
- **ES Modules** - Modern JavaScript module system

### Database & ORM

- **PostgreSQL 3.4.7** - Primary database
- **Postgres.js** - Lightweight PostgreSQL client
- **Connection Pooling** - Optimized database connections

### Authentication & Security

- **JSON Web Tokens (JWT) 9.0.2** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing

### File Upload & Storage

- **Multer 1.4.5** - File upload middleware
- **Cloudinary 1.41.3** - Cloud-based image storage and optimization
- **Multer Storage Cloudinary 4.0.0** - Cloudinary integration

### Development & Utilities

- **Nodemon 3.1.9** - Development server with auto-restart
- **dotenv 16.6.1** - Environment variable management
- **Body Parser 1.20.3** - Request body parsing

## 📁 Project Structure

```
server/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── controllers/               # Business logic controllers
│   ├── posts.js              # Post-related operations
│   └── users.js              # User authentication operations
├── database/                  # Database layer
│   ├── queries.js            # SQL query functions
│   ├── schema.js             # Database schema setup
│   └── simple-db.js          # Database connection
├── middleware/                # Custom middleware
│   ├── auth.js               # JWT authentication middleware
│   └── upload.js             # File upload middleware
├── models/                    # Data models (legacy)
│   ├── PostMessage.js        # Post model
│   └── User.js               # User model
├── routes/                    # API route definitions
│   ├── posts.js              # Post routes
│   └── users.js              # User routes
├── scripts/                   # Database and utility scripts
│   ├── migrate.js            # Database migration
│   ├── seed.js               # Database seeding
│   ├── simple-seed.js        # Simple seeding script
│   ├── reset-and-seed.js     # Reset and seed database
│   └── test-*.js             # Various test scripts
├── utils/                     # Utility functions
├── index.js                   # Main server file
├── package.json              # Dependencies and scripts
└── vercel.json               # Vercel deployment configuration
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (local or cloud)
- Cloudinary account (for image storage)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Memories-Project/server
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/memories_db
# OR for Render deployment:
PGHOST=your_postgres_host
PGPORT=5432
PGDB=your_database_name
PGUSER=your_username
PGPASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Database Connection (Optional)
DB_CONNECTION_LIMIT=5
```

### 4. Database Setup

#### Local PostgreSQL Setup

```bash
# Create database
createdb memories_db

# Run migrations
npm run migrate

# Seed database (optional)
npm run db:seed
```

#### PostgreSQL Atlas Setup

1. Create a PostgreSQL database on [Supabase](https://supabase.com) or [Railway](https://railway.app)
2. Copy the connection string to your `.env` file
3. Run migrations: `npm run migrate`

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The server will be available at `http://localhost:5000`

### 6. Production Build

```bash
npm start
# or
yarn start
```

## 🔧 Environment Variables

| Variable                | Description                  | Default                 | Required |
| ----------------------- | ---------------------------- | ----------------------- | -------- |
| `PORT`                  | Server port                  | `5000`                  | No       |
| `NODE_ENV`              | Environment mode             | `development`           | No       |
| `DATABASE_URL`          | PostgreSQL connection string | -                       | Yes\*    |
| `PGHOST`                | PostgreSQL host (Render)     | -                       | No       |
| `PGPORT`                | PostgreSQL port (Render)     | `5432`                  | No       |
| `PGDB`                  | Database name (Render)       | -                       | No       |
| `PGUSER`                | Database user (Render)       | -                       | No       |
| `PGPASSWORD`            | Database password (Render)   | -                       | No       |
| `JWT_SECRET`            | JWT signing secret           | -                       | Yes      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        | -                       | Yes      |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           | -                       | Yes      |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        | -                       | Yes      |
| `FRONTEND_URL`          | Frontend URL for CORS        | `http://localhost:5173` | No       |
| `DB_CONNECTION_LIMIT`   | Database connection limit    | `5`                     | No       |

\*Either `DATABASE_URL` or all PostgreSQL variables (PGHOST, PGPORT, etc.) are required.

## 📚 API Endpoints Documentation

### Authentication Endpoints

#### POST `/user/signin`

Sign in with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "result": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "imageUrl": "profile_image_url"
  },
  "token": "jwt_token"
}
```

#### POST `/user/signup`

Create a new user account.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### POST `/user/googleSignIn`

Sign in with Google OAuth.

**Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "googleId": "google_user_id",
  "imageUrl": "profile_image_url"
}
```

### Posts Endpoints

#### GET `/posts`

Get paginated list of posts.

**Query Parameters:**

- `page` (optional): Page number (default: 1)

**Response:**

```json
{
  "data": [
    {
      "id": "post_id",
      "title": "Post Title",
      "message": "Post content",
      "name": "Author Name",
      "creator": "user_id",
      "tags": ["tag1", "tag2"],
      "selectedFile": "image_url",
      "likes": ["user_id1", "user_id2"],
      "comments": ["comment1", "comment2"],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "numberOfPages": 5
}
```

#### GET `/posts/:id`

Get a specific post by ID.

#### POST `/posts`

Create a new post.

**Headers:**

- `Authorization: Bearer <jwt_token>`

**Request Body (multipart/form-data):**

- `title`: Post title
- `message`: Post content
- `tags`: Comma-separated tags
- `file`: Image file (optional)

#### PATCH `/posts/:id`

Update an existing post.

**Headers:**

- `Authorization: Bearer <jwt_token>`

#### DELETE `/posts/:id`

Delete a post.

**Headers:**

- `Authorization: Bearer <jwt_token>`

#### PATCH `/posts/:id/likePost`

Like or unlike a post.

**Headers:**

- `Authorization: Bearer <jwt_token>`

#### PATCH `/posts/:id/commentPost`

Add a comment to a post.

**Headers:**

- `Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "value": "Comment text"
}
```

#### GET `/posts/search`

Search posts by query and tags.

**Query Parameters:**

- `searchQuery`: Search term
- `tags`: Comma-separated tags

### Health Check

#### GET `/health`

Check server and database status.

**Response:**

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🗄️ Database Setup

### PostgreSQL Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Posts Table

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  message TEXT,
  name VARCHAR(255),
  creator UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tags TEXT[],
  selected_file TEXT,
  likes TEXT[],
  comments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Migration

```bash
# Run database migrations
npm run migrate

# Seed database with sample data
npm run db:seed

# Reset and seed database
node scripts/reset-and-seed.js
```

## 🚀 Deployment

### Render Deployment (Recommended)

1. **Connect to Render**:

   - Create account at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**:

   - Choose "Web Service"
   - Select your repository
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Environment Variables**:

   - Add all required environment variables in Render dashboard
   - Set `NODE_ENV=production`

4. **Database Setup**:
   - Create PostgreSQL database in Render
   - Copy connection details to environment variables

### Railway Deployment

1. **Connect to Railway**:

   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Deploy**:

   ```bash
   railway up
   ```

3. **Database**:
   - Add PostgreSQL service in Railway dashboard
   - Connect to your database

### Vercel Deployment

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel --prod
   ```

3. **Environment Variables**:
   - Set in Vercel dashboard under Settings > Environment Variables

### Other Deployment Options

#### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

#### DigitalOcean App Platform

- Connect GitHub repository
- Configure build and run commands
- Set environment variables
- Add PostgreSQL database

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run test:db` - Test database connection
- `npm run test:simple` - Run simple tests

### Database Scripts

- `node scripts/simple-migrate.js` - Create database tables
- `node scripts/simple-seed.js` - Seed with sample data
- `node scripts/reset-and-seed.js` - Reset and seed database
- `node scripts/test-connection.js` - Test database connection

### Best Practices

- Use environment variables for configuration
- Implement proper error handling
- Validate input data
- Use database transactions for complex operations
- Implement rate limiting for production
- Add request logging and monitoring

## 🔒 Security Considerations

- **JWT Secret**: Use a strong, random JWT secret
- **Password Hashing**: Always hash passwords with bcrypt
- **CORS Configuration**: Restrict origins to known domains
- **Input Validation**: Validate and sanitize all inputs
- **File Upload**: Limit file types and sizes
- **Database**: Use parameterized queries to prevent SQL injection

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**:

   - Check database credentials
   - Ensure database is running
   - Verify connection string format

2. **Cloudinary Upload Failed**:

   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file format

3. **CORS Errors**:

   - Update `FRONTEND_URL` environment variable
   - Check allowed origins in CORS configuration

4. **JWT Token Issues**:
   - Verify `JWT_SECRET` is set
   - Check token expiration
   - Ensure proper token format

### Debug Commands

```bash
# Test database connection
npm run test:db

# Test simple functionality
npm run test:simple

# Check server health
curl http://localhost:5000/health
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation
- Review the database schema
- Test with the provided scripts

---

**Built with ❤️ using Node.js, Express.js, and PostgreSQL**
