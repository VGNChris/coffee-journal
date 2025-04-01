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
}

export interface Brew {
  id: number
  coffee: Coffee
  brewingMethod: string
  waterTemperature: number
  grinderSetting: number
  extractionTime: number
  acidity: number
  sweetness: number
  body: number
  createdAt: string
  updatedAt: string
}

