#!/usr/bin/env node

import { checkDatabaseHealth } from "../utils/database.js";
import { prisma } from "../config/database.js";
import sql from "../db.js";

async function testConnections() {
  console.log("🧪 Testing database connections...\n");

  try {
    // Test Prisma connection
    console.log("1️⃣ Testing Prisma connection...");
    const prismaTest =
      await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
    console.log("✅ Prisma connection successful:", prismaTest[0]);

    // Test raw SQL connection
    console.log("\n2️⃣ Testing raw SQL connection...");
    const sqlTest = await sql`SELECT 1 as test, NOW() as timestamp`;
    console.log("✅ Raw SQL connection successful:", sqlTest[0]);

    // Close the raw SQL connection to avoid conflicts
    await sql.end();

    // Test health check
    console.log("\n3️⃣ Testing health check...");
    const health = await checkDatabaseHealth();
    console.log("📊 Health status:", JSON.stringify(health, null, 2));

    // Test basic queries
    console.log("\n4️⃣ Testing basic queries...");

    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);

    // Count posts
    const postCount = await prisma.post.count();
    console.log(`📝 Posts in database: ${postCount}`);

    // Test a simple join query
    const postsWithUsers = await prisma.post.findMany({
      take: 3,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `📋 Recent posts with user info: ${postsWithUsers.length} found`
    );
    if (postsWithUsers.length > 0) {
      console.log("   Sample post:", {
        id: postsWithUsers[0].id,
        title: postsWithUsers[0].title,
        creator: postsWithUsers[0].user?.name || "Unknown",
      });
    }

    console.log("\n✅ All tests passed! Database is ready.");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    // Clean up connections
    await prisma.$disconnect();
    console.log("\n🔌 Connections closed.");
  }
}

testConnections();
