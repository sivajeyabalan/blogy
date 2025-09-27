#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

async function testPrismaSimple() {
  console.log("🧪 Testing Prisma with minimal configuration...\n");

  // Create a new Prisma client with minimal config
  const prisma = new PrismaClient({
    log: ["error"],
  });

  try {
    console.log("1️⃣ Testing basic connection...");
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
    console.log("✅ Prisma connection successful:", result[0]);

    console.log("\n2️⃣ Testing table access...");
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);

    const postCount = await prisma.post.count();
    console.log(`📝 Posts in database: ${postCount}`);

    console.log("\n✅ All Prisma tests passed!");
  } catch (error) {
    console.error("❌ Prisma test failed:", error.message);

    if (error.code) {
      console.error("   Error code:", error.code);
    }

    // Try to get more details about the connection
    console.log("\n🔍 Debugging information:");
    console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length);
    console.log(
      "DATABASE_URL starts with:",
      process.env.DATABASE_URL?.substring(0, 20)
    );
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaSimple().catch(console.error);
