import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set. Please set a valid PostgreSQL connection string.",
        },
        { status: 500 },
      )
    }

    // Create coffees table
    await sql`
      CREATE TABLE IF NOT EXISTS coffees (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        sensory_profile TEXT NOT NULL,
        region TEXT NOT NULL,
        producer TEXT NOT NULL,
        variety TEXT NOT NULL,
        process TEXT NOT NULL,
        altitude TEXT NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `

    // Create brews table
    await sql`
      CREATE TABLE IF NOT EXISTS brews (
        id SERIAL PRIMARY KEY,
        coffee_id INTEGER NOT NULL REFERENCES coffees(id),
        brewing_method TEXT NOT NULL,
        water_temperature INTEGER NOT NULL,
        grinder_setting INTEGER NOT NULL,
        extraction_time INTEGER NOT NULL,
        acidity INTEGER NOT NULL,
        sweetness INTEGER NOT NULL,
        body INTEGER NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0,
        brew_date DATE NOT NULL DEFAULT CURRENT_DATE,
        brew_time TIME NOT NULL DEFAULT CURRENT_TIME,
        notes TEXT,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

