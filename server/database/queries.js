import sql from "./simple-db.js";

/**
 * Simple Database Query Functions
 * Direct SQL queries for all database operations
 */

// ===========================================
// USER QUERIES
// ===========================================

export async function createUser(userData) {
  const { name, email, password, googleId, imageUrl } = userData;

  const [user] = await sql`
    INSERT INTO users (name, email, password, google_id, image_url)
    VALUES (${name}, ${email}, ${password}, ${googleId}, ${imageUrl})
    RETURNING *
  `;

  return user;
}

export async function findUserByEmail(email) {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  return user;
}

export async function findUserByGoogleId(googleId) {
  const [user] = await sql`
    SELECT * FROM users WHERE google_id = ${googleId}
  `;

  return user;
}

export async function findUserById(id) {
  const [user] = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;

  return user;
}

export async function updateUser(id, updateData) {
  const fields = [];
  const values = [];

  // Map camelCase to snake_case for database columns
  const fieldMapping = {
    googleId: "google_id",
    imageUrl: "image_url",
    // Add other mappings as needed
  };

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      const dbColumn = fieldMapping[key] || key;
      fields.push(`${dbColumn} = $${values.length + 1}`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  // Add the id parameter at the end
  values.push(id);

  const [user] = await sql.unsafe(
    `
    UPDATE users 
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `,
    values
  );

  return user;
}

export async function deleteUser(id) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  return true;
}

// ===========================================
// POST QUERIES
// ===========================================

export async function createPost(postData) {
  const {
    title,
    message,
    name,
    creator,
    tags,
    selected_file,
    likes,
    comments,
  } = postData;

  const [post] = await sql`
    INSERT INTO posts (title, message, name, creator, tags, selected_file, likes, comments)
    VALUES (${title}, ${message}, ${name}, ${creator}, ${tags}, ${selected_file}, ${likes}, ${comments})
    RETURNING *
  `;

  // Map snake_case to camelCase for client
  if (post) {
    post.selectedFile = post.selected_file;
    delete post.selected_file;
  }

  return post;
}

export async function findPostById(id) {
  const [post] = await sql`
    SELECT p.*, u.name as user_name, u.image_url as user_image_url
    FROM posts p
    LEFT JOIN users u ON p.creator = u.id
    WHERE p.id = ${id}
  `;

  // Map snake_case to camelCase for client
  if (post) {
    post.selectedFile = post.selected_file;
    delete post.selected_file;
  }

  return post;
}

export async function findPosts(page = 1, limit = 9) {
  const offset = (page - 1) * limit;

  const posts = await sql`
    SELECT p.*, u.name as user_name, u.image_url as user_image_url
    FROM posts p
    LEFT JOIN users u ON p.creator = u.id
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  // Map snake_case to camelCase for client
  return posts.map((post) => {
    if (post) {
      post.selectedFile = post.selected_file;
      delete post.selected_file;
    }
    return post;
  });
}

export async function countPosts() {
  const [{ count }] = await sql`SELECT COUNT(*) as count FROM posts`;
  return parseInt(count);
}

export async function findPostsBySearch(searchQuery, tags) {
  let whereClause = "1=1";
  const values = [];

  if (searchQuery && searchQuery.trim()) {
    whereClause += ` AND (p.title ILIKE $${
      values.length + 1
    } OR p.message ILIKE $${values.length + 1})`;
    values.push(`%${searchQuery.trim()}%`);
  }

  if (tags && tags.length > 0) {
    // Convert tags array to PostgreSQL array format and use overlap operator
    whereClause += ` AND p.tags && $${values.length + 1}::text[]`;
    values.push(tags);
  }

  // Use sql.unsafe with the values array to properly pass parameters
  const posts = await sql.unsafe(
    `
    SELECT p.*, u.name as user_name, u.image_url as user_image_url
    FROM posts p
    LEFT JOIN users u ON p.creator = u.id
    WHERE ${whereClause}
    ORDER BY p.created_at DESC
  `,
    values
  );

  // Map snake_case to camelCase for client
  return posts.map((post) => {
    if (post) {
      post.selectedFile = post.selected_file;
      delete post.selected_file;
    }
    return post;
  });
}

export async function updatePost(id, updateData) {
  // Validate ID
  if (!id || id === "null" || id === "undefined") {
    throw new Error("Invalid post ID provided for update");
  }

  console.log("🔍 updatePost database - id:", id, "type:", typeof id);

  const fields = [];
  const values = [];

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${values.length + 1}`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  // Use sql.unsafe with the values array to properly pass parameters
  const [post] = await sql.unsafe(
    `
    UPDATE posts 
    SET ${fields.join(", ")}
    WHERE id = $${values.length + 1}
    RETURNING *
  `,
    [...values, id]
  );

  // Map snake_case to camelCase for client
  if (post) {
    post.selectedFile = post.selected_file;
    delete post.selected_file;
  }

  return post;
}

export async function deletePost(id) {
  await sql`DELETE FROM posts WHERE id = ${id}`;
  return true;
}

export async function likePost(id, userId) {
  console.log("🟣 likePost query called", { id, userId });

  // Get current likes
  const [post] = await sql`SELECT likes FROM posts WHERE id = ${id}`;
  console.log("🟣 Current post data:", post);

  if (!post) {
    console.log("🟣 Post not found");
    throw new Error("Post not found");
  }

  const currentLikes = post.likes || [];
  const isLiked = currentLikes.includes(userId);
  console.log("🟣 Current likes:", { currentLikes, isLiked });

  let newLikes;
  if (isLiked) {
    newLikes = currentLikes.filter((like) => like !== userId);
    console.log("🟣 Removing like, new likes:", newLikes);
  } else {
    newLikes = [...currentLikes, userId];
    console.log("🟣 Adding like, new likes:", newLikes);
  }

  const [updatedPost] = await sql`
    UPDATE posts 
    SET likes = ${newLikes}
    WHERE id = ${id}
    RETURNING *
  `;
  console.log("🟣 Updated post:", updatedPost);

  // Map snake_case to camelCase for client
  if (updatedPost) {
    updatedPost.selectedFile = updatedPost.selected_file;
    delete updatedPost.selected_file;
  }

  return updatedPost;
}

export async function commentPost(id, comment) {
  // Get current comments
  const [post] = await sql`SELECT comments FROM posts WHERE id = ${id}`;

  if (!post) {
    throw new Error("Post not found");
  }

  const currentComments = post.comments || [];
  const newComments = [...currentComments, comment];

  const [updatedPost] = await sql`
    UPDATE posts 
    SET comments = ${newComments}
    WHERE id = ${id}
    RETURNING *
  `;

  return updatedPost;
}

// ===========================================
// UTILITY QUERIES
// ===========================================

export async function getDatabaseStats() {
  const [userCount] = await sql`SELECT COUNT(*) as count FROM users`;
  const [postCount] = await sql`SELECT COUNT(*) as count FROM posts`;

  return {
    users: parseInt(userCount.count),
    posts: parseInt(postCount.count),
  };
}

export async function testConnection() {
  const [result] = await sql`SELECT 1 as test, NOW() as timestamp`;
  return result;
}
