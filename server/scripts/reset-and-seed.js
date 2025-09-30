#!/usr/bin/env node

import { createUser, createPost } from "../database/queries.js";
import sql from "../database/simple-db.js";
import bcrypt from "bcryptjs";

async function resetAndSeed() {
  console.log(
    "🔄 Starting database reset and seeding with realistic mock data...\n"
  );

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

    // Delete all existing data
    console.log("\n2️⃣ Deleting all existing data...");
    await sql`DELETE FROM posts`;
    await sql`DELETE FROM users`;
    console.log("✅ All existing posts and users deleted");

    // Create realistic mock users
    console.log("\n3️⃣ Creating realistic mock users...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = [
      {
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        password: hashedPassword,
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Marcus Johnson",
        email: "marcus.j@email.com",
        password: hashedPassword,
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Emma Rodriguez",
        email: "emma.rodriguez@email.com",
        password: hashedPassword,
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "David Kim",
        email: "david.kim@email.com",
        password: hashedPassword,
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Lisa Thompson",
        email: "lisa.thompson@email.com",
        password: hashedPassword,
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await createUser(userData);
      createdUsers.push(user);
    }

    console.log(`✅ Created ${createdUsers.length} users`);

    // Create 10 realistic mock posts
    console.log("\n4️⃣ Creating 10 realistic mock posts...");

    const posts = [
      {
        title: "Sunset at Santorini",
        message:
          "Just returned from an incredible trip to Santorini! The sunsets here are absolutely breathtaking. Spent the evening watching the sky turn into a canvas of oranges and pinks. The white buildings against the golden light created the most magical atmosphere. Already planning my next visit! 🌅✨",
        name: "Sarah Chen",
        creator: createdUsers[0].id,
        tags: [
          "travel",
          "santorini",
          "sunset",
          "greece",
          "photography",
          "vacation",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
        likes: [createdUsers[1].id, createdUsers[2].id, createdUsers[3].id],
        comments: [
          "Absolutely stunning! 😍",
          "Santorini is on my bucket list!",
          "The colors are incredible!",
        ],
      },
      {
        title: "Morning Coffee Ritual",
        message:
          "There's something so peaceful about starting the day with a perfectly brewed cup of coffee. Today I tried a new Ethiopian blend and the floral notes are incredible. Coffee isn't just a drink, it's a moment of mindfulness in our busy lives. What's your favorite morning ritual? ☕",
        name: "Marcus Johnson",
        creator: createdUsers[1].id,
        tags: ["coffee", "morning", "mindfulness", "lifestyle", "brewing"],
        selected_file:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
        likes: [createdUsers[0].id, createdUsers[4].id],
        comments: [
          "Love the setup! What grinder do you use?",
          "Coffee is life! ☕",
        ],
      },
      {
        title: "Garden Harvest",
        message:
          "First harvest from my backyard garden! There's something incredibly satisfying about growing your own food. These tomatoes are bursting with flavor that you just can't get from store-bought ones. Gardening has taught me patience and the beauty of nurturing something from seed to harvest. 🌱🍅",
        name: "Emma Rodriguez",
        creator: createdUsers[2].id,
        tags: [
          "gardening",
          "harvest",
          "organic",
          "sustainability",
          "tomatoes",
          "homegrown",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
        likes: [createdUsers[1].id, createdUsers[3].id, createdUsers[4].id],
        comments: [
          "Those tomatoes look amazing!",
          "I'm so jealous of your garden!",
          "Homegrown is always better!",
        ],
      },
      {
        title: "Tech Conference Highlights",
        message:
          "Just wrapped up an amazing three days at TechConf 2024! The keynote on AI and machine learning was mind-blowing. Met so many brilliant developers and learned about cutting-edge technologies that will shape our future. The networking sessions were gold - already planning collaborations with some incredible people! 🚀",
        name: "David Kim",
        creator: createdUsers[3].id,
        tags: [
          "tech",
          "conference",
          "AI",
          "networking",
          "learning",
          "innovation",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
        likes: [createdUsers[0].id, createdUsers[1].id],
        comments: [
          "Wish I could have been there!",
          "What was your favorite session?",
          "The future is here!",
        ],
      },
      {
        title: "Weekend Hiking Adventure",
        message:
          "Spent the weekend exploring the Blue Ridge Mountains. The trail was challenging but the views from the summit were absolutely worth every step. There's something about being in nature that resets your perspective. The fresh air, the quiet, and the sense of accomplishment when you reach the top - it's pure magic! 🏔️",
        name: "Lisa Thompson",
        creator: createdUsers[4].id,
        tags: [
          "hiking",
          "mountains",
          "nature",
          "adventure",
          "weekend",
          "outdoors",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        likes: [createdUsers[0].id, createdUsers[2].id, createdUsers[3].id],
        comments: [
          "Beautiful views!",
          "Which trail did you take?",
          "Nature is the best therapy!",
        ],
      },
      {
        title: "Homemade Pasta Night",
        message:
          "Decided to make fresh pasta from scratch for the first time! It was more work than expected but the taste was incredible. There's something therapeutic about kneading dough and rolling it out by hand. Served it with a simple tomato basil sauce and it was restaurant-quality. Cooking is definitely an art form! 🍝",
        name: "Sarah Chen",
        creator: createdUsers[0].id,
        tags: ["cooking", "pasta", "homemade", "italian", "dinner", "recipe"],
        selected_file:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop",
        likes: [createdUsers[1].id, createdUsers[2].id, createdUsers[4].id],
        comments: [
          "Recipe please!",
          "Looks absolutely delicious!",
          "Fresh pasta is the best!",
        ],
      },
      {
        title: "Art Gallery Opening",
        message:
          "Attended the opening of the new contemporary art exhibition downtown. The pieces were thought-provoking and the conversations with other art lovers were inspiring. Art has this incredible power to make you see the world differently. My favorite piece was an abstract painting that seemed to capture the chaos and beauty of city life. 🎨",
        name: "Marcus Johnson",
        creator: createdUsers[1].id,
        tags: [
          "art",
          "gallery",
          "exhibition",
          "culture",
          "contemporary",
          "inspiration",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
        likes: [createdUsers[0].id, createdUsers[3].id],
        comments: [
          "Which gallery was this?",
          "Art is so important for the soul!",
          "Love contemporary art!",
        ],
      },
      {
        title: "Yoga by the Lake",
        message:
          "Started my morning with sunrise yoga by the lake. The combination of gentle movement, deep breathing, and the peaceful water created such a serene experience. Yoga isn't just about flexibility - it's about finding balance, both physically and mentally. The reflection of the morning sun on the water was the perfect backdrop for meditation. 🧘‍♀️",
        name: "Emma Rodriguez",
        creator: createdUsers[2].id,
        tags: [
          "yoga",
          "meditation",
          "wellness",
          "morning",
          "lake",
          "mindfulness",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1506629905607-3b3b0b0b0b0b?w=800&h=600&fit=crop",
        likes: [createdUsers[0].id, createdUsers[4].id],
        comments: [
          "What a peaceful setting!",
          "Yoga by water is magical!",
          "Namaste! 🙏",
        ],
      },
      {
        title: "Book Club Discussion",
        message:
          "Just finished our monthly book club meeting discussing 'The Seven Husbands of Evelyn Hugo'. The conversation was so engaging - everyone brought such different perspectives! I love how books can spark such meaningful discussions and bring people together. Already excited for next month's pick! 📚",
        name: "David Kim",
        creator: createdUsers[3].id,
        tags: [
          "books",
          "bookclub",
          "reading",
          "discussion",
          "literature",
          "community",
        ],
        selected_file:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
        likes: [createdUsers[1].id, createdUsers[2].id, createdUsers[4].id],
        comments: [
          "That book was amazing!",
          "What's next month's book?",
          "Book clubs are the best!",
        ],
      },
      {
        title: "Street Photography Walk",
        message:
          "Took my camera for a walk through the city streets today. There's something magical about capturing candid moments of daily life. The way light plays on faces, the expressions of people lost in thought, the architecture that tells stories of the past - every corner holds a story waiting to be told. Photography is my way of preserving these fleeting moments. 📸",
        name: "Lisa Thompson",
        creator: createdUsers[4].id,
        tags: ["photography", "street", "candid", "city", "art", "moments"],
        selected_file:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
        likes: [
          createdUsers[0].id,
          createdUsers[1].id,
          createdUsers[2].id,
          createdUsers[3].id,
        ],
        comments: [
          "Love your photography style!",
          "Street photography is so challenging!",
          "Beautiful composition!",
        ],
      },
    ];

    for (const postData of posts) {
      await createPost(postData);
    }

    console.log(`✅ Created ${posts.length} realistic posts`);

    // Verify data
    console.log("\n5️⃣ Verifying data...");
    const { getDatabaseStats } = await import("../database/queries.js");
    const stats = await getDatabaseStats();

    console.log("\n📊 Database reset and seeding completed successfully!");
    console.log(`👥 Users: ${stats.users}`);
    console.log(`📝 Posts: ${stats.posts}`);

    console.log("\n🎉 Realistic mock data created!");
    console.log("\n📋 Sample of created content:");
    console.log("• Travel and lifestyle posts");
    console.log("• Food and cooking experiences");
    console.log("• Technology and professional content");
    console.log("• Art and culture posts");
    console.log("• Wellness and mindfulness content");
    console.log("• Photography and creative posts");

    console.log("\n🚀 Next steps:");
    console.log("1. Start the server: npm run dev");
    console.log("2. Visit the app to see your new realistic content!");
  } catch (error) {
    console.error("❌ Reset and seeding failed:", error);
    process.exit(1);
  }
}

resetAndSeed();
