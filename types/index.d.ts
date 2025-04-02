export interface Coffee {
  id: number
  name: string
  sensoryProfile: string
  region: string
  producer: string
  variety: string
  process: string
  altitude: string
  createdAt: string
  updatedAt: string
  userId: number
}

export interface Brew {
  id: number
  coffeeId: number
  coffeeName: string
  brewingMethod: string
  dose: number
  waterAmount: number
  waterTemperature: number
  grinderSetting: string
  extractionTime: number
  acidity: number
  sweetness: number
  body: number
  notes: string
  createdAt: string
  updatedAt: string
  userId: number
}

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt: string
} 