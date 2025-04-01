"use client"

import { useState } from 'react'
import { IndustrySelector } from './industry-selector'
import { StockTable } from './stock-table'
import { StockFilters } from './stock-filters'
import { Stock } from '@/types/stock'

const StockComparisonDashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<Stock[]>([])
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  const handleIndustryChange = async (industry: string) => {
    setLoading(true)
    setSelectedIndustry(industry)

    try {
      const response = await fetch(`/api/stocks?industry=${industry}`)
      const data = await response.json()
      setStocks(data)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStocks = stocks.filter((stock) => {
    if (minPrice !== null && stock.currentPrice < minPrice) return false
    if (maxPrice !== null && stock.currentPrice > maxPrice) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <IndustrySelector
          selectedIndustry={selectedIndustry}
          onIndustryChange={handleIndustryChange}
        />
        <StockFilters
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />
      </div>
      <StockTable stocks={filteredStocks} loading={loading} />
    </div>
  )
}

export default StockComparisonDashboard
