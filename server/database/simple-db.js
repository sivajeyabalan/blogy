import postgres from "postgres";
import "dotenv/config";

// Use DATABASE_URL from environment (Supabase connection string)
if (!process.env.DATABASE_URL) {
  throw new Error("Missing required DATABASE_URL environment variable");
}

const databaseUrl = process.env.DATABASE_URL;

// Simple postgres connection
const sql = postgres(databaseUrl, {
  // Connection pool settings optimized for Supabase
  max: 3, // Reduced pool size for better stability
  idle_timeout: 0, // Disable idle timeout (Supabase handles this)
  connect_timeout: 30, // Increased connection timeout

  // SSL configuration for Supabase
  ssl: {
    rejectUnauthorized: false,
  },

  // Force IPv4 connections
  host: databaseUrl.match(/[@]([^:]+):/)?.[1], // Extract host from connection string
  prefer_query_mode: "simple",
  connection: {
    options: `-c search_path=public -c statement_timeout=60000`,
  },

  // Retry configuration
  max_lifetime: 60 * 30, // 30 minutes
  retry_delay: 2000, // 2 seconds

  // Transform configuration
  transform: {
    undefined: null, // Transform undefined to null
  },

  // Debug mode
  debug: process.env.NODE_ENV === "development",

  // Additional optimizations
  prepare: true, // Enable prepared statements for better performance
  onnotice: () => {}, // Suppress notices
});

// Connection health check
async function testConnection() {
  try {
    const result = await sql`SELECT 1 AS test, NOW() AS current_time`;
    console.log("✅ Simple DB connection successful:", {
      test: result[0].test === 1,
      timestamp: result[0].current_time,
    });
    return true;
  } catch (err) {
    console.error("❌ Simple DB connection failed:", err.message);
    return false;
  }
}

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await sql.end();
    console.log("Simple DB connection pool closed.");
  } catch (error) {
    console.error("Error closing SQL connection pool:", error);
  }
};

// Handle process termination
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("beforeExit", gracefulShutdown);

// Test connection on startup
testConnection();

export default sql;
export { testConnection };
