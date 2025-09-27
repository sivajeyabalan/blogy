import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function createTables() {
  try {
    console.log("Creating tables...");

    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT,
        "googleId" TEXT,
        "imageUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );
    `;

    // Create posts table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT,
        "message" TEXT,
        "name" TEXT,
        "creator" TEXT NOT NULL,
        "tags" TEXT[],
        "selectedFile" TEXT,
        "likes" TEXT[],
        "comments" TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `;

    console.log("✅ Tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
