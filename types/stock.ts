export interface Stock {
  companyName: string
  symbol: string
  currentPrice: number
  startQuarterPrice: number
  month1Price: number
  month2Price: number
  month3Price: number
  endQuarterPrice: number
  priceGrowth: number
  month1Growth: number
  month2Growth: number
  month3Growth: number
  marketCap: number
  peRatio?: number  // Made optional with ?
  quarterOverQuarterGrowth: number
  industry: string
}

export interface IndustryOption {
  label: string
  value: string
}
