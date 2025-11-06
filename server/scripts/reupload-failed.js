import sql from "../database/simple-db.js";
import cloudinary from "../config/cloudinary.js";

async function uploadToCloudinary(url, folder = "memories/seed") {
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

  try {
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

async function main() {
  console.log("🔁 Reuploading failed images and updating posts...");

  // Find posts with the problematic Unsplash IDs
  const rows = await sql`
    SELECT id, title, selected_file
    FROM posts
    WHERE selected_file LIKE '%1585478259715%' OR selected_file LIKE '%1532930525088%'
  `;

  if (!rows || rows.length === 0) {
    console.log("No posts found with the failing image URLs.");
    await sql.end();
    return;
  }

  console.log(`Found ${rows.length} posts to fix`);

  // Map each problematic post to a replacement image (picsum)
  for (const r of rows) {
    console.log(`Processing post: ${r.title} (${r.id})`);
    const replacement = r.selected_file.includes("1585478259715")
      ? "https://picsum.photos/id/237/800/600"
      : "https://picsum.photos/id/238/800/600";

    const uploaded = await uploadToCloudinary(replacement);
    if (uploaded) {
      await sql`
        UPDATE posts SET selected_file = ${uploaded} WHERE id = ${r.id}
      `;
      console.log(`Updated post ${r.id} -> ${uploaded}`);
    } else {
      console.warn(`Failed to upload replacement for ${r.id}`);
    }
  }

  console.log("✅ Reupload complete");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
