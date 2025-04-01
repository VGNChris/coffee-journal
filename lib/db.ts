import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
  // We'll still continue but operations will fail
}

// Initialize the Neon SQL connection
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : (() => {
      // This is a placeholder function that will throw a helpful error
      // when called if DATABASE_URL is not provided
      return async () => {
        throw new Error(
          "Database connection failed: DATABASE_URL environment variable is not set. " +
            "Please set a valid PostgreSQL connection string in the format: " +
            "postgresql://user:password@host.tld/dbname?option=value",
        )
      }
    })()

// Initialize the database connection
export const db = drizzle(sql)

