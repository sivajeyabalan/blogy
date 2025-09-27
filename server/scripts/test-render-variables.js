#!/usr/bin/env node

import { connectionManager } from "../utils/connectionManager.js";
import { prisma } from "../config/database.js";
import sql from "../db.js";

async function testRenderVariables() {
  console.log("🚀 Testing Render PostgreSQL Variables...\n");

  try {
    // Test 1: Check Render Environment Variables
    console.log("1️⃣ Checking Render Environment Variables...");
    const renderVars = {
      PGHOST: process.env.PGHOST,
      PGPORT: process.env.PGPORT,
      PGDB: process.env.PGDB,
      PGUSER: process.env.PGUSER,
      PGPASSWORD: process.env.PGPASSWORD ? "***hidden***" : undefined,
    };

    console.log("📋 Render Variables Status:");
    Object.entries(renderVars).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? "✅ Set" : "❌ Missing"}`);
    });

    const missingVars = Object.entries(renderVars)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingVars.length > 0) {
      console.error(`❌ Missing required variables: ${missingVars.join(", ")}`);
      console.log(
        "\n🔧 Please set these environment variables in your .env file:"
      );
      console.log("PGHOST=your-render-host");
      console.log("PGPORT=5432");
      console.log("PGDB=your-database-name");
      console.log("PGUSER=your-username");
      console.log("PGPASSWORD=your-password");
      return;
    }

    console.log("✅ All Render variables are set!");

    // Test 2: Build DATABASE_URL
    console.log("\n2️⃣ Building DATABASE_URL from Render variables...");
    const host = process.env.PGHOST;
    const port = process.env.PGPORT;
    const database = process.env.PGDB;
    const user = process.env.PGUSER;
    const password = process.env.PGPASSWORD;

    const builtUrl = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require&connection_limit=5&pool_timeout=0`;
    console.log(
      "📋 Built DATABASE_URL:",
      builtUrl.replace(password, "***hidden***")
    );

    // Test 3: Health Check
    console.log("\n3️⃣ Testing Database Health...");
    const health = await connectionManager.getHealthStatus();
    console.log("📊 Health Status:", JSON.stringify(health, null, 2));

    // Test 4: Prisma Connection
    console.log("\n4️⃣ Testing Prisma Connection...");
    try {
      const prismaResult = await connectionManager.executePrismaQuery(
        async () => {
          return await prisma.$queryRaw`
          SELECT 
            1 as test, 
            NOW() as timestamp, 
            version() as pg_version,
            current_database() as database_name,
            current_user as current_user
        `;
        }
      );
      console.log("✅ Prisma Query Success:", prismaResult[0]);
    } catch (error) {
      console.error("❌ Prisma Query Failed:", error.message);
    }

    // Test 5: Raw SQL Connection
    console.log("\n5️⃣ Testing Raw SQL Connection...");
    try {
      const sqlResult = await connectionManager.executeSqlQuery(async () => {
        return await sql`
          SELECT 
            1 as test, 
            NOW() as timestamp, 
            version() as pg_version,
            current_database() as database_name,
            current_user as current_user
        `;
      });
      console.log("✅ Raw SQL Query Success:", sqlResult[0]);
    } catch (error) {
      console.error("❌ Raw SQL Query Failed:", error.message);
    }

    // Test 6: Database Operations
    console.log("\n6️⃣ Testing Database Operations...");
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
    } catch (error) {
      console.error("❌ Database Operations Failed:", error.message);
    }

    // Test 7: Connection Stability
    console.log("\n7️⃣ Testing Connection Stability...");
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

    console.log("\n🎉 Render PostgreSQL Variables Test Complete!");
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

testRenderVariables();
