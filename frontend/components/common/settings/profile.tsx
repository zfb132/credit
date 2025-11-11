"use client"

import * as React from "react"
import { useUser } from "@/contexts/user-context"
import { PayLevel, User } from "@/lib/services/auth/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface LevelConfig {
  level: PayLevel
  name: string
  nameEn: string
  minScore: number
  maxScore: number | null
  gradient: string
  textColor: string
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: PayLevel.BlackGold,
    name: "黑金会员",
    nameEn: "BLACK MEMBER",
    minScore: 0,
    maxScore: 1999,
    gradient: "from-gray-900 via-gray-800 to-gray-900",
    textColor: "text-white",
  },
  {
    level: PayLevel.WhiteGold,
    name: "白金会员",
    nameEn: "PLATINUM MEMBER",
    minScore: 2000,
    maxScore: 9999,
    gradient: "from-slate-400 via-slate-300 to-slate-400",
    textColor: "text-slate-900",
  },
  {
    level: PayLevel.Gold,
    name: "黄金会员",
    nameEn: "GOLD MEMBER",
    minScore: 10000,
    maxScore: 49999,
    gradient: "from-amber-500 via-yellow-400 to-amber-500",
    textColor: "text-amber-950",
  },
  {
    level: PayLevel.Platinum,
    name: "铂金会员",
    nameEn: "DIAMOND MEMBER",
    minScore: 50000,
    maxScore: null,
    gradient: "from-purple-600 via-pink-500 to-purple-600",
    textColor: "text-white",
  },
]

function getLevelConfig(score: number): LevelConfig {
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (score >= LEVEL_CONFIGS[i].minScore) {
      return LEVEL_CONFIGS[i]
    }
  }
  return LEVEL_CONFIGS[0]
}

function MembershipCard({
  config,
  user,
  score,
  isActive,
}: {
  config: LevelConfig
  user: User
  score: number
  isActive: boolean
}) {
  const isAchieved = score >= config.minScore
  const isDarkCard = config.level === PayLevel.BlackGold || config.level === PayLevel.Platinum

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
      )}
    >
      <div
        className={cn(
          "relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-gradient-to-br",
          config.gradient
        )}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className={cn("relative h-full flex flex-col justify-between p-5", config.textColor)}>
          <div>
            <div className="text-[10px] font-medium opacity-70 tracking-wider">
              {config.nameEn}
            </div>
            <div className="text-lg font-bold tracking-tight">
              {config.name}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] opacity-70 tracking-wide">会员积分</div>
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="text-[10px] opacity-70">
              LINUX DO <span className="italic font-serif">PAY</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] opacity-70">等级范围</div>
              <div className="text-[10px] font-medium tabular-nums">
                {config.minScore.toLocaleString()} - {config.maxScore?.toLocaleString() || "∞"}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-5 right-5">
          {config.level === PayLevel.Platinum || isAchieved ? (
            <Avatar className="size-10 border-2 border-white/20">
              <AvatarImage src={user?.avatar_url} alt={user?.nickname} />
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold",
                  isDarkCard ? "bg-white/20 text-white" : "bg-black/20 text-black"
                )}
              >
                {user?.nickname?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div
              className={cn(
                "px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm",
                isDarkCard ? "bg-white/20 text-white" : "bg-black/20 text-black"
              )}
            >
              未获得
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProfileMain() {
  const { user, loading, getTrustLevelLabel } = useUser()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const score = user?.pay_score ?? 0
  const currentLevel = getLevelConfig(score)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  React.useEffect(() => {
    if (user && api) {
      const currentLevelIndex = LEVEL_CONFIGS.findIndex(
        (config) => config.level === currentLevel.level
      )
      api.scrollTo(currentLevelIndex, false)
    }
  }, [user, currentLevel.level, api])

  if (loading) {
    return (
      <div className="py-6 space-y-4">
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-semibold">个人资料</h1>
        </div>
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="py-6 space-y-4">
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-semibold">个人资料</h1>
        </div>
        <div className="text-sm text-muted-foreground">未找到用户信息</div>
      </div>
    )
  }

  return (
    <div className="py-6 space-y-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold">个人资料</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold">会员信息</h2>
        
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: false,
            containScroll: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {LEVEL_CONFIGS.map((config, index) => (
              <CarouselItem key={config.level} className="pl-4 basis-[85%] sm:basis-[70%] md:basis-[70%] lg:basis-[50%]">
                <MembershipCard
                  config={config}
                  user={user}
                  score={score}
                  isActive={index === current}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>

      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold">基本信息</h2>
        
        <div className="flex items-start gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.avatar_url} alt={user.nickname} />
            <AvatarFallback className="text-xl">
              {user.nickname.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">昵称</div>
                <div className="text-sm font-medium">{user.nickname}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">用户名</div>
                <div className="text-sm font-medium">@{user.username}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">用户ID</div>
                <div className="text-sm font-medium">{user.id}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">信任等级</div>
                <div className="text-sm font-medium">{getTrustLevelLabel(user.trust_level)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
