# 🚀 Complete Render PostgreSQL Setup Guide

## Overview

This guide will help you completely migrate from Supabase to Render PostgreSQL using the provided Render environment variables.

## Render Environment Variables

Render provides these variables for PostgreSQL:

- `PGHOST` - Database host
- `PGPORT` - Database port (usually 5432)
- `PGDB` - Database name
- `PGUSER` - Database username
- `PGPASSWORD` - Database password

## Step 1: Set Up Your .env File

Create/update your `.env` file with these variables:

```env
# ===========================================
# RENDER POSTGRESQL VARIABLES
# ===========================================

# Render PostgreSQL Database Variables (provided by Render)
PGHOST="dpg-xxxxx-a.oregon-postgres.render.com"
PGPORT="5432"
PGDB="your_database_name"
PGUSER="your_username"
PGPASSWORD="your_password"

# Alternative: Use DATABASE_URL if provided by Render
# DATABASE_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name?sslmode=require"

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration (generate a strong secret)
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# ===========================================
# CLOUDINARY CONFIGURATION
# ===========================================

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME="dwj5xlqgk"
CLOUDINARY_API_KEY="161773169141762"
CLOUDINARY_API_SECRET="bWgP7t6Afw6moSAWjnXQT8Jscms"

# ===========================================
# RENDER SPECIFIC CONFIGURATION
# ===========================================

# Render Environment
RENDER=true
RENDER_EXTERNAL_URL="https://your-app-name.onrender.com"

# Database Connection Pool Settings (optimized for Render)
DB_CONNECTION_LIMIT=5
DB_POOL_TIMEOUT=0
DB_CONNECT_TIMEOUT=30000
DB_QUERY_TIMEOUT=30000

# Retry Configuration
DB_RETRY_ATTEMPTS=3
DB_RETRY_DELAY=2000
DB_HEALTH_CHECK_INTERVAL=30000
```

## Step 2: Test Your Configuration

Test that all Render variables are working:

```bash
npm run test:render-vars
```

This will:

- ✅ Check all required environment variables
- ✅ Build DATABASE_URL from Render variables
- ✅ Test Prisma connection
- ✅ Test Raw SQL connection
- ✅ Test database operations
- ✅ Test connection stability

## Step 3: Run Database Migrations

After confirming the connection works:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run migrate

# Seed the database (optional)
npm run db:seed
```

## Step 4: Start Your Application

```bash
# Development
npm run dev

# Production
npm start
```

## Step 5: Deploy to Render

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**
   - **Build Command**: `cd server && npm install && npm run db:generate`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all variables from your `.env` file

## Key Changes Made

### ✅ **Removed Supabase Dependencies:**

- Removed `DIRECT_URL` from Prisma schema
- Updated all database configurations to use Render variables
- Removed Supabase-specific connection settings

### ✅ **Added Render Support:**

- Automatic DATABASE_URL building from Render variables
- Optimized connection pooling for Render
- Render-specific error handling
- Environment variable validation

### ✅ **Updated Scripts:**

- Migration script now uses Render variables
- Seed script now uses Render variables
- Test scripts for Render configuration
- Health checks for Render database

## Troubleshooting

### Connection Issues:

```bash
# Test Render variables
npm run test:render-vars

# Test general connection
npm run test:render
```

### Migration Issues:

```bash
# Generate Prisma client first
npm run db:generate

# Then run migrations
npm run migrate
```

### Environment Variable Issues:

Make sure all required variables are set:

- `PGHOST`
- `PGPORT`
- `PGDB`
- `PGUSER`
- `PGPASSWORD`

## Benefits of Render PostgreSQL

✅ **No Connection Timeouts** - Unlike Supabase free tier
✅ **Reliable** - 99.9% uptime guarantee
✅ **Scalable** - Easy to upgrade plans
✅ **Fast** - Optimized for production
✅ **SSL Built-in** - Secure connections
✅ **Monitoring** - Built-in database monitoring
✅ **No Pausing** - Unlike Supabase free tier

## Next Steps

1. Set up your Render PostgreSQL database
2. Update your `.env` file with Render variables
3. Test the connection: `npm run test:render-vars`
4. Run migrations: `npm run migrate`
5. Deploy to Render!

Your application is now fully configured for Render PostgreSQL! 🎉
