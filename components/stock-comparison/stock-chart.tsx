"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Stock } from "@/types/stock"

interface StockChartProps {
  selectedStocks: Stock[]
}

export function StockChart({ selectedStocks }: StockChartProps) {
  // Transform the data for the chart
  const chartData = [
    {
      name: "Start Quarter",
      ...selectedStocks.reduce((acc, stock) => ({
        ...acc,
        [stock.symbol]: stock.startQuarterPrice,
      }), {}),
    },
    {
      name: "Month 1",
      ...selectedStocks.reduce((acc, stock) => ({
        ...acc,
        [stock.symbol]: stock.month1Price,
      }), {}),
    },
    {
      name: "Month 2",
      ...selectedStocks.reduce((acc, stock) => ({
        ...acc,
        [stock.symbol]: stock.month2Price,
      }), {}),
    },
    {
      name: "Month 3",
      ...selectedStocks.reduce((acc, stock) => ({
        ...acc,
        [stock.symbol]: stock.month3Price,
      }), {}),
    },
    {
      name: "End Quarter",
      ...selectedStocks.reduce((acc, stock) => ({
        ...acc,
        [stock.symbol]: stock.endQuarterPrice,
      }), {}),
    },
    {
      name: "Current",
      ...selectedStocks.reduce((acc, stock) => ({
        ...acc,
        [stock.symbol]: stock.currentPrice,
      }), {}),
    },
  ]

  // Calculate min and max values for Y axis
  const allPrices = selectedStocks.flatMap(stock => [
    stock.startQuarterPrice,
    stock.month1Price,
    stock.month2Price,
    stock.month3Price,
    stock.endQuarterPrice,
    stock.currentPrice
  ])

  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const padding = (maxPrice - minPrice) * 0.05 // 5% padding

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"]

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#4338CA' }}
            stroke="#E2E8F0"
          />
          <YAxis
            tick={{ fill: '#4338CA' }}
            stroke="#E2E8F0"
            domain={[minPrice - padding, maxPrice + padding]}
            allowDataOverflow={false}
            scale="linear"
            tickCount={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '12px'
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              color: '#4338CA'
            }}
          />
          {selectedStocks.map((stock, index) => (
            <Line
              key={stock.symbol}
              type="monotone"
              dataKey={stock.symbol}
              stroke={colors[index % colors.length]}
              name={`${stock.companyName} (${stock.symbol})`}
              dot={{ strokeWidth: 2, r: 4, fill: 'white' }}
              strokeWidth={2.5}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
