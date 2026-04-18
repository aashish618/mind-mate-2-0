"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"

export function CheckInSuccessScreen() {
  const { navigateTo, streak } = useMindMateStore()
  
  return (
    <div className="min-h-screen gradient-calm flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white/95 rounded-3xl p-10 shadow-xl border border-white/50 max-w-sm w-full animate-scale-in">
        <div className="text-7xl mb-6 animate-pulse-gentle">🎉</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Way to Go!</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          You just checked in with yourself. That takes courage!
        </p>
        
        <div className="bg-muted rounded-2xl p-6 mb-8">
          <div className="text-5xl font-bold text-primary">{streak}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
            Day Streak 🔥
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigateTo('toolbox')}
            className="w-full gradient-primary text-white rounded-full py-6"
          >
            Explore Coping Tools
          </Button>
          <Button
            onClick={() => navigateTo('dashboard')}
            variant="outline"
            className="w-full rounded-full py-6"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
