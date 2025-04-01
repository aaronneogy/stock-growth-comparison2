"use client"

import dynamic from 'next/dynamic'

const StockComparisonDashboard = dynamic(
  () => import('./stock-comparison-dashboard'),
  { ssr: false }
)

export function ClientWrapper() {
  return <StockComparisonDashboard />
}