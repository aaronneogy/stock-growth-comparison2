"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const industries = [
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Finance", value: "finance" },
  { label: "Consumer Goods", value: "consumer" },
  { label: "Energy", value: "energy" },
  { label: "Telecommunications", value: "telecom" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Materials", value: "materials" },
  { label: "Utilities", value: "utilities" }
]

interface IndustrySelectorProps {
  selectedIndustry: string
  onIndustryChange: (industry: string) => void
}

export function IndustrySelector({
  selectedIndustry,
  onIndustryChange,
}: IndustrySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="industry-select" className="text-sm font-medium text-indigo-900">
        Select Industry
      </label>
      <Select value={selectedIndustry} onValueChange={onIndustryChange}>
        <SelectTrigger
          id="industry-select"
          className="w-[280px] bg-white border-gray-200 hover:border-indigo-300
                     focus:ring-indigo-500 transition-all duration-200 text-gray-900"
        >
          <SelectValue placeholder="Select an industry" className="text-gray-900" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200 shadow-lg">
          {industries.map((industry) => (
            <SelectItem
              key={industry.value}
              value={industry.value}
              className="hover:bg-indigo-50 focus:bg-indigo-50 cursor-pointer text-gray-900"
            >
              {industry.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
