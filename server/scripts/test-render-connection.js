#!/usr/bin/env node

import { connectionManager } from "../utils/connectionManager.js";
import { prisma } from "../config/database.js";
import sql from "../db.js";

async function testRenderConnection() {
  console.log("🚀 Testing Render PostgreSQL Connection...\n");

  try {
    // Test 1: Environment Variables
    console.log("1️⃣ Checking Environment Variables...");
    const requiredVars = ["DATABASE_URL", "DIRECT_URL"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error(
        "❌ Missing environment variables:",
        missingVars.join(", ")
      );
      console.log("Please set these variables in your .env file");
      return;
    }

    console.log("✅ All required environment variables are set");
    console.log(
      "📋 DATABASE_URL:",
      process.env.DATABASE_URL ? "Set" : "Not set"
    );
    console.log("📋 DIRECT_URL:", process.env.DIRECT_URL ? "Set" : "Not set");

    // Test 2: Health Check
    console.log("\n2️⃣ Testing Health Check...");
    const health = await connectionManager.getHealthStatus();
    console.log("📊 Health Status:", JSON.stringify(health, null, 2));

    // Test 3: Prisma Connection
    console.log("\n3️⃣ Testing Prisma Connection...");
    try {
      const prismaResult = await connectionManager.executePrismaQuery(
        async () => {
          return await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp, version() as pg_version`;
        }
      );
      console.log("✅ Prisma Query Success:", prismaResult[0]);
    } catch (error) {
      console.error("❌ Prisma Query Failed:", error.message);
    }

    // Test 4: Raw SQL Connection
    console.log("\n4️⃣ Testing Raw SQL Connection...");
    try {
      const sqlResult = await connectionManager.executeSqlQuery(async () => {
        return await sql`SELECT 1 as test, NOW() as timestamp, version() as pg_version`;
      });
      console.log("✅ Raw SQL Query Success:", sqlResult[0]);
    } catch (error) {
      console.error("❌ Raw SQL Query Failed:", error.message);
    }

    // Test 5: Database Operations
    console.log("\n5️⃣ Testing Database Operations...");
    try {
      // Test user count
      const userCount = await connectionManager.executePrismaQuery(async () => {
        return await prisma.user.count();
      });
      console.log(`👥 Users in database: ${userCount}`);

      // Test post count
      const postCount = await connectionManager.executePrismaQuery(async () => {
        return await prisma.post.count();
      });
      console.log(`📝 Posts in database: ${postCount}`);

      // Test database info
      const dbInfo = await connectionManager.executePrismaQuery(async () => {
        return await prisma.$queryRaw`
          SELECT 
            current_database() as database_name,
            current_user as current_user,
            inet_server_addr() as server_ip,
            inet_server_port() as server_port
        `;
      });
      console.log("📊 Database Info:", dbInfo[0]);
    } catch (error) {
      console.error("❌ Database Operations Failed:", error.message);
    }

    // Test 6: Connection Stability
    console.log("\n6️⃣ Testing Connection Stability...");
    const stabilityTests = [];
    for (let i = 0; i < 3; i++) {
      try {
        const result = await connectionManager.executePrismaQuery(async () => {
          return await prisma.$queryRaw`SELECT ${i} as test_number, NOW() as timestamp`;
        });
        stabilityTests.push({ test: i, success: true, result: result[0] });
      } catch (error) {
        stabilityTests.push({ test: i, success: false, error: error.message });
      }
    }

    const successCount = stabilityTests.filter((t) => t.success).length;
    console.log(`📈 Stability Test: ${successCount}/3 successful`);

    if (successCount >= 2) {
      console.log("✅ Connection is stable!");
    } else {
      console.log("⚠️ Connection has stability issues");
    }

    // Test 7: Performance Test
    console.log("\n7️⃣ Testing Performance...");
    const startTime = Date.now();
    try {
      await connectionManager.executePrismaQuery(async () => {
        return await prisma.$queryRaw`SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public'`;
      });
      const endTime = Date.now();
      console.log(`⚡ Query execution time: ${endTime - startTime}ms`);
    } catch (error) {
      console.error("❌ Performance test failed:", error.message);
    }

    console.log("\n🎉 Render PostgreSQL Connection Test Complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Run migrations: npm run migrate");
    console.log("2. Seed database: npm run db:seed");
    console.log("3. Start server: npm run dev");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await connectionManager.shutdown();
  }
}

testRenderConnection();
