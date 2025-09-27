#!/usr/bin/env node

import { testConnection, getDatabaseStats } from "../database/queries.js";
import { checkTables } from "../database/schema.js";

async function testSimple() {
  console.log("🧪 Testing Simple Database Setup...\n");

  try {
    // Test 1: Connection
    console.log("1️⃣ Testing database connection...");
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("❌ Database connection failed");
      return;
    }

    console.log("✅ Database connection successful");

    // Test 2: Check tables
    console.log("\n2️⃣ Checking database tables...");
    const tables = await checkTables();
    console.log(
      "📊 Tables found:",
      tables.map((t) => t.table_name)
    );

    // Test 3: Database stats
    console.log("\n3️⃣ Getting database statistics...");
    const stats = await getDatabaseStats();
    console.log("📊 Database stats:", stats);

    // Test 4: Test queries
    console.log("\n4️⃣ Testing basic queries...");

    // Test user queries
    const { findUserByEmail } = await import("../database/queries.js");
    const testUser = await findUserByEmail("john@example.com");

    if (testUser) {
      console.log("✅ User query successful:", testUser.name);
    } else {
      console.log("ℹ️ No test user found (run seeding first)");
    }

    // Test post queries
    const { findPosts } = await import("../database/queries.js");
    const posts = await findPosts(1, 3);
    console.log(`✅ Post query successful: Found ${posts.length} posts`);

    console.log("\n🎉 Simple database test completed!");
    console.log("\n📋 Database is ready for use!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSimple();
