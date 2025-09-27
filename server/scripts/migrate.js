#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Build DATABASE_URL from Render environment variables
const buildDatabaseUrl = () => {
  const host = process.env.PGHOST;
  const port = process.env.PGPORT;
  const database = process.env.PGDB;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;

  if (!host || !port || !database || !user || !password) {
    throw new Error(
      "Missing required Render PostgreSQL environment variables: PGHOST, PGPORT, PGDB, PGUSER, PGPASSWORD"
    );
  }

  return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require&connection_limit=5&pool_timeout=0`;
};

// Use provided DATABASE_URL or build from Render variables
const databaseUrl = process.env.DATABASE_URL || buildDatabaseUrl();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  console.log("🔄 Starting database migration...");

  try {
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connection established");

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'posts')
    `;

    console.log("📊 Existing tables:", tables);

    // Run Prisma migrations
    console.log("🔄 Running Prisma migrations...");
    const { execSync } = await import("child_process");

    try {
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
      console.log("✅ Prisma migrations completed");
    } catch (error) {
      console.error("❌ Migration failed:", error.message);
      throw error;
    }

    // Generate Prisma client
    console.log("🔄 Generating Prisma client...");
    try {
      execSync("npx prisma generate", { stdio: "inherit" });
      console.log("✅ Prisma client generated");
    } catch (error) {
      console.error("❌ Client generation failed:", error.message);
      throw error;
    }

    // Verify tables
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();

    console.log("📊 Database verification:");
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Posts: ${postCount}`);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
