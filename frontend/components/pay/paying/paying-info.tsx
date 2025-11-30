import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown } from "@/components/animate-ui/icons/chevron-down"
import { ShoppingBag } from "lucide-react"

import type { GetMerchantOrderResponse } from "@/lib/services"


/**
 * 加载中骨架组件
 * 显示订单信息加载中的骨架
 * 
 * @returns {JSX.Element} 加载中骨架组件
 */
function LoadingSkeleton() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-4 w-64 mb-2 bg-white/10" />
        <Skeleton className="h-8 w-32 bg-white/10" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between py-3 border-b border-white/10">
          <div className="flex flex-col items-start space-y-1.5">
            <Skeleton className="h-3.5 w-24 bg-white/10" />
            <Skeleton className="h-3 w-16 bg-white/10" />
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <Skeleton className="h-3.5 w-20 bg-white/10" />
            <Skeleton className="h-3 w-24 bg-white/10" />
          </div>
        </div>

        <Skeleton className="h-3.5 w-32 bg-white/10" />

        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <Skeleton className="h-5 w-20 bg-white/10" />
          <Skeleton className="h-5 w-24 bg-white/10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="h-2.5 w-full bg-white/10" />
          <Skeleton className="h-2.5 w-3/4 bg-white/10" />
        </div>
      </div>
    </>
  )
}

/**
 * 订单信息组件
 * 显示订单信息
 * 
 * @param {GetMerchantOrderResponse} orderInfo - 订单信息
 * @returns {JSX.Element} 订单信息组件
 */
function OrderContent({ orderInfo }: { orderInfo: GetMerchantOrderResponse }) {
  const amount = parseFloat(orderInfo.order.amount).toFixed(2)
  const feeRate = (parseFloat(orderInfo.user_pay_config.fee_rate) * 100).toFixed(2)

  return (
    <>
      <div className="mb-6">
        <p className="text-neutral-400 text-xs mb-1.5">
          向 {orderInfo.merchant.app_name} ({orderInfo.order.payee_username}) 支付
        </p>
        <h1 className="text-3xl font-bold text-white tracking-tight">LDC {amount}</h1>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between py-3 border-b border-white/10">
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium text-neutral-200 mb-0.5">{orderInfo.order.order_name}</p>
            <p className="text-neutral-500 text-[10px]">数量: 1</p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-medium text-neutral-200 mb-0.5">LDC {amount}</p>
            <p className="text-neutral-500 text-[10px]">LDC {amount} 每个</p>
          </div>
        </div>

        <button className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
          <span>添加促销码</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-neutral-400">暂未开放</span>
        </button>

        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <p className="text-xl font-bold text-white">应付合计</p>
          <p className="text-xl font-bold text-white">LDC {amount}</p>
        </div>

        <p className="text-[10px] text-neutral-500 space-y-0.5 leading-relaxed">
          手续费率: {feeRate}%
          <br />
          手续费率会根据商家支付等级动态调整，并不会增加您的支付金额，仅对商家收取手续费，手续费将直接从商家账户扣除。
        </p>
      </div>
    </>
  )
}

/**
 * 滚动提示组件
 * 显示滚动提示
 * 
 * @returns {JSX.Element} 滚动提示组件
 */
function ScrollHint() {
  return (
    <div className="flex flex-col items-center justify-center py-3 mt-8 space-y-1 md:hidden">
      <div className="text-[10px] text-neutral-500">
        下滑继续支付
      </div>
      <ChevronDown
        size={14}
        className="text-neutral-500 animate-bounce duration-1000"
      />
    </div>
  )
}

/**
 * 支付信息组件
 * 显示支付信息
 * 
 * @param {GetMerchantOrderResponse} orderInfo - 订单信息
 * @param {boolean} loading - 是否加载中
 * @returns {JSX.Element} 支付信息组件
 */
export function PayingInfo({ orderInfo, loading = false }: { orderInfo: GetMerchantOrderResponse, loading: boolean }) {

  return (
    <div className="flex flex-col w-full md:w-1/2 p-6 md:p-16 pb-8 md:pb-16 items-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-white justify-center min-h-screen md:min-h-0 lg:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm md:max-w-md text-left relative z-10">
        <div className="mb-8">
          <div className="flex items-center">
            {loading ? (
              <>
                <Skeleton className="w-8 h-8 rounded-full mr-3 bg-white/10" />
                <Skeleton className="h-7 w-40 bg-white/10" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg mr-3 shadow-xl">
                  <ShoppingBag className="size-4 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">{orderInfo.merchant.app_name}</span>
              </>
            )}
          </div>
        </div>

        {loading ? <LoadingSkeleton /> : <OrderContent orderInfo={orderInfo} />}

        <ScrollHint />
      </div>
    </div>
  )
}
