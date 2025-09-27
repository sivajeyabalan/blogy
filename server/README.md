# Memories Backend - Supabase PostgreSQL with Prisma

This backend has been migrated from MongoDB to Supabase PostgreSQL using Prisma ORM and raw SQL queries.

## 🚀 Features

- **Supabase PostgreSQL** - Cloud-hosted PostgreSQL database
- **Prisma ORM** - Type-safe database access with auto-generated client
- **Raw SQL Support** - Direct PostgreSQL queries using the `postgres` package
- **Connection Pooling** - Optimized connection management
- **SSL Support** - Secure connections to Supabase
- **Health Monitoring** - Database health checks and monitoring
- **Graceful Shutdown** - Proper connection cleanup

## 📋 Prerequisites

- Node.js 18+
- Supabase account and project
- Environment variables configured

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
# Database URLs
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?sslmode=require"

# JWT Secret
JWT_SECRET="your-jwt-secret"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=5000
NODE_ENV=development
```

## 🛠️ Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   # Pull existing schema from Supabase
   npm run db:pull

   # Generate Prisma client
   npm run db:generate

   # Run migrations (if needed)
   npm run migrate
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📊 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:pull` - Pull schema from database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 🏗️ Architecture

### Database Layer

- **Prisma Client** - Primary ORM for type-safe database operations
- **Raw SQL** - Direct PostgreSQL queries for complex operations
- **Connection Pooling** - Optimized connection management
- **Retry Logic** - Automatic reconnection on failures

### API Endpoints

#### Health Check

- `GET /health` - Database and server health status

#### Posts

- `GET /posts` - Get paginated posts
- `GET /posts/search` - Search posts by title/message and tags
- `GET /posts/:id` - Get single post with user info
- `POST /posts` - Create new post (requires auth)
- `PATCH /posts/:id` - Update post (requires auth)
- `DELETE /posts/:id` - Delete post (requires auth)
- `PATCH /posts/:id/likePost` - Like/unlike post (requires auth)
- `PATCH /posts/:id/commentPost` - Add comment to post (requires auth)

#### Users

- `POST /user/signin` - User sign in
- `POST /user/signup` - User sign up
- `POST /user/googleSignIn` - Google OAuth sign in

## 🔍 Database Schema

### Users Table

```sql
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- password (String, Optional)
- googleId (String, Unique, Optional)
- imageUrl (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Posts Table

```sql
- id (UUID, Primary Key)
- title (String, Optional)
- message (String, Optional)
- name (String, Optional)
- creator (String, Foreign Key to Users)
- tags (String Array)
- selectedFile (String, Optional)
- likes (String Array)
- comments (String Array)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## 🔧 Configuration

### Prisma Configuration

The Prisma client is configured with:

- Connection retry logic
- SSL support for Supabase
- Query logging in development
- Connection timeouts

### Raw SQL Configuration

The `postgres` package is configured with:

- Connection pooling (max 20 connections)
- SSL requirement
- Idle timeout (20 seconds)
- Retry logic
- Debug mode in development

## 🚨 Troubleshooting

### Connection Issues

1. **SSL Errors**: Ensure `sslmode=require` is in your DATABASE_URL
2. **Connection Timeouts**: Check your Supabase project status
3. **Authentication**: Verify your database credentials

### Common Solutions

```bash
# Reset Prisma client
npm run db:generate

# Check database connection
npm run migrate

# View database in Prisma Studio
npm run db:studio
```

### Health Check

Visit `http://localhost:5000/health` to check:

- Prisma connection status
- Raw SQL connection status
- Overall database health

## 🔄 Migration from MongoDB

This backend has been fully migrated from MongoDB to PostgreSQL:

### Changes Made:

1. ✅ Replaced MongoDB with Supabase PostgreSQL
2. ✅ Migrated from Mongoose to Prisma ORM
3. ✅ Updated all database queries to use Prisma
4. ✅ Added raw SQL support for complex queries
5. ✅ Implemented connection pooling and retry logic
6. ✅ Added comprehensive error handling
7. ✅ Created health monitoring endpoints
8. ✅ Optimized queries with proper indexing

### Removed:

- ❌ MongoDB/Mongoose dependencies
- ❌ Sequelize models (replaced with Prisma schema)
- ❌ MongoDB-specific query patterns

## 📈 Performance Optimizations

- **Database Indexing**: Added indexes on frequently queried fields
- **Connection Pooling**: Optimized connection management
- **Query Optimization**: Improved Prisma queries with includes
- **Parallel Execution**: Used Promise.all for concurrent operations
- **Error Handling**: Comprehensive error handling and logging

## 🔒 Security

- **SSL/TLS**: All database connections use SSL
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Proper validation of user inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Environment Variables**: Sensitive data stored in environment variables
