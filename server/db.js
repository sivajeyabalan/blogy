import postgres from "postgres";
import "dotenv/config";

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

// Optimized postgres configuration for Render PostgreSQL
const sql = postgres(databaseUrl, {
  // Optimized connection pool settings for Render
  max: process.env.DB_CONNECTION_LIMIT
    ? parseInt(process.env.DB_CONNECTION_LIMIT)
    : 5, // Render allows more connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 30, // Connection timeout in seconds

  // SSL configuration for Render
  ssl: "require",

  // Retry configuration
  max_lifetime: 60 * 30, // 30 minutes (longer for Render)
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
    console.log("✅ Raw SQL connection successful:", {
      test: result[0].test === 1,
      timestamp: result[0].current_time,
    });
    return true;
  } catch (err) {
    console.error("❌ Raw SQL connection failed:", err.message);
    return false;
  }
}

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await sql.end();
    console.log("Raw SQL connection pool closed.");
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
