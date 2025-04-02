"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createCoffee(data: {
  name: string
  sensoryProfile: string
  region: string
  producer: string
  variety: string
  process: string
  altitude: string
}) {
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
        NOW(), 
        NOW()
      )
      RETURNING id, name, sensory_profile as "sensoryProfile"
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
  },
) {
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
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, sensory_profile as "sensoryProfile"
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
}) {
  try {
    await sql`
      INSERT INTO brews (
        coffee_id, 
        brewing_method, 
        water_temperature, 
        grinder_setting, 
        extraction_time, 
        acidity, 
        sweetness, 
        body, 
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
        NOW(), 
        NOW()
      )
    `

    revalidatePath("/brews")
    revalidatePath(`/coffees/${data.coffeeId}`)
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to create brew.")
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
  },
) {
  try {
    await sql`
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
        updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath("/brews")
    revalidatePath(`/brews/${id}`)
    revalidatePath(`/coffees/${data.coffeeId}`)
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to update brew.")
  }
}

export async function deleteCoffee(id: number): Promise<{ success: boolean; redirect: string }> {
  try {
    await sql`
      DELETE FROM coffees
      WHERE id = ${id}
    `
    revalidatePath("/coffees")
    return { success: true, redirect: "/coffees" }
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to delete coffee.")
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

