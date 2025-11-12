"use client"

import * as React from "react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OrderType } from "@/lib/services"
import { Receive } from "./receive"
import { Payment } from "./payment"
import { Transfer } from "./transfer"
import { Community } from "./community"
import { AllActivity } from "./all-activity"
import { TradeTable } from "./trade-table"
import { TransactionProvider } from "@/contexts/transaction-context"

const TAB_TRIGGER_STYLES = "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] bg-transparent rounded-none border-0 border-b-2 border-transparent px-0 text-sm font-bold text-muted-foreground data-[state=active]:text-[#6366f1] -mb-[2px] relative hover:text-foreground transition-colors flex-none"

type TabValue = 'receive' | 'payment' | 'transfer' | 'community' | 'all'

export function TradeMain() {
  const [activeTab, setActiveTab] = useState<TabValue>('receive')

  const getOrderType = (tab: TabValue): OrderType | undefined => {
    if (tab === 'all') return undefined
    return tab as OrderType
  }

  const renderPageContent = () => {
    switch (activeTab) {
      case 'receive':
        return <Receive />
      case 'payment':
        return <Payment />
      case 'transfer':
        return <Transfer />
      case 'community':
        return <Community />
      case 'all':
        return <AllActivity />
      default:
        return null
    }
  }

  return (
    <TransactionProvider defaultParams={{ page_size: 20 }}>
      <div className="py-6">
        <h1 className="pb-2 text-2xl font-semibold">交易</h1>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <div>
            <TabsList className="w-full">
              <TabsTrigger value="receive" className={TAB_TRIGGER_STYLES}>收款</TabsTrigger>
              <TabsTrigger value="payment" className={TAB_TRIGGER_STYLES}>付款</TabsTrigger>
              <TabsTrigger value="transfer" className={TAB_TRIGGER_STYLES}>转账</TabsTrigger>
              <TabsTrigger value="community" className={TAB_TRIGGER_STYLES}>社区划转</TabsTrigger>
              <TabsTrigger value="all" className={TAB_TRIGGER_STYLES}>所有活动</TabsTrigger>
            </TabsList>
          </div>

          <div className="pt-2">{renderPageContent()}</div>

          <div className="font-semibold pt-6 pb-2">交易记录</div>
          <TradeTable type={getOrderType(activeTab)} />
        </Tabs>
      </div>
    </TransactionProvider>
  )
}

