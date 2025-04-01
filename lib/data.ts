import type { Coffee, Brew } from "./types"
import { sql } from "@/lib/db"

export async function getCoffees(): Promise<Coffee[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return []
    }
    const result = await sql`
      SELECT 
        id, 
        name, 
        sensory_profile as "sensoryProfile", 
        region, 
        producer, 
        variety, 
        process, 
        altitude, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM coffees
      ORDER BY created_at DESC
    `
    console.log("Cafés recuperados:", result)
    return result
  } catch (error) {
    console.error("Database Error:", error)
    return []
  }
}

export async function getCoffeeById(id: number): Promise<Coffee | null> {
  try {
    const coffees = await sql`
      SELECT 
        id, 
        name, 
        sensory_profile as "sensoryProfile", 
        region, 
        producer, 
        variety, 
        process, 
        altitude, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM coffees
      WHERE id = ${id}
    `

    if (coffees.length > 0) {
      console.log("Café recuperado do banco de dados:", coffees[0])
    }
    return coffees.length > 0 ? coffees[0] : null
  } catch (error) {
    console.error("Database Error:", error)
    return null
  }
}

export async function getBrews(): Promise<Brew[]> {
  try {
    const brews = await sql`
      SELECT 
        b.id, 
        b.brewing_method as "brewingMethod", 
        b.water_temperature as "waterTemperature", 
        b.grinder_setting as "grinderSetting", 
        b.extraction_time as "extractionTime", 
        b.acidity, 
        b.sweetness, 
        b.body, 
        b.created_at as "createdAt", 
        b.updated_at as "updatedAt",
        c.id as "coffee.id", 
        c.name as "coffee.name", 
        c.sensory_profile as "coffee.sensoryProfile", 
        c.region as "coffee.region", 
        c.producer as "coffee.producer", 
        c.variety as "coffee.variety", 
        c.process as "coffee.process", 
        c.altitude as "coffee.altitude",
        c.created_at as "coffee.createdAt",
        c.updated_at as "coffee.updatedAt"
      FROM brews b
      JOIN coffees c ON b.coffee_id = c.id
      ORDER BY b.created_at DESC
    `

    return brews.map((brew) => ({
      ...brew,
      coffee: {
        id: brew["coffee.id"],
        name: brew["coffee.name"],
        sensoryProfile: brew["coffee.sensoryProfile"],
        region: brew["coffee.region"],
        producer: brew["coffee.producer"],
        variety: brew["coffee.variety"],
        process: brew["coffee.process"],
        altitude: brew["coffee.altitude"],
        createdAt: brew["coffee.createdAt"],
        updatedAt: brew["coffee.updatedAt"],
      },
    }))
  } catch (error) {
    console.error("Database Error:", error)
    return []
  }
}

export async function getBrewById(id: number): Promise<Brew | null> {
  try {
    const brews = await sql`
      SELECT 
        b.id, 
        b.brewing_method as "brewingMethod", 
        b.water_temperature as "waterTemperature", 
        b.grinder_setting as "grinderSetting", 
        b.extraction_time as "extractionTime", 
        b.acidity, 
        b.sweetness, 
        b.body, 
        b.created_at as "createdAt", 
        b.updated_at as "updatedAt",
        c.id as "coffee.id", 
        c.name as "coffee.name", 
        c.sensory_profile as "coffee.sensoryProfile", 
        c.region as "coffee.region", 
        c.producer as "coffee.producer", 
        c.variety as "coffee.variety", 
        c.process as "coffee.process", 
        c.altitude as "coffee.altitude",
        c.created_at as "coffee.createdAt",
        c.updated_at as "coffee.updatedAt"
      FROM brews b
      JOIN coffees c ON b.coffee_id = c.id
      WHERE b.id = ${id}
    `

    if (brews.length === 0) {
      return null
    }

    const brew = brews[0]
    return {
      ...brew,
      coffee: {
        id: brew["coffee.id"],
        name: brew["coffee.name"],
        sensoryProfile: brew["coffee.sensoryProfile"],
        region: brew["coffee.region"],
        producer: brew["coffee.producer"],
        variety: brew["coffee.variety"],
        process: brew["coffee.process"],
        altitude: brew["coffee.altitude"],
        createdAt: brew["coffee.createdAt"],
        updatedAt: brew["coffee.updatedAt"],
      },
    }
  } catch (error) {
    console.error("Database Error:", error)
    return null
  }
}

