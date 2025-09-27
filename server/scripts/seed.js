#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Build DATABASE_URL from Render environment variables
const buildDatabaseUrl = () => {
  const host = process.env.PGHOST;
  const port = process.env.PGPORT;
  const database = process.env.PGDB;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;

  if (!host || !port || !database || !user || !password) {
    throw new Error(
      "Missing required Render PostgreSQL environment variables: PGHOST, PGPORT, PGDB, PGUSER, PGPASSWORD"
    );
  }

  return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require&connection_limit=5&pool_timeout=0`;
};

// Use provided DATABASE_URL or build from Render variables
const databaseUrl = process.env.DATABASE_URL || buildDatabaseUrl();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create test users
    console.log("👥 Creating test users...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    const user1 = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        imageUrl: "https://via.placeholder.com/150",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        imageUrl: "https://via.placeholder.com/150",
      },
    });

    const user3 = await prisma.user.create({
      data: {
        name: "Google User",
        email: "google@example.com",
        googleId: "google_123456789",
        imageUrl: "https://via.placeholder.com/150",
        password: "google_123456789",
      },
    });

    console.log(`✅ Created ${3} users`);

    // Create test posts
    console.log("📝 Creating test posts...");

    const posts = [
      {
        title: "My First Memory",
        message: "This is my first post on the Memories app!",
        name: "John Doe",
        creator: user1.id,
        tags: ["first", "memory", "test"],
        selectedFile: "https://via.placeholder.com/400x300",
        likes: [user2.id],
        comments: ["Great first post!", "Welcome to the app!"],
      },
      {
        title: "Beautiful Sunset",
        message:
          "Captured this amazing sunset during my vacation. Nature never fails to amaze me!",
        name: "Jane Smith",
        creator: user2.id,
        tags: ["sunset", "nature", "vacation", "photography"],
        selectedFile: "https://via.placeholder.com/400x300",
        likes: [user1.id, user3.id],
        comments: ["Stunning!", "Where was this taken?"],
      },
      {
        title: "Tech Conference 2024",
        message:
          "Just attended an amazing tech conference. Learned so much about the latest technologies!",
        name: "Google User",
        creator: user3.id,
        tags: ["tech", "conference", "learning", "2024"],
        selectedFile: "https://via.placeholder.com/400x300",
        likes: [],
        comments: ["What was your favorite talk?"],
      },
      {
        title: "Cooking Adventure",
        message:
          "Tried making homemade pasta for the first time. It was harder than expected but totally worth it!",
        name: "John Doe",
        creator: user1.id,
        tags: ["cooking", "pasta", "homemade", "adventure"],
        selectedFile: "https://via.placeholder.com/400x300",
        likes: [user2.id],
        comments: ["Recipe please!", "Looks delicious!"],
      },
      {
        title: "Weekend Hiking",
        message:
          "Spent the weekend hiking in the mountains. The fresh air and beautiful views were exactly what I needed.",
        name: "Jane Smith",
        creator: user2.id,
        tags: ["hiking", "mountains", "weekend", "nature"],
        selectedFile: "https://via.placeholder.com/400x300",
        likes: [user1.id, user3.id],
        comments: ["Which trail did you take?", "Amazing views!"],
      },
    ];

    for (const postData of posts) {
      await prisma.post.create({
        data: postData,
      });
    }

    console.log(`✅ Created ${posts.length} posts`);

    // Verify data
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();

    console.log("\n📊 Database seeded successfully!");
    console.log(`👥 Users: ${userCount}`);
    console.log(`📝 Posts: ${postCount}`);

    // Show sample data
    const samplePosts = await prisma.post.findMany({
      take: 2,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("\n📋 Sample posts:");
    samplePosts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" by ${post.user.name}`);
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
