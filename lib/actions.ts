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
      RETURNING id, name, sensory_profile as "sensoryProfile", region, producer, variety, process, altitude, rating::numeric as rating, created_at as "createdAt", updated_at as "updatedAt"
    `

    console.log("Café criado com sucesso:", result)

    revalidatePath("/coffees")
    return { success: true, data: result[0] as Coffee }
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
      RETURNING id, name, sensory_profile as "sensoryProfile", region, producer, variety, process, altitude, rating::numeric as rating, created_at as "createdAt", updated_at as "updatedAt"
    `

    console.log("Café atualizado com sucesso:", result)

    revalidatePath("/coffees")
    revalidatePath(`/coffees/${id}`)
    return { success: true, data: result[0] as Coffee }
  } catch (error) {
    console.error("Erro ao atualizar café:", error)
    throw new Error(`Falha ao atualizar café: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function createBrew(data: {
  coffeeId: number
  brewingMethod: string
  dose: number
  waterAmount: number
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

    const calculatedRatio =
      data.dose > 0
        ? `1:${(data.waterAmount / data.dose).toFixed(1)}`
        : "1:0"


    // Validação dos campos obrigatórios
    const requiredFields = [
      { name: "coffeeId", value: data.coffeeId },
      { name: "brewingMethod", value: data.brewingMethod },
      { name: "dose", value: data.dose },
      { name: "waterAmount", value: data.waterAmount },
      { name: "waterTemperature", value: data.waterTemperature },
      { name: "grinderSetting", value: data.grinderSetting },
      { name: "extractionTime", value: data.extractionTime },
      { name: "acidity", value: data.acidity },
      { name: "sweetness", value: data.sweetness },
      { name: "body", value: data.body },
      { name: "brewDate", value: data.brewDate },
      { name: "brewTime", value: data.brewTime }
    ]

    const missingFields = requiredFields.filter(field => !field.value && field.value !== 0)
    
    if (missingFields.length > 0) {
      console.error("Campos obrigatórios faltando:", missingFields)
      throw new Error(`Campos obrigatórios faltando: ${missingFields.map(f => f.name).join(", ")}`)
    }

    const result = await sql`
      INSERT INTO brews (
        coffee_id,
        brewing_method,
        dose,
        water_amount,
        ratio,
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
      ) VALUES (
        ${data.coffeeId},
        ${data.brewingMethod},
        ${data.dose},
        ${data.waterAmount}, 
        ${calculatedRatio},
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
        dose,
        water_amount as "waterAmount",
        ratio,
        water_temperature as "waterTemperature", 
        grinder_setting as "grinderSetting", 
        extraction_time as "extractionTime", 
        acidity, 
        sweetness, 
        body, 
        rating,
        brew_date::text as "brewDate",
        brew_time::text as "brewTime",
        notes, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
    `

    console.log("Preparo criado com sucesso:", result)

    if (!result || result.length === 0) {
      throw new Error("Falha ao criar preparo: nenhum resultado retornado")
    }

    // Buscar o café associado
    const coffeeResult = await sql`
      SELECT 
        id, 
        name, 
        sensory_profile as "sensoryProfile", 
        region, 
        producer, 
        variety, 
        process, 
        altitude,
        rating,
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM coffees
      WHERE id = ${data.coffeeId}
    `

    if (!coffeeResult || coffeeResult.length === 0) {
      throw new Error("Café não encontrado")
    }

    const brewData = {
      ...result[0],
      coffee: {
        id: coffeeResult[0].id,
        name: coffeeResult[0].name,
        sensoryProfile: coffeeResult[0].sensoryProfile,
        region: coffeeResult[0].region,
        producer: coffeeResult[0].producer,
        variety: coffeeResult[0].variety,
        process: coffeeResult[0].process,
        altitude: coffeeResult[0].altitude,
        rating: Number(coffeeResult[0].rating),
        createdAt: coffeeResult[0].createdAt,
        updatedAt: coffeeResult[0].updatedAt
      }
    } as Brew

    revalidatePath("/brews")
    revalidatePath(`/coffees/${data.coffeeId}`)
    return { success: true, data: brewData }
  } catch (error) {
    console.error("Erro ao criar preparo:", error)
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message)
      console.error("Stack trace:", error.stack)
    }
    throw new Error(`Falha ao criar preparo: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateBrew(
  id: number,
  data: {
    coffeeId: number
    brewingMethod: string
    dose: number
    waterAmount: number
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
    const calculatedRatio =
      data.dose > 0
        ? `1:${(data.waterAmount / data.dose).toFixed(1)}`
        : "1:0"

    const result = await sql`
      UPDATE brews
      SET 
        coffee_id = ${data.coffeeId}, 
        brewing_method = ${data.brewingMethod}, 
        dose = ${data.dose},
        water_amount = ${data.waterAmount}, 
        ratio = ${calculatedRatio},
        water_temperature = ${data.waterTemperature}, 
        grinder_setting = ${data.grinderSetting}, 
        extraction_time = ${data.extractionTime}, 
        acidity = ${data.acidity}, 
        sweetness = ${data.sweetness}, 
        body = ${data.body},
        rating = ${data.rating},
        brew_date = ${data.brewDate}::date,
        brew_time = ${data.brewTime}::time,
        notes = ${data.notes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING 
        id, 
        coffee_id as "coffeeId", 
        brewing_method as "brewingMethod",
        dose,
        water_amount as "waterAmount",
        ratio,
        water_temperature as "waterTemperature", 
        grinder_setting as "grinderSetting", 
        extraction_time as "extractionTime", 
        acidity, 
        sweetness, 
        body, 
        rating,
        brew_date::text as "brewDate",
        brew_time::text as "brewTime",
        notes, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
    `

    if (!result || result.length === 0) {
      throw new Error("Falha ao atualizar preparo: nenhum resultado retornado")
    }

    // Buscar o café associado
    const coffeeResult = await sql`
      SELECT 
        id, 
        name, 
        sensory_profile as "sensoryProfile", 
        region, 
        producer, 
        variety, 
        process, 
        altitude,
        rating,
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM coffees
      WHERE id = ${data.coffeeId}
    `

    if (!coffeeResult || coffeeResult.length === 0) {
      throw new Error("Café não encontrado")
    }

    const brewData = {
      ...result[0],
      coffee: {
        id: coffeeResult[0].id,
        name: coffeeResult[0].name,
        sensoryProfile: coffeeResult[0].sensoryProfile,
        region: coffeeResult[0].region,
        producer: coffeeResult[0].producer,
        variety: coffeeResult[0].variety,
        process: coffeeResult[0].process,
        altitude: coffeeResult[0].altitude,
        rating: Number(coffeeResult[0].rating),
        createdAt: coffeeResult[0].createdAt,
        updatedAt: coffeeResult[0].updatedAt
      }
    } as Brew

    revalidatePath("/brews")
    revalidatePath(`/coffees/${data.coffeeId}`)
    return { success: true, data: brewData }
  } catch (error) {
    console.error("Erro ao atualizar preparo:", error)
    throw new Error(`Falha ao atualizar preparo: ${error instanceof Error ? error.message : String(error)}`)
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
