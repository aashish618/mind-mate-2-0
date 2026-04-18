"use client"

import { useEffect, useState } from "react"
import { useMedicineStore } from "@/lib/medicine-store"
import { Flame, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const milestones = [
  { days: 7, message: "One week! Your heart thanks you!", icon: Star },
  { days: 30, message: "One month! Doctor would be proud!", icon: Trophy },
  { days: 100, message: "100 days! You are a champion!", icon: Flame },
]

export function StreakBanner() {
  const { streak, calculateStreak, medicines, doseLogs } = useMedicineStore()
  const [animatedStreak, setAnimatedStreak] = useState(0)

  useEffect(() => {
    calculateStreak()
  }, [medicines, doseLogs, calculateStreak])

  useEffect(() => {
    if (animatedStreak < streak) {
      const timer = setTimeout(() => {
        setAnimatedStreak((prev) => Math.min(prev + 1, streak))
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [animatedStreak, streak])

  const currentMilestone = milestones.findLast((m) => streak >= m.days)
  const nextMilestone = milestones.find((m) => streak < m.days)

  if (streak === 0) {
    return (
      <div className="bg-secondary/50 rounded-2xl p-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
          <Flame className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          Take all your medicines today to start your streak!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center",
            streak >= 7 ? "bg-accent text-accent-foreground" : "bg-primary/20 text-primary"
          )}>
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{animatedStreak}</span>
              <span className="text-lg text-muted-foreground">day streak</span>
            </div>
            {currentMilestone && (
              <p className="text-sm text-accent font-medium mt-1">
                {currentMilestone.message}
              </p>
            )}
          </div>
        </div>

        {nextMilestone && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Next milestone</p>
            <p className="text-lg font-semibold text-foreground">{nextMilestone.days} days</p>
            <p className="text-xs text-muted-foreground">{nextMilestone.days - streak} to go</p>
          </div>
        )}
      </div>
    </div>
  )
}
