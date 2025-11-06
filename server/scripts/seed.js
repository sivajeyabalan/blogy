#!/usr/bin/env node

import sql from "../database/simple-db.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import "dotenv/config";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await sql`DELETE FROM posts`;
    await sql`DELETE FROM users`;

    // Create test users
    console.log("👥 Creating test users...");
    const hashedPassword = await bcrypt.hash("password123", 12);

    async function uploadToCloudinary(url, folder = "memories/seed") {
      // Try direct upload first (Cloudinary fetching remote URL).
      try {
        const res = await cloudinary.uploader.upload(url, {
          folder,
          timeout: 300000,
        });
        return res.secure_url || url;
      } catch (err) {
        console.warn(
          "⚠️ Cloudinary direct upload failed, will attempt download+upload:",
          err.message
        );
      }

      // If direct upload fails (remote fetch blocked), download the image and upload as base64 data URI.
      try {
        // Use global fetch when available (Node 18+). If not available, attempt dynamic import of 'node-fetch'.
        let fetchFn = global.fetch;
        if (typeof fetchFn !== "function") {
          try {
            const nodeFetch = await import("node-fetch");
            fetchFn = nodeFetch.default || nodeFetch;
          } catch (e) {
            console.warn(
              "⚠️ 'fetch' not available and 'node-fetch' not installed. Skipping download upload."
            );
            return url;
          }
        }

        const resp = await fetchFn(url);
        if (!resp || !resp.ok) {
          throw new Error(`Failed to download image: ${resp && resp.status}`);
        }

        const contentType =
          (resp.headers &&
            (resp.headers.get
              ? resp.headers.get("content-type")
              : resp.headers["content-type"])) ||
          "image/jpeg";
        const arrayBuffer = await resp.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUri = `data:${contentType};base64,${base64}`;

        const res2 = await cloudinary.uploader.upload(dataUri, {
          folder,
          timeout: 300000,
        });
        return res2.secure_url || url;
      } catch (err2) {
        console.warn(
          "⚠️ Download+upload to Cloudinary failed, using original URL:",
          err2.message
        );
        return url;
      }
    }

    const avatar1 = await uploadToCloudinary(
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    );

    const avatar2 = await uploadToCloudinary(
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    );

    const [user1] = await sql`
      INSERT INTO users (name, email, password, image_url)
      VALUES (
        'Sarah Chen',
        'sarah.chen@email.com',
        ${hashedPassword},
        ${avatar1}
      )
      RETURNING id, name
    `;

    const [user2] = await sql`
      INSERT INTO users (name, email, password, image_url)
      VALUES (
        'James Wilson',
        'james.wilson@email.com',
        ${hashedPassword},
        ${avatar2}
      )
      RETURNING id, name
    `;

    console.log("✅ Created test users");

    // Create realistic posts
    console.log("📝 Creating posts...");

    const posts = [
      {
        title: "Sunrise Yoga at the Beach",
        message:
          "Started my day with a peaceful yoga session at Venice Beach. The sound of waves and the morning breeze made it absolutely perfect. Who else loves beach yoga? 🧘‍♀️🌊 #morningroutine #beachyoga #wellness",
        name: user1.name,
        creator: user1.id,
        tags: ["yoga", "beach", "wellness", "morning"],
        selected_file:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        likes: [user2.id],
        comments: ["This looks so peaceful!", "I need to try this!"],
      },
      {
        title: "Weekend Hiking Adventure",
        message:
          "Conquered Mount Rainier this weekend! The view from the top was absolutely breathtaking. 14 miles and 4,000 ft elevation gain - totally worth every step. Remember to always stay hydrated and respect nature! 🏔️ #hiking #adventure",
        name: user2.name,
        creator: user2.id,
        tags: ["hiking", "mountains", "adventure", "nature"],
        selected_file:
          "https://images.unsplash.com/photo-1551632811-561732d1e306",
        likes: [user1.id],
        comments: [
          "Amazing view!",
          "Which trail did you take?",
          "Looking forward to trying this route!",
        ],
      },
      {
        title: "Homemade Sourdough Success!",
        message:
          "After months of practice, finally achieved the perfect sourdough crumb! The secret? Patience and maintaining the right temperature during fermentation. Swipe for the crumb shot! 🍞 #baking #sourdough #homemade",
        name: user1.name,
        creator: user1.id,
        tags: ["baking", "sourdough", "food", "homemade"],
        selected_file:
          "https://images.unsplash.com/photo-1585478259715-4d75bf3b870b",
        likes: [user2.id],
        comments: ["That crust looks perfect!", "Would love your recipe!"],
      },
      {
        title: "Urban Photography",
        message:
          "Captured this moment during golden hour in downtown Seattle. Sometimes the most beautiful scenes are right in our own city. Love how the light plays with the architecture. 📸 #photography #urban #seattle",
        name: user2.name,
        creator: user2.id,
        tags: ["photography", "urban", "seattle", "architecture"],
        selected_file:
          "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
        likes: [],
        comments: ["The lighting is perfect!", "This angle is everything"],
      },
      {
        title: "First Harvest from My Garden",
        message:
          "Can't believe these came from my tiny balcony garden! Fresh tomatoes, basil, and peppers. Nothing beats home-grown vegetables. Starting small but dreaming big! 🌱 #gardening #organic #homegrown",
        name: user1.name,
        creator: user1.id,
        tags: ["gardening", "organic", "food", "sustainable"],
        selected_file:
          "https://images.unsplash.com/photo-1592419044706-39796d40f98c",
        likes: [user2.id],
        comments: ["Those tomatoes look amazing!", "Any tips for beginners?"],
      },
      {
        title: "Weekend Music Session",
        message:
          "Nothing better than jamming with friends on a Sunday afternoon. Music has this amazing way of bringing people together. Working on some new original material! 🎸 #music #jamming #weekend",
        name: user2.name,
        creator: user2.id,
        tags: ["music", "friends", "weekend", "creative"],
        selected_file:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
        likes: [user1.id],
        comments: ["When's the next gig?", "Love the vibe!"],
      },
      {
        title: "Sunset at the Lake",
        message:
          "Found this perfect spot for watching the sunset at Lake Washington. Sometimes you need to take a moment to appreciate the simple things in life. The colors tonight were incredible! 🌅 #sunset #lakewashington #peace",
        name: user1.name,
        creator: user1.id,
        tags: ["sunset", "lake", "nature", "peace"],
        selected_file:
          "https://images.unsplash.com/photo-1494548162494-384bba4ab999",
        likes: [],
        comments: ["Stunning colors!", "Perfect evening spot"],
      },
      {
        title: "First Marathon Complete!",
        message:
          "6 months of training led to this moment. Just completed my first marathon! Not about the time, but about proving to myself that I can do hard things. Thank you to everyone who supported me! 🏃‍♂️ #marathon #running #achievement",
        name: user2.name,
        creator: user2.id,
        tags: ["running", "marathon", "fitness", "achievement"],
        selected_file:
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
        likes: [user1.id],
        comments: ["Congratulations!", "You're inspiring!", "What's next?"],
      },
      {
        title: "Exploring Street Art",
        message:
          "Discovered this amazing mural while exploring the city today. The street art scene here is incredible. Each piece tells a story and adds so much character to the neighborhood. 🎨 #streetart #urban #art",
        name: user1.name,
        creator: user1.id,
        tags: ["art", "streetart", "urban", "culture"],
        selected_file:
          "https://images.unsplash.com/photo-1532930525088-e23a7029fa81",
        likes: [user2.id],
        comments: ["Where is this?", "The colors are amazing!"],
      },
      {
        title: "Cozy Rainy Day",
        message:
          "Perfect rainy day setup: hot coffee, good book, and jazz playing in the background. Sometimes the best adventures happen at home. What's your favorite rainy day activity? ☕📚 #cozy #reading #rainyday",
        name: user2.name,
        creator: user2.id,
        tags: ["cozy", "reading", "coffee", "lifestyle"],
        selected_file:
          "https://images.unsplash.com/photo-1515592302748-6c5ea17e2f0e",
        likes: [user1.id],
        comments: ["This looks so peaceful", "What book are you reading?"],
      },
    ];

    // Upload post images to Cloudinary and insert posts
    for (const post of posts) {
      const uploadedUrl = await uploadToCloudinary(post.selected_file);

      await sql`
        INSERT INTO posts (
          title, message, name, creator, tags, selected_file, likes, comments
        ) VALUES (
          ${post.title},
          ${post.message},
          ${post.name},
          ${post.creator},
          ${post.tags},
          ${uploadedUrl},
          ${post.likes},
          ${post.comments}
        )
      `;
    }

    console.log("✅ Created 10 posts");

    // Verify data
    const [{ count: userCount }] =
      await sql`SELECT COUNT(*) as count FROM users`;
    const [{ count: postCount }] =
      await sql`SELECT COUNT(*) as count FROM posts`;

    console.log("\n📊 Database seeded successfully!");
    console.log(`👥 Users: ${userCount}`);
    console.log(`📝 Posts: ${postCount}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await sql.end();
  }
}

seed();
