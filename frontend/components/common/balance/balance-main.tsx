"use client"

import * as React from "react"
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number"
import { BalanceReport } from "@/components/common/balance/balance-report"
import { BalanceSummary } from "@/components/common/balance/balance-summary"
import { BalanceTable } from "@/components/common/balance/balance-table"
import { useUser } from "@/contexts/user-context"

/**
 * 余额主页面组件
 * 
 * 负责组装余额页面的各个子组件,包括余额总览、余额摘要、近期活动和报告侧边栏
 */
export function BalanceMain() {
  const { user, loading } = useUser()

  // 计算总余额
  const totalBalance = React.useMemo(() => {
    return (user?.available_balance ?? 0) + (user?.community_balance ?? 0)
  }, [user?.available_balance, user?.community_balance])

  return (
    <div className="py-6">
      {/* 页面标题和总余额 */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <h1 className="text-2xl">
          <span className="font-semibold">余额</span>
          <span className="pl-2">LDC</span>
          <span className="pl-2">
            {loading ? "-" : <CountingNumber number={totalBalance} decimalPlaces={2} />}
          </span>
        </h1>
      </div>

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pt-4">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-3 space-y-12">
          {/* 余额摘要 */}
          <section>
            <div className="font-semibold mb-4">余额摘要</div>
            <BalanceSummary />
          </section>

          {/* 近期活动 */}
          <section>
            <div className="font-semibold mb-4">近期活动</div>
            <BalanceTable />
          </section>
        </div>

        {/* 右侧报告栏 */}
        <aside className="lg:col-span-1">
          <BalanceReport />
        </aside>
      </div>
    </div>
  )
}
