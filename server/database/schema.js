import sql from "./simple-db.js";

/**
 * Database Schema Setup
 * Creates tables and indexes for the Memories application
 */

export async function createTables() {
  console.log("🔄 Creating database tables...");

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("✅ Users table created");

    // Create posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
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
      )
    `;
    console.log("✅ Posts table created");

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags)`;

    console.log("✅ Indexes created");

    // Create updated_at trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Create triggers for updated_at
    await sql`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      CREATE TRIGGER update_posts_updated_at 
      BEFORE UPDATE ON posts 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log("✅ Triggers created");

    console.log("🎉 Database schema setup complete!");
    return true;
  } catch (error) {
    console.error("❌ Error creating database schema:", error);
    throw error;
  }
}

export async function dropTables() {
  console.log("🗑️ Dropping database tables...");

  try {
    await sql`DROP TABLE IF EXISTS posts CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    await sql`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE`;

    console.log("✅ Tables dropped");
    return true;
  } catch (error) {
    console.error("❌ Error dropping tables:", error);
    throw error;
  }
}

export async function checkTables() {
  console.log("🔍 Checking database tables...");

  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'posts')
    `;

    console.log("📊 Existing tables:", tables);
    return tables;
  } catch (error) {
    console.error("❌ Error checking tables:", error);
    throw error;
  }
}
