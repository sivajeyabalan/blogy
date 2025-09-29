#!/usr/bin/env node

import { createUser, createPost } from "../database/queries.js";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting simple database seeding...\n");

  try {
    // Test connection
    console.log("1️⃣ Testing database connection...");
    const { testConnection } = await import("../database/simple-db.js");
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }

    console.log("✅ Database connection successful");

    // Create test users
    console.log("\n2️⃣ Creating test users...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    const user1 = await createUser({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      imageUrl: "https://picsum.photos/150/150?random=1",
    });

    const user2 = await createUser({
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      imageUrl: "https://picsum.photos/150/150?random=1",
    });

    const user3 = await createUser({
      name: "Google User",
      email: "google@example.com",
      googleId: "google_123456789",
      imageUrl: "https://picsum.photos/150/150?random=1",
      password: "google_123456789",
    });

    console.log(`✅ Created ${3} users`);

    // Create test posts
    console.log("\n3️⃣ Creating test posts...");

    const posts = [
      {
        title: "My First Memory",
        message: "This is my first post on the Memories app!",
        name: "John Doe",
        creator: user1.id,
        tags: ["first", "memory", "test"],
        selectedFile: "https://picsum.photos/400/300?random=1",
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
        selectedFile: "https://picsum.photos/400/300?random=1",
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
        selectedFile: "https://picsum.photos/400/300?random=1",
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
        selectedFile: "https://picsum.photos/400/300?random=1",
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
        selectedFile: "https://picsum.photos/400/300?random=1",
        likes: [user1.id, user3.id],
        comments: ["Which trail did you take?", "Amazing views!"],
      },
    ];

    for (const postData of posts) {
      await createPost(postData);
    }

    console.log(`✅ Created ${posts.length} posts`);

    // Verify data
    console.log("\n4️⃣ Verifying data...");
    const { getDatabaseStats } = await import("../database/queries.js");
    const stats = await getDatabaseStats();

    console.log("\n📊 Database seeded successfully!");
    console.log(`👥 Users: ${stats.users}`);
    console.log(`📝 Posts: ${stats.posts}`);

    console.log("\n🎉 Simple seeding completed!");
    console.log("\n📋 Next steps:");
    console.log("1. Test the connection: npm run test:simple");
    console.log("2. Start the server: npm run dev");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
