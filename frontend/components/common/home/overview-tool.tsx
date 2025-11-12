"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import { TableFilter } from "@/components/common/general/table-filter"

interface OverviewToolProps {
  onDateRangeChange?: (dateRange: { from: Date; to: Date } | null) => void
}

export function OverviewTool({ onDateRangeChange }: OverviewToolProps) {
  const getLastDays = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    return { from, to }
  }

  const [selectedQuickSelection, setSelectedQuickSelection] = React.useState<string | null>("最近 7 天")
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | null>(getLastDays(7))

  const handleDateRangeChange = (range: { from: Date; to: Date } | null) => {
    setDateRange(range || getLastDays(7))
    onDateRangeChange?.(range)
  }

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap pt-6">
      <TableFilter
        enabledFilters={{
          type: false,
          status: false,
          timeRange: true
        }}
        selectedTimeRange={dateRange}
        selectedQuickSelection={selectedQuickSelection}
        onTimeRangeChange={handleDateRangeChange}
        onQuickSelectionChange={setSelectedQuickSelection}
        showClearButton={false}
      />

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-6 w-6 rounded-full border-muted-foreground/20">
          <Plus className="size-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-6 w-6 rounded-full border-muted-foreground/20">
          <Settings className="size-3" />
        </Button>
      </div>
    </div>
  )
}

