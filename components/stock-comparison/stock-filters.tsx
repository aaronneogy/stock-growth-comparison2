"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export function StockFilters() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="min-price" className="text-sm font-medium">
          Min Price
        </label>
        <Input
          id="min-price"
          type="number"
          placeholder="0"
          className="w-[120px]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="max-price" className="text-sm font-medium">
          Max Price
        </label>
        <Input
          id="max-price"
          type="number"
          placeholder="1000"
          className="w-[120px]"
        />
      </div>
    </div>
  )
}