"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Coffee, Brew } from "@/lib/types"

export async function createCoffee(data: {
  name: string
  sensoryProfile: string
  region: string
  producer: string
  variety: string
  process: string
  altitude: string
  rating: number
}): Promise<{ success: boolean; data: Coffee }> {
  try {
    console.log("Criando café com dados:", data)
    console.log("Perfil sensorial:", data.sensoryProfile)

    // Verificar se todos os campos estão presentes
    if (
      !data.name ||
      !data.sensoryProfile ||
      !data.region ||
      !data.producer ||
      !data.variety ||
      !data.process ||
      !data.altitude
    ) {
      throw new Error("Todos os campos são obrigatórios")
    }

    const result = await sql`
      INSERT INTO coffees (
        name, 
        sensory_profile, 
        region, 
        producer, 
        variety, 
        process, 
        altitude,
        rating,
        created_at, 
        updated_at
      ) 
      VALUES (
        ${data.name}, 
        ${data.sensoryProfile}, 
        ${data.region}, 
        ${data.producer}, 
        ${data.variety}, 
        ${data.process}, 
        ${data.altitude},
        ${data.rating},
        NOW(), 
        NOW()
      )
      RETURNING id, name, sensory_profile as "sensoryProfile", region, producer, variety, process, altitude, rating, created_at as "createdAt", updated_at as "updatedAt"
    `

    console.log("Café criado com sucesso:", result)

    revalidatePath("/coffees")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao criar café:", error)
    throw new Error(`Falha ao criar café: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateCoffee(
  id: number,
  data: {
    name: string
    sensoryProfile: string
    region: string
    producer: string
    variety: string
    process: string
    altitude: string
    rating: number
  },
): Promise<{ success: boolean; data: Coffee }> {
  try {
    console.log("Atualizando café com ID:", id, "Dados:", data)

    const result = await sql`
      UPDATE coffees
      SET 
        name = ${data.name}, 
        sensory_profile = ${data.sensoryProfile}, 
        region = ${data.region}, 
        producer = ${data.producer}, 
        variety = ${data.variety}, 
        process = ${data.process}, 
        altitude = ${data.altitude},
        rating = ${data.rating},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, sensory_profile as "sensoryProfile", region, producer, variety, process, altitude, rating, created_at as "createdAt", updated_at as "updatedAt"
    `

    console.log("Café atualizado com sucesso:", result)

    revalidatePath("/coffees")
    revalidatePath(`/coffees/${id}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao atualizar café:", error)
    throw new Error(`Falha ao atualizar café: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function createBrew(data: {
  coffeeId: number
  brewingMethod: string
  waterTemperature: number
  grinderSetting: number
  extractionTime: number
  acidity: number
  sweetness: number
  body: number
  rating: number
  brewDate: string
  brewTime: string
  notes?: string
}): Promise<{ success: boolean; data: Brew }> {
  try {
    console.log("Criando preparo com dados:", data)

    // Verificar se todos os campos obrigatórios estão presentes
    if (
      !data.coffeeId ||
      !data.brewingMethod ||
      !data.waterTemperature ||
      !data.grinderSetting ||
      !data.extractionTime ||
      !data.acidity ||
      !data.sweetness ||
      !data.body ||
      !data.brewDate ||
      !data.brewTime
    ) {
      throw new Error("Todos os campos obrigatórios são necessários")
    }

    const result = await sql`
      INSERT INTO brews (
        coffee_id, 
        brewing_method, 
        water_temperature, 
        grinder_setting, 
        extraction_time, 
        acidity, 
        sweetness, 
        body,
        rating,
        brew_date,
        brew_time,
        notes,
        created_at, 
        updated_at
      ) 
      VALUES (
        ${data.coffeeId}, 
        ${data.brewingMethod}, 
        ${data.waterTemperature}, 
        ${data.grinderSetting}, 
        ${data.extractionTime}, 
        ${data.acidity}, 
        ${data.sweetness}, 
        ${data.body},
        ${data.rating},
        ${data.brewDate}::date,
        ${data.brewTime}::time,
        ${data.notes},
        NOW(), 
        NOW()
      )
      RETURNING 
        id, 
        coffee_id as "coffeeId", 
        brewing_method as "brewingMethod", 
        water_temperature as "waterTemperature", 
        grinder_setting as "grinderSetting", 
        extraction_time as "extractionTime", 
        acidity, 
        sweetness, 
        body, 
        rating,
        brew_date as "brewDate",
        brew_time as "brewTime",
        notes, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
    `

    console.log("Preparo criado com sucesso:", result)

    revalidatePath("/brews")
    revalidatePath(`/coffees/${data.coffeeId}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao criar preparo:", error)
    throw new Error(`Falha ao criar preparo: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateBrew(
  id: number,
  data: {
    coffeeId: number
    brewingMethod: string
    waterTemperature: number
    grinderSetting: number
    extractionTime: number
    acidity: number
    sweetness: number
    body: number
    rating: number
    brewDate: string
    brewTime: string
    notes?: string
  },
): Promise<{ success: boolean; data: Brew }> {
  try {
    const result = await sql`
      UPDATE brews
      SET 
        coffee_id = ${data.coffeeId}, 
        brewing_method = ${data.brewingMethod}, 
        water_temperature = ${data.waterTemperature}, 
        grinder_setting = ${data.grinderSetting}, 
        extraction_time = ${data.extractionTime}, 
        acidity = ${data.acidity}, 
        sweetness = ${data.sweetness}, 
        body = ${data.body},
        rating = ${data.rating},
        brew_date = ${data.brewDate},
        brew_time = ${data.brewTime},
        notes = ${data.notes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, coffee_id as "coffeeId", brewing_method as "brewingMethod", water_temperature as "waterTemperature", grinder_setting as "grinderSetting", extraction_time as "extractionTime", acidity, sweetness, body, rating, brew_date as "brewDate", brew_time as "brewTime", notes, created_at as "createdAt", updated_at as "updatedAt"
    `

    revalidatePath("/brews")
    revalidatePath(`/brews/${id}`)
    revalidatePath(`/coffees/${data.coffeeId}`)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to update brew.")
  }
}

export async function deleteCoffee(id: number): Promise<{ success: boolean; redirect: string }> {
  try {
    // Primeiro deletar os preparos relacionados
    await sql`
      DELETE FROM brews
      WHERE coffee_id = ${id}
    `

    // Depois deletar o café
    await sql`
      DELETE FROM coffees
      WHERE id = ${id}
    `

    // Revalidar todas as rotas que podem ter sido afetadas
    revalidatePath("/coffees")
    revalidatePath(`/coffees/${id}`)
    revalidatePath("/brews")
    
    return { success: true, redirect: "/coffees" }
  } catch (error) {
    console.error("Erro ao deletar café:", error)
    throw new Error("Falha ao deletar café.")
  }
}

export async function deleteBrew(id: number): Promise<{ success: boolean; redirect: string }> {
  try {
    await sql`
      DELETE FROM brews
      WHERE id = ${id}
    `
    revalidatePath("/brews")
    return { success: true, redirect: "/brews" }
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to delete brew.")
  }
}

