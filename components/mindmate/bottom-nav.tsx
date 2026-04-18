"use client"

import { useMindMateStore, Screen } from "@/lib/mindmate-store"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: string
  label: string
  screen: Screen
}

const navItems: NavItem[] = [
  { icon: "🏠", label: "Home", screen: "dashboard" },
  { icon: "📋", label: "Reports", screen: "reports" },
  { icon: "💊", label: "Medicines", screen: "medicines" },
  { icon: "📊", label: "Insights", screen: "insights" },
  { icon: "💚", label: "Help", screen: "resources" },
]

export function BottomNav() {
  const { currentScreen, navigateTo } = useMindMateStore()
  
  return (
    <nav className="flex justify-around py-3 px-4 bg-card border-t border-border sticky bottom-0">
      {navItems.map((item) => (
        <button
          key={item.screen}
          onClick={() => navigateTo(item.screen)}
          className={cn(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            currentScreen === item.screen 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <span className="text-[22px]">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
