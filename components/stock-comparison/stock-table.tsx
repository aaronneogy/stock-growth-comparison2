"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Stock } from "@/types/stock"
import { formatPercentage, formatCurrency, formatMarketCap } from "@/lib/utils"
import { useSort } from "@/hooks/use-sort"
import { ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { StockChart } from "./stock-chart"
import { PortfolioBuilder } from "../portfolio/portfolio-builder"

interface StockTableProps {
  stocks: Stock[]
  loading: boolean
}

export function StockTable({ stocks, loading }: StockTableProps) {
  const { items: sortedStocks, sortConfig, requestSort } = useSort<Stock>(stocks)
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([])

  const handleStockClick = (stock: Stock) => {
    setSelectedStocks(prev => {
      const isSelected = prev.some(s => s.symbol === stock.symbol)
      if (isSelected) {
        return prev.filter(s => s.symbol !== stock.symbol)
      }
      if (prev.length >= 5) {
        return prev
      }
      return [...prev, stock]
    })
  }

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600"
    if (value < 0) return "text-red-600"
    return ""
  }

  const bestPerformer = stocks.length > 0
    ? stocks.reduce((prev, current) =>
        (prev.priceGrowth > current.priceGrowth) ? prev : current
      )
    : null

  const worstPerformer = stocks.length > 0
    ? stocks.reduce((prev, current) =>
        (prev.priceGrowth < current.priceGrowth) ? prev : current
      )
    : null

  if (loading) {
    return (
      <div className="rounded-md border">
        <Spinner />
      </div>
    )
  }

  const getSortDirection = (key: keyof Stock) => {
    if (sortConfig?.key !== key) return null
    return sortConfig.direction
  }

  return (
    <div className="space-y-6">
      {selectedStocks.length > 0 && (
        <>
          <div className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-indigo-900">Price Comparison</h3>
            <StockChart selectedStocks={selectedStocks} />
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock)}
                  className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-full
                           hover:bg-indigo-100 transition-colors duration-200 flex items-center gap-1"
                >
                  {stock.symbol}
                  <span className="text-indigo-400">✕</span>
                </button>
              ))}
            </div>
          </div>

          <PortfolioBuilder selectedStocks={selectedStocks} />
        </>
      )}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <TableHead className="text-indigo-900 font-semibold">Company</TableHead>
              <TableHead className="text-indigo-900 font-semibold">Symbol</TableHead>
              <TableHead
                className="text-right cursor-pointer text-indigo-900 font-semibold hover:text-indigo-700 transition-colors"
                onClick={() => requestSort('currentPrice')}
              >
                <div className="flex items-center justify-end gap-2">
                  Current Price
                  <ArrowUpDown className={cn(
                    "h-4 w-4",
                    getSortDirection('currentPrice') === 'asc' && "rotate-180 transform",
                    !getSortDirection('currentPrice') && "opacity-50"
                  )} />
                </div>
              </TableHead>
              <TableHead className="text-right text-indigo-900 font-semibold">Start Q Price</TableHead>
              <TableHead className="text-right text-indigo-900 font-semibold">End Q Price</TableHead>
              <TableHead
                className="text-right cursor-pointer text-indigo-900 font-semibold hover:text-indigo-700 transition-colors"
                onClick={() => requestSort('priceGrowth')}
              >
                <div className="flex items-center justify-end gap-2">
                  Growth %
                  <ArrowUpDown className={cn(
                    "h-4 w-4",
                    getSortDirection('priceGrowth') === 'asc' && "rotate-180 transform",
                    !getSortDirection('priceGrowth') && "opacity-50"
                  )} />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer text-indigo-900 font-semibold hover:text-indigo-700 transition-colors"
                onClick={() => requestSort('marketCap')}
              >
                <div className="flex items-center justify-end gap-2">
                  Market Cap
                  <ArrowUpDown className={cn(
                    "h-4 w-4",
                    getSortDirection('marketCap') === 'asc' && "rotate-180 transform",
                    !getSortDirection('marketCap') && "opacity-50"
                  )} />
                </div>
              </TableHead>
              <TableHead className="text-right text-indigo-900 font-semibold">P/E Ratio</TableHead>
              <TableHead
                className="text-right cursor-pointer text-indigo-900 font-semibold hover:text-indigo-700 transition-colors"
                onClick={() => requestSort('quarterOverQuarterGrowth')}
              >
                <div className="flex items-center justify-end gap-2">
                  QoQ Growth
                  <ArrowUpDown className={cn(
                    "h-4 w-4",
                    getSortDirection('quarterOverQuarterGrowth') === 'asc' && "rotate-180 transform",
                    !getSortDirection('quarterOverQuarterGrowth') && "opacity-50"
                  )} />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.map((stock) => (
              <TableRow
                key={stock.symbol}
                className={cn(
                  "hover:bg-indigo-50/50 cursor-pointer transition-colors",
                  selectedStocks.some(s => s.symbol === stock.symbol) && "bg-indigo-50 hover:bg-indigo-100/70",
                  bestPerformer && stock.symbol === bestPerformer.symbol && "bg-green-50 hover:bg-green-100/70",
                  worstPerformer && stock.symbol === worstPerformer.symbol && "bg-red-50 hover:bg-red-100/70"
                )}
                onClick={() => handleStockClick(stock)}
              >
                <TableCell className="text-indigo-900">
                  <div className="flex items-center gap-2">
                    {stock.companyName}
                    {bestPerformer && stock.symbol === bestPerformer.symbol && (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}
                    {worstPerformer && stock.symbol === worstPerformer.symbol && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-indigo-900">{stock.symbol}</TableCell>
                <TableCell className="text-right text-indigo-900">
                  {formatCurrency(stock.currentPrice)}
                </TableCell>
                <TableCell className="text-right text-indigo-900">
                  {formatCurrency(stock.startQuarterPrice)}
                </TableCell>
                <TableCell className="text-right text-indigo-900">
                  {formatCurrency(stock.endQuarterPrice)}
                </TableCell>
                <TableCell className={cn("text-right", getGrowthColor(stock.priceGrowth))}>
                  {formatPercentage(stock.priceGrowth)}
                </TableCell>
                <TableCell className="text-right text-indigo-900">
                  {formatMarketCap(stock.marketCap)}
                </TableCell>
                <TableCell className="text-right text-indigo-900">
                  {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                </TableCell>
                <TableCell className={cn("text-right", getGrowthColor(stock.quarterOverQuarterGrowth))}>
                  {formatPercentage(stock.quarterOverQuarterGrowth)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
