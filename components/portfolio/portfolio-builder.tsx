"use client"

import { useState, useEffect } from "react"
import { Stock } from "@/types/stock"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RiskAnalysis } from "@/components/portfolio/risk-analysis"

interface PortfolioStock extends Stock {
  weight: number
  investmentAmount: number
  shares: number
  expectedReturn: number
  riskScore: number
}

interface PortfolioBuilderProps {
  selectedStocks: Stock[]
}

export function PortfolioBuilder({ selectedStocks }: PortfolioBuilderProps) {
  const [totalInvestment, setTotalInvestment] = useState<number>(10000)
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([])

  useEffect(() => {
    setPortfolioStocks(
      selectedStocks.map(stock => ({
        ...stock,
        weight: 100 / selectedStocks.length,
        investmentAmount: totalInvestment / selectedStocks.length,
        shares: (totalInvestment / selectedStocks.length) / stock.currentPrice,
        expectedReturn: stock.quarterOverQuarterGrowth,
        riskScore: calculateRiskScore(stock)
      }))
    )
  }, [selectedStocks, totalInvestment])

  const handleWeightChange = (symbol: string, newWeight: number) => {
    // Ensure weight is between 0 and 100
    const validWeight = Math.min(Math.max(0, newWeight), 100)

    setPortfolioStocks(prev => {
      const updatedStocks = prev.map(stock => {
        if (stock.symbol === symbol) {
          return {
            ...stock,
            weight: validWeight,
            investmentAmount: (totalInvestment * validWeight) / 100,
            shares: (totalInvestment * validWeight) / (100 * stock.currentPrice)
          }
        }
        return stock
      })
      return updatedStocks
    })
  }

  const handleInvestmentChange = (value: number) => {
    const validAmount = Math.max(0, value) // Ensure amount is not negative
    setTotalInvestment(validAmount)
  }

  // Add this to calculate total weight
  const totalWeight = portfolioStocks.reduce((sum, stock) => sum + stock.weight, 0)
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01 // Allow small rounding errors

  // Add this function to handle rebalancing
  const handleRebalance = () => {
    const equalWeight = 100 / portfolioStocks.length
    setPortfolioStocks(prev =>
      prev.map(stock => ({
        ...stock,
        weight: equalWeight,
        investmentAmount: (totalInvestment * equalWeight) / 100,
        shares: (totalInvestment * equalWeight) / (100 * stock.currentPrice)
      }))
    )
  }

  // Add this function to calculate strategy weights
  const applyStrategy = (strategy: 'aggressive' | 'conservative' | 'balanced') => {
    setPortfolioStocks(prev => {
      const totalMarketCap = prev.reduce((sum, stock) => sum + stock.marketCap, 0)
      const totalRiskScore = prev.reduce((sum, stock) => sum + stock.riskScore, 0)

      return prev.map(stock => {
        let weight = 0

        switch (strategy) {
          case 'aggressive':
            // Higher weights to stocks with higher growth rates
            weight = (stock.quarterOverQuarterGrowth /
              prev.reduce((sum, s) => sum + s.quarterOverQuarterGrowth, 0)) * 100
            break

          case 'conservative':
            // Higher weights to larger, more stable companies
            weight = (stock.marketCap / totalMarketCap) * 100
            break

          case 'balanced':
            // Inverse relationship with risk score
            const inverseRisk = 1 / stock.riskScore
            weight = (inverseRisk /
              prev.reduce((sum, s) => sum + (1 / s.riskScore), 0)) * 100
            break
        }

        return {
          ...stock,
          weight,
          investmentAmount: (totalInvestment * weight) / 100,
          shares: (totalInvestment * weight) / (100 * stock.currentPrice)
        }
      })
    })
  }

  const portfolioStats = calculatePortfolioStats(portfolioStocks)

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-indigo-900">Portfolio Builder</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Investment Amount ($)
          </label>
          <Input
            type="number"
            value={totalInvestment}
            min={0}
            step={100}
            onChange={(e) => handleInvestmentChange(Number(e.target.value))}
            className="w-[150px] text-gray-900 bg-transparent"
          />
        </div>
      </div>

      {/* Add strategy selector before the weight warning */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Investment Strategy
          </span>
          <Select onValueChange={(value: any) => applyStrategy(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aggressive">Aggressive Growth</SelectItem>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleRebalance}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Equal Weight
        </Button>
      </div>

      {/* Weight warning moves below strategy selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Total Weight: {totalWeight.toFixed(2)}%
        </span>
        {!isWeightValid && (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Weights should sum to 100%</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-600">Expected Return</p>
          <p className="text-2xl font-bold text-indigo-900">
            {formatPercentage(portfolioStats.expectedReturn)}
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-600">Risk Score</p>
          <p className="text-2xl font-bold text-indigo-900">
            {portfolioStats.riskScore.toFixed(1)}
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-600">Sharpe Ratio</p>
          <p className="text-2xl font-bold text-indigo-900">
            {portfolioStats.sharpeRatio.toFixed(2)}
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <TableHead className="text-indigo-900">Stock</TableHead>
            <TableHead className="text-center text-indigo-900">Weight (%)</TableHead>
            <TableHead className="text-right text-indigo-900">Amount ($)</TableHead>
            <TableHead className="text-right text-indigo-900">Shares</TableHead>
            <TableHead className="text-right text-indigo-900">Exp. Return</TableHead>
            <TableHead className="text-right text-indigo-900">Risk Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolioStocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium text-gray-900">{stock.symbol}</TableCell>
              <TableCell className="text-center">
                <Input
                  type="number"
                  value={stock.weight}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(e) => handleWeightChange(stock.symbol, Number(e.target.value))}
                  className="w-[100px] text-center text-gray-900 bg-transparent mx-auto"
                />
              </TableCell>
              <TableCell className="text-right text-gray-900">
                {formatCurrency(stock.investmentAmount)}
              </TableCell>
              <TableCell className="text-right text-gray-900">
                {stock.shares.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-gray-900">
                {formatPercentage(stock.expectedReturn)}
              </TableCell>
              <TableCell className="text-right text-gray-900">
                {stock.riskScore.toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Risk Analysis section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-indigo-900 mb-6">Risk Analysis</h3>
        <RiskAnalysis
          stocks={portfolioStocks}
          weights={portfolioStocks.map(stock => stock.weight)}
        />
      </div>
    </div>
  )
}

function calculateRiskScore(stock: Stock): number {
  // Simple risk score calculation based on various factors
  const volatilityScore = Math.abs(stock.priceGrowth) / 10
  const marketCapScore = Math.log10(stock.marketCap) / 3
  const peRatioScore = (stock.peRatio ?? 0) > 0 ? Math.min((stock.peRatio ?? 0) / 20, 5) : 5

  return (volatilityScore + (10 - marketCapScore) + peRatioScore) / 3
}

function calculatePortfolioStats(stocks: PortfolioStock[]) {
  const expectedReturn = stocks.reduce(
    (acc, stock) => acc + (stock.expectedReturn * (stock.weight / 100)),
    0
  )

  const riskScore = stocks.reduce(
    (acc, stock) => acc + (stock.riskScore * (stock.weight / 100)),
    0
  )

  // Simplified Sharpe ratio calculation (assuming risk-free rate of 2%)
  const riskFreeRate = 2
  const sharpeRatio = (expectedReturn - riskFreeRate) / riskScore

  return {
    expectedReturn,
    riskScore,
    sharpeRatio
  }
}
