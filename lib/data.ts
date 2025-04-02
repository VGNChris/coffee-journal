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
        c.id, 
        c.name, 
        c.sensory_profile as "sensoryProfile", 
        c.region, 
        c.producer, 
        c.variety, 
        c.process, 
        c.altitude,
        c.rating,
        c.created_at as "createdAt", 
        c.updated_at as "updatedAt"
      FROM coffees c
      ORDER BY c.created_at DESC
    `
    console.log("Cafés recuperados:", result)
    return result.map(coffee => ({
      ...coffee,
      rating: Number(coffee.rating)
    })) as Coffee[]
  } catch (error) {
    console.error("Database Error:", error)
    return []
  }
}

export async function getCoffeeById(id: number): Promise<Coffee | null> {
  try {
    console.log("Buscando café com ID:", id)
    
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL não está definida")
      return null
    }

    const coffees = await sql`
      SELECT 
        c.id, 
        c.name, 
        c.sensory_profile as "sensoryProfile", 
        c.region, 
        c.producer, 
        c.variety, 
        c.process, 
        c.altitude,
        c.rating,
        c.created_at as "createdAt", 
        c.updated_at as "updatedAt"
      FROM coffees c
      WHERE c.id = ${id}
    `

    console.log("Resultado da consulta:", coffees)

    if (coffees.length === 0) {
      console.log("Nenhum café encontrado com o ID:", id)
      return null
    }

    const coffee = {
      ...coffees[0],
      rating: Number(coffees[0].rating)
    } as Coffee

    console.log("Café encontrado:", coffee)
    return coffee
  } catch (error) {
    console.error("Erro ao buscar café:", error)
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message)
      console.error("Stack trace:", error.stack)
    }
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

    // Corrigindo o tipo de retorno
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
    })) as unknown as Brew[]
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
    // Corrigindo o tipo de retorno
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
    } as unknown as Brew
  } catch (error) {
    console.error("Database Error:", error)
    return null
  }
}

// Nova função para buscar preparos por ID do café
export async function getBrewsByCoffeeId(coffeeId: number): Promise<Brew[]> {
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
      WHERE c.id = ${coffeeId}
      ORDER BY b.created_at DESC
      LIMIT 5
    `

    // Corrigindo o tipo de retorno
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
    })) as unknown as Brew[]
  } catch (error) {
    console.error("Database Error:", error)
    return []
  }
}