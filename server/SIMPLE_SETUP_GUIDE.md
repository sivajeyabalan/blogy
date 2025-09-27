# 🚀 Simple Backend Setup Guide (No Prisma)

## Overview

This is a lightweight backend using only the `postgres` package for direct SQL queries. No Prisma, no ORM complexity - just simple, fast database operations.

## What's Been Removed

- ❌ Prisma ORM
- ❌ Prisma Client
- ❌ Complex connection managers
- ❌ Prisma migrations
- ❌ Prisma schema files

## What's Been Added

- ✅ Simple `postgres` package connection
- ✅ Direct SQL queries
- ✅ Lightweight database functions
- ✅ Simple migration script
- ✅ Simple seed script

## Environment Variables Needed

```env
# Render PostgreSQL Variables (provided by Render)
PGHOST="dpg-xxxxx-a.oregon-postgres.render.com"
PGPORT="5432"
PGDB="your_database_name"
PGUSER="your_username"
PGPASSWORD="your_password"

# Application Variables
PORT=5000
NODE_ENV=production
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME="dwj5xlqgk"
CLOUDINARY_API_KEY="161773169141762"
CLOUDINARY_API_SECRET="bWgP7t6Afw6moSAWjnXQT8Jscms"
```

## Setup Steps

### 1. Set Environment Variables

Update your `.env` file with the Render PostgreSQL variables.

### 2. Test Connection

```bash
npm run test:simple
```

### 3. Run Migration

```bash
npm run migrate
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

### 5. Start Server

```bash
npm run dev
```

## File Structure

```
server/
├── database/
│   ├── simple-db.js      # Database connection
│   ├── schema.js         # Table creation
│   └── queries.js        # SQL query functions
├── controllers/
│   ├── users.js          # User operations
│   └── posts.js          # Post operations
├── scripts/
│   ├── simple-migrate.js # Migration script
│   ├── simple-seed.js    # Seed script
│   └── test-simple.js    # Test script
└── index.js              # Main server file
```

## Benefits of Simple Backend

✅ **Lightweight** - No heavy ORM dependencies
✅ **Fast** - Direct SQL queries
✅ **Simple** - Easy to understand and debug
✅ **Flexible** - Full control over SQL
✅ **Reliable** - Fewer moving parts
✅ **Maintainable** - Clear, straightforward code

## Database Operations

### Users

- `createUser(userData)` - Create new user
- `findUserByEmail(email)` - Find user by email
- `findUserByGoogleId(googleId)` - Find user by Google ID
- `findUserById(id)` - Find user by ID
- `updateUser(id, updateData)` - Update user
- `deleteUser(id)` - Delete user

### Posts

- `createPost(postData)` - Create new post
- `findPostById(id)` - Find post by ID
- `findPosts(page, limit)` - Get paginated posts
- `countPosts()` - Count total posts
- `findPostsBySearch(query, tags)` - Search posts
- `updatePost(id, updateData)` - Update post
- `deletePost(id)` - Delete post
- `likePost(id, userId)` - Like/unlike post
- `commentPost(id, comment)` - Add comment

## Troubleshooting

### Connection Issues

Make sure all Render environment variables are set:

- `PGHOST`
- `PGPORT`
- `PGDB`
- `PGUSER`
- `PGPASSWORD`

### Migration Issues

```bash
# Check connection first
npm run test:simple

# Then run migration
npm run migrate
```

### Server Issues

```bash
# Check health endpoint
curl http://localhost:5000/health
```

## Next Steps

1. Set up your Render PostgreSQL database
2. Update your `.env` file with Render variables
3. Test the connection: `npm run test:simple`
4. Run migration: `npm run migrate`
5. Seed database: `npm run db:seed`
6. Start server: `npm run dev`

Your simple, lightweight backend is ready! 🎉
