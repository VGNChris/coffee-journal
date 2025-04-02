import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Consulta para verificar a estrutura da tabela
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'brews';
    `

    // Consulta para verificar os dados
    const brewsData = await sql`
      SELECT *
      FROM brews
      ORDER BY created_at DESC
      LIMIT 5;
    `

    return NextResponse.json({
      success: true,
      tableStructure: tableInfo,
      recentBrews: brewsData,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

