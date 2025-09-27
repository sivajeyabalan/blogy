#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function testComment() {
  console.log("🧪 Testing comment functionality...\n");

  try {
    // Test creating a post with comments
    console.log("1️⃣ Creating a test post...");
    const testPost = await prisma.post.create({
      data: {
        title: "Test Post for Comments",
        message: "This is a test post to verify comment functionality",
        name: "Test User",
        creator: "test-user-id",
        tags: ["test", "comments"],
        likes: [],
        comments: ["Initial comment: This is a test comment"],
      },
    });

    console.log("✅ Test post created:", {
      id: testPost.id,
      title: testPost.title,
      comments: testPost.comments,
    });

    // Test adding a comment
    console.log("\n2️⃣ Adding a comment...");
    const comments = testPost.comments || [];
    comments.push("New comment: This is another test comment");

    const updatedPost = await prisma.post.update({
      where: { id: testPost.id },
      data: { comments },
    });

    console.log("✅ Comment added:", {
      id: updatedPost.id,
      comments: updatedPost.comments,
    });

    // Test fetching the post
    console.log("\n3️⃣ Fetching post with comments...");
    const fetchedPost = await prisma.post.findUnique({
      where: { id: testPost.id },
    });

    console.log("✅ Post fetched:", {
      id: fetchedPost.id,
      comments: fetchedPost.comments,
      commentsLength: fetchedPost.comments?.length || 0,
    });

    // Clean up
    console.log("\n4️⃣ Cleaning up...");
    await prisma.post.delete({
      where: { id: testPost.id },
    });

    console.log("✅ Test post deleted");
    console.log("\n🎉 Comment functionality test passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testComment();
