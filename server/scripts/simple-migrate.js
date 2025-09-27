#!/usr/bin/env node

import { createTables, checkTables } from "../database/schema.js";
import { testConnection } from "../database/simple-db.js";

async function migrate() {
  console.log("🔄 Starting simple database migration...\n");

  try {
    // Test connection
    console.log("1️⃣ Testing database connection...");
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }

    console.log("✅ Database connection successful");

    // Check existing tables
    console.log("\n2️⃣ Checking existing tables...");
    const existingTables = await checkTables();

    if (existingTables.length > 0) {
      console.log(
        "📊 Found existing tables:",
        existingTables.map((t) => t.table_name)
      );
    }

    // Create tables
    console.log("\n3️⃣ Creating/updating tables...");
    await createTables();

    // Verify tables
    console.log("\n4️⃣ Verifying tables...");
    const finalTables = await checkTables();
    console.log(
      "📊 Final tables:",
      finalTables.map((t) => t.table_name)
    );

    console.log("\n🎉 Simple migration completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Test the connection: npm run test:simple");
    console.log("2. Seed the database: npm run db:seed");
    console.log("3. Start the server: npm run dev");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
