#!/usr/bin/env node

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

async function testSupabaseStatus() {
  console.log("🔍 Testing Supabase Database Status...\n");

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

  // Test different connection configurations
  const configs = [
    {
      name: "Minimal Configuration",
      options: { ssl: "require", max: 1, connect_timeout: 10 },
    },
    {
      name: "With Connection Pool",
      options: {
        ssl: "require",
        max: 1,
        connect_timeout: 30,
        idle_timeout: 10,
        prepare: false,
      },
    },
    {
      name: "With Retry Logic",
      options: {
        ssl: "require",
        max: 1,
        connect_timeout: 30,
        retry_delay: 2000,
        max_lifetime: 60 * 5,
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
      if (error.severity) {
        console.error("   Severity:", error.severity);
      }
    }
  }

  console.log("\n❌ All connection attempts failed");
  console.log("\n🔧 Troubleshooting suggestions:");
  console.log(
    "1. Check if your Supabase project is paused (common with free tier)"
  );
  console.log("2. Verify the database URL is correct in your .env file");
  console.log("3. Check if your IP is whitelisted (if using IP restrictions)");
  console.log(
    "4. Try creating a new Supabase project if this one is inaccessible"
  );
  console.log("5. Check your internet connection");
  console.log("6. Verify your Supabase account is active");
}

testSupabaseStatus().catch(console.error);
