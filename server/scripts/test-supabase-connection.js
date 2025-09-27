#!/usr/bin/env node

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase connection...\n");

  const databaseUrl = process.env.DATABASE_URL;
  console.log("📋 Database URL:", databaseUrl ? "Set" : "Not set");

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not found in environment variables");
    return;
  }

  // Parse the URL to extract components
  try {
    const url = new URL(databaseUrl);
    console.log("🔗 Host:", url.hostname);
    console.log("🔗 Port:", url.port);
    console.log("🔗 Database:", url.pathname.substring(1));
    console.log("🔗 SSL Mode:", url.searchParams.get("sslmode"));
  } catch (error) {
    console.error("❌ Invalid DATABASE_URL format:", error.message);
    return;
  }

  // Test connection with different configurations
  const configs = [
    {
      name: "Default Configuration",
      options: {},
    },
    {
      name: "With SSL Required",
      options: { ssl: "require" },
    },
    {
      name: "With SSL and Connection Timeout",
      options: {
        ssl: "require",
        connect_timeout: 30,
        max: 1,
      },
    },
  ];

  for (const config of configs) {
    console.log(`\n🧪 Testing: ${config.name}`);

    try {
      const sql = postgres(databaseUrl, config.options);

      // Test basic connection
      const result = await sql`SELECT 1 as test, NOW() as timestamp`;
      console.log("✅ Connection successful:", result[0]);

      // Test database info
      const dbInfo =
        await sql`SELECT current_database(), current_user, version()`;
      console.log("📊 Database info:", dbInfo[0]);

      await sql.end();
      console.log("✅ Test passed!");
      return; // Exit on first successful connection
    } catch (error) {
      console.error("❌ Connection failed:", error.message);

      // Try to get more specific error info
      if (error.code) {
        console.error("   Error code:", error.code);
      }
      if (error.hint) {
        console.error("   Hint:", error.hint);
      }
    }
  }

  console.log("\n❌ All connection attempts failed");
  console.log("\n🔧 Troubleshooting suggestions:");
  console.log("1. Check if your Supabase project is active (not paused)");
  console.log("2. Verify the database URL is correct");
  console.log("3. Check if your IP is whitelisted (if using IP restrictions)");
  console.log(
    "4. Try creating a new Supabase project if this one is inaccessible"
  );
}

testSupabaseConnection().catch(console.error);
