export interface Coffee {
  id: number
  name: string
  sensoryProfile: string
  region: string
  producer: string
  variety: string
  process: string
  altitude: string
  rating: number
  createdAt: string
  updatedAt: string
}

export interface Brew {
  id: number
  coffeeId: number
  brewingMethod: string
  waterTemperature: number
  grinderSetting: number
  extractionTime: number
  acidity: number
  sweetness: number
  body: number
  rating: number
  notes?: string
  createdAt: string
  updatedAt: string
}

