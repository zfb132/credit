import { Suspense } from 'react'
import { PayingOnline } from '@/components/pay/paying/paying-online'

export default function PayingOnlinePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    }>
      <PayingOnline />
    </Suspense>
  )
}
