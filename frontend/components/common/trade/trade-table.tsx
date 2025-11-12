"use client"

import * as React from "react"
import { useEffect } from "react"
import { ListRestart, Layers } from "lucide-react"
import type { Order, OrderType, OrderStatus, TransactionQueryParams } from "@/lib/services"
import { TableFilter, typeConfig, statusConfig } from "@/components/common/general/table-filter"
import { Button } from "@/components/ui/button"
import { ErrorInline } from "@/components/common/status/error"
import { EmptyStateWithBorder } from "@/components/common/status/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTransaction } from "@/contexts/transaction-context"

/**
 * 交易表格组件
 * 支持类型、状态、时间范围筛选的交易记录显示（支持分页）
 * 注意：此组件必须在 TransactionProvider 内部使用
 */
export function TradeTable({ type }: { type?: OrderType }) {
  return <TransactionList initialType={type} />
}


/**
 * 交易列表组件
 */
function TransactionList({ initialType }: { initialType?: OrderType }) {
  const {
    transactions,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    fetchTransactions,
    loadMore,
  } = useTransaction()

  // 计算最近7天
  const getLastDays = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    return { from, to }
  }

  // 筛选状态
  const [selectedTypes, setSelectedTypes] = React.useState<OrderType[]>(initialType ? [initialType] : [])
  const [selectedStatuses, setSelectedStatuses] = React.useState<OrderStatus[]>([])
  const [selectedQuickSelection, setSelectedQuickSelection] = React.useState<string | null>("最近 4 周")
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | null>(getLastDays(28))

  // 清空所有筛选
  const clearAllFilters = () => {
    setSelectedTypes(initialType ? [initialType] : [])
    setSelectedStatuses([])
    setDateRange(getLastDays(28))
    setSelectedQuickSelection("最近 4 周")
    // 重新获取数据
    const defaultRange = getLastDays(28)
    fetchTransactions({
      page: 1,
      page_size: 20,
      type: initialType,
      startTime: defaultRange.from.toISOString(),
      endTime: defaultRange.to.toISOString(),
    })
  }

  // 当筛选条件改变时，重新加载数据
  useEffect(() => {
    const params: TransactionQueryParams = {
      page: 1,
      page_size: 20,
      type: selectedTypes.length > 0 ? selectedTypes[0] : undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
      startTime: dateRange ? dateRange.from.toISOString() : undefined,
      endTime: dateRange ? dateRange.to.toISOString() : undefined,
    }

    fetchTransactions(params)
  }, [fetchTransactions, dateRange, selectedTypes, selectedStatuses])

  // 当initialType改变时，更新筛选状态
  useEffect(() => {
    if (initialType) {
      setSelectedTypes([initialType])
    } else {
      setSelectedTypes([])
    }
  }, [initialType])


  const filteredTransactions = transactions

  // 加载更多
  const handleLoadMore = () => {
    loadMore()
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-2">
        <TableFilter
          enabledFilters={{
            type: initialType === undefined,
            status: true,
            timeRange: true
          }}
          selectedTypes={selectedTypes}
          selectedStatuses={selectedStatuses}
          selectedTimeRange={dateRange}
          selectedQuickSelection={selectedQuickSelection}
          onTypeChange={setSelectedTypes}
          onStatusChange={setSelectedStatuses}
          onTimeRangeChange={setDateRange}
          onQuickSelectionChange={setSelectedQuickSelection}
          onClearAll={clearAllFilters}
        />

        {loading && transactions.length === 0 && (
          <EmptyStateWithBorder
            icon={ListRestart}
            description="数据加载中"
            loading={true}
          />
        )}

        {error && (
          <div className="p-8 border-2 border-dashed border-border rounded-lg">
            <ErrorInline
              error={error}
              onRetry={() => fetchTransactions({ page: 1 })}
              className="justify-center"
            />
          </div>
        )}

        {!loading && !error && (
          <>
            {!transactions || transactions.length === 0 ? (
              <EmptyStateWithBorder
                icon={Layers}
                description="未发现活动"
              />
            ) : filteredTransactions.length === 0 ? (
              <EmptyStateWithBorder
                icon={Layers}
                description="暂无符合条件的交易记录"
              />
            ) : (
              <>
                <div className="bg-muted rounded-lg overflow-hidden">
                  <div className="overflow-x-auto p-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap w-[180px]">名称</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[80px]">类型</TableHead>
                          <TableHead className="whitespace-nowrap text-right w-[120px]">金额</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[140px]">交易双方</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[160px]">订单号</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[160px]">商户订单号</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[120px]">交易时间</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[120px]">创建时间</TableHead>
                          <TableHead className="whitespace-nowrap text-center w-[80px]">状态</TableHead>
                          <TableHead className="sticky right-0 whitespace-nowrap text-center bg-muted shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] w-[150px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="animate-in fade-in duration-200">
                        {filteredTransactions.map((order) => (
                          <TransactionTableRow key={order.order_no} order={order} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {currentPage < totalPages && (
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? '加载中...' : `加载更多 (${filteredTransactions.length}/${total})`}
                  </Button>
                )}

                {currentPage >= totalPages && total > 0 && (
                  <div className="pt-2 text-center text-xs text-muted-foreground">
                    已加载全部 {total} 条记录
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * 交易表格行组件
 */
function TransactionTableRow({ order }: { order: Order }) {
  const getAmountDisplay = (amount: string) => {
    return (
      <span className="text-xs font-semibold">
        {parseFloat(amount).toFixed(2)}
      </span>
    )
  }

  // 格式化时间
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return timeStr
    }
  }

  return (
    <TableRow className="h-8">
      <TableCell className="text-xs font-medium whitespace-nowrap py-1">
        {order.order_name}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center py-1">
        <Badge
          variant="secondary"
          className={`text-[11px] px-1 ${typeConfig[order.type].color}`}
        >
          {typeConfig[order.type].label}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap text-right py-1">
        {getAmountDisplay(order.amount)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center py-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center cursor-pointer gap-1 justify-center">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                    {order.payer_username.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs font-bold">⭢</div>
                <Avatar className="h-4 w-4">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                    {order.payee_username.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold">付款方</p>
                  <p className="text-xs">账户: {order.payer_username}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">收款方</p>
                  <p className="text-xs">账户: {order.payee_username}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="font-mono text-xs text-center py-1">
        {order.order_no}
      </TableCell>
      <TableCell className="font-mono text-xs text-center py-1">
        {order.merchant_order_no || '-'}
      </TableCell>
      <TableCell className="text-xs text-center py-1">
        {formatTime(order.trade_time)}
      </TableCell>
      <TableCell className="text-xs text-center py-1">
        {formatTime(order.created_at)}
      </TableCell>
      <TableCell className="whitespace-nowrap text-center py-1">
        <Badge
          variant="secondary"
          className={`text-[11px] px-1 ${statusConfig[order.status].color}`}
        >
          {statusConfig[order.status].label}
        </Badge>
      </TableCell>
      <TableCell className="sticky right-0 whitespace-nowrap text-center bg-muted shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] py-1">
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          详情
        </Button>
      </TableCell>
    </TableRow>
  )
}

