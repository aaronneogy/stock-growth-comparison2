"use client"

import { Stock } from "@/types/stock"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPercentage } from "@/lib/utils"

interface RiskAnalysisProps {
  stocks: Stock[]
  weights: number[]
}

export function RiskAnalysis({ stocks, weights }: RiskAnalysisProps) {
  // Calculate correlation matrix
  const correlationMatrix = calculateCorrelationMatrix(stocks)

  // Calculate portfolio diversification score
  const diversificationScore = calculateDiversificationScore(correlationMatrix, weights)

  // Calculate individual stock betas
  const betas = stocks.map(stock => calculateBeta(stock))

  // Calculate portfolio beta
  const portfolioBeta = betas.reduce((sum, beta, i) => sum + beta * (weights[i] / 100), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-600">Portfolio Beta</p>
          <p className="text-2xl font-bold text-indigo-900">
            {portfolioBeta.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-600">Diversification Score</p>
          <p className="text-2xl font-bold text-indigo-900">
            {diversificationScore.toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-indigo-900 mb-4">Correlation Matrix</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-indigo-900">Stock</TableHead>
              {stocks.map(stock => (
                <TableHead key={stock.symbol} className="text-right text-indigo-900">
                  {stock.symbol}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {correlationMatrix.map((row, i) => (
              <TableRow key={stocks[i].symbol}>
                <TableCell className="font-medium text-gray-900">
                  {stocks[i].symbol}
                </TableCell>
                {row.map((correlation, j) => (
                  <TableCell
                    key={j}
                    className="text-right text-gray-900"
                    style={{
                      backgroundColor: `rgba(79, 70, 229, ${Math.abs(correlation) * 0.2})`
                    }}
                  >
                    {correlation.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function calculateCorrelationMatrix(stocks: Stock[]): number[][] {
  const n = stocks.length
  const matrix = Array(n).fill(0).map(() => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1
      } else {
        // Simple correlation based on growth rates
        const correlation = calculateCorrelation(
          [stocks[i].month1Growth, stocks[i].month2Growth, stocks[i].month3Growth],
          [stocks[j].month1Growth, stocks[j].month2Growth, stocks[j].month3Growth]
        )
        matrix[i][j] = correlation
        matrix[j][i] = correlation
      }
    }
  }

  return matrix
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length
  const meanX = x.reduce((a, b) => a + b) / n
  const meanY = y.reduce((a, b) => a + b) / n

  const covariance = x.reduce((sum, xi, i) =>
    sum + (xi - meanX) * (y[i] - meanY), 0) / (n - 1)

  const stdX = Math.sqrt(x.reduce((sum, xi) =>
    sum + Math.pow(xi - meanX, 2), 0) / (n - 1))

  const stdY = Math.sqrt(y.reduce((sum, yi) =>
    sum + Math.pow(yi - meanY, 2), 0) / (n - 1))

  return covariance / (stdX * stdY)
}

function calculateBeta(stock: Stock): number {
  // Simplified beta calculation
  return stock.priceGrowth / 10 // Assuming market return is 10%
}

function calculateDiversificationScore(correlationMatrix: number[][], weights: number[]): number {
  const n = weights.length
  let score = 0

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        // Lower correlation = better diversification
        score += (1 - Math.abs(correlationMatrix[i][j])) * (weights[i] / 100) * (weights[j] / 100)
      }
    }
  }

  return score * 10 // Scale to 0-10
}
