# 🚀 Render PostgreSQL Setup Guide

## Step 1: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com)
2. Sign up/Login to your account
3. Click **"New +"** → **"PostgreSQL"**
4. Configure your database:
   - **Name**: `memories-db` (or your preferred name)
   - **Database**: `memories` (or your preferred name)
   - **User**: `memories_user` (or your preferred username)
   - **Password**: Generate a strong password
   - **Region**: Choose closest to your users
   - **Plan**: Start with **Free** (upgrade later if needed)

## Step 2: Get Database Credentials

After creating the database, Render will provide:

```env
# Primary Database URL (use this)
DATABASE_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name"

# Direct URL (for migrations)
DIRECT_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name"
```

## Step 3: Environment Variables for Your App

### For Backend (.env):

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name?sslmode=require&connection_limit=5&pool_timeout=0"
DIRECT_URL="postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name?sslmode=require&connection_limit=5&pool_timeout=0"

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="dwj5xlqgk"
CLOUDINARY_API_KEY="161773169141762"
CLOUDINARY_API_SECRET="bWgP7t6Afw6moSAWjnXQT8Jscms"

# Supabase (for frontend)
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYXJrcWdhZHFiY2x0a3lqZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg4MTAsImV4cCI6MjA3NDUyNDgxMH0.SH1qn2rtvDX6UEafupXZFDC-hYXcid0iNI8FN0uDHt4"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYXJrcWdhZHFiY2x0a3lqZ2ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk0ODgxMCwiZXhwIjoyMDc0NTI0ODEwfQ.PqMTSS3TtmQRHomCfMLsjVmH0LVS9vRvTYWIj0y5itU"
SUPABASE_URL="https://bqarkqgadqbcltkyjgji.supabase.co"
```

### For Frontend (.env):

```env
# API Configuration
VITE_API_BASE_URL="https://your-backend-app.onrender.com"

# Google OAuth
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

## Step 4: Deploy Your Backend to Render

1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Configure:
   - **Build Command**: `cd server && npm install && npm run db:generate`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all the variables from Step 3

## Step 5: Run Database Migrations

After deployment, run migrations:

```bash
# Connect to your Render database and run migrations
npm run migrate
npm run db:seed
```

## Step 6: Test Your Setup

```bash
# Test database connection
npm run test:optimized

# Test specific connection
npm run test:db
```

## Render PostgreSQL Advantages

✅ **Reliable**: No connection timeouts like Supabase free tier
✅ **Scalable**: Easy to upgrade plans
✅ **Persistent**: Data doesn't get paused
✅ **Fast**: Optimized for production
✅ **SSL**: Built-in SSL support
✅ **Monitoring**: Built-in database monitoring

## Troubleshooting

### Connection Issues:

- Verify DATABASE_URL is correct
- Check if database is running (not paused)
- Ensure SSL mode is set to "require"

### Migration Issues:

- Make sure DIRECT_URL is set correctly
- Check if Prisma can connect to the database
- Verify database permissions

### Performance Issues:

- Monitor connection pool usage
- Consider upgrading to a paid plan
- Optimize queries and indexes
