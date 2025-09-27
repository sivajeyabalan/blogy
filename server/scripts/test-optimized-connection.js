#!/usr/bin/env node

import { connectionManager } from "../utils/connectionManager.js";
import { prisma } from "../config/database.js";
import sql from "../db.js";

async function testOptimizedConnection() {
  console.log("🚀 Testing Optimized Database Connection...\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing Health Check...");
    const health = await connectionManager.getHealthStatus();
    console.log("📊 Health Status:", JSON.stringify(health, null, 2));

    // Test 2: Prisma Connection with Retry
    console.log("\n2️⃣ Testing Prisma with Retry Logic...");
    try {
      const prismaResult = await connectionManager.executePrismaQuery(
        async () => {
          return await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
        }
      );
      console.log("✅ Prisma Query Success:", prismaResult[0]);
    } catch (error) {
      console.error("❌ Prisma Query Failed:", error.message);
    }

    // Test 3: Raw SQL Connection with Retry
    console.log("\n3️⃣ Testing Raw SQL with Retry Logic...");
    try {
      const sqlResult = await connectionManager.executeSqlQuery(async () => {
        return await sql`SELECT 1 as test, NOW() as timestamp`;
      });
      console.log("✅ Raw SQL Query Success:", sqlResult[0]);
    } catch (error) {
      console.error("❌ Raw SQL Query Failed:", error.message);
    }

    // Test 4: Database Operations
    console.log("\n4️⃣ Testing Database Operations...");
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

    // Test 5: Connection Stability
    console.log("\n5️⃣ Testing Connection Stability...");
    const stabilityTests = [];
    for (let i = 0; i < 5; i++) {
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
    console.log(`📈 Stability Test: ${successCount}/5 successful`);

    if (successCount >= 4) {
      console.log("✅ Connection is stable!");
    } else {
      console.log("⚠️ Connection has stability issues");
    }

    console.log("\n🎉 Optimized Connection Test Complete!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await connectionManager.shutdown();
  }
}

testOptimizedConnection();
