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

    // Verificar se as tabelas existem
    const tablesExist = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'coffees'
      ) as has_coffees,
      EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'brews'
      ) as has_brews;
    `

    const { has_coffees, has_brews } = tablesExist[0]

    if (!has_coffees) {
      // Create coffees table if not exists
      await sql`
        CREATE TABLE coffees (
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
      console.log("Tabela coffees criada com sucesso")
    }

    if (!has_brews) {
      // Create brews table if not exists
      await sql`
        CREATE TABLE brews (
          id SERIAL PRIMARY KEY,
          coffee_id INTEGER NOT NULL REFERENCES coffees(id),
          brewing_method TEXT NOT NULL,
          dose DECIMAL(5,2) NOT NULL,
          water_amount INTEGER NOT NULL,
          ratio TEXT NOT NULL,
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
      console.log("Tabela brews criada com sucesso")
    }

    // Verificar a estrutura das tabelas
    const tableInfo = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('coffees', 'brews')
      ORDER BY table_name, ordinal_position;
    `

    return NextResponse.json({
      success: true,
      message: "Database check completed successfully",
      tablesCreated: {
        coffees: !has_coffees,
        brews: !has_brews
      },
      structure: tableInfo
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

