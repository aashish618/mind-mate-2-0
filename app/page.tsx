"use client"

import { useEffect, useState } from "react"
import { useMindMateStore } from "@/lib/mindmate-store"

// Screen Components
import { SplashScreen } from "@/components/mindmate/screens/splash-screen"
import { OnboardingScreen } from "@/components/mindmate/screens/onboarding-screen"
import { DashboardScreen } from "@/components/mindmate/screens/dashboard-screen"
import { CheckInScreen } from "@/components/mindmate/screens/checkin-screen"
import { CheckInSuccessScreen } from "@/components/mindmate/screens/checkin-success-screen"
import { MedicinesScreen } from "@/components/mindmate/screens/medicines-screen"
import { CalendarScreen } from "@/components/mindmate/screens/calendar-screen"
import { ToolboxScreen } from "@/components/mindmate/screens/toolbox-screen"
import { BreathingScreen } from "@/components/mindmate/screens/breathing-screen"
import { GroundingScreen } from "@/components/mindmate/screens/grounding-screen"
import { GratitudeScreen } from "@/components/mindmate/screens/gratitude-screen"
import { AffirmationsScreen } from "@/components/mindmate/screens/affirmations-screen"
import { InsightsScreen } from "@/components/mindmate/screens/insights-screen"
import { ResourcesScreen } from "@/components/mindmate/screens/resources-screen"

export default function MindMateApp() {
  const { currentScreen, isOnboarded, navigateTo } = useMindMateStore()
  const [mounted, setMounted] = useState(false)
  
  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Auto-navigate based on onboarding status
  useEffect(() => {
    if (mounted && currentScreen === 'splash') {
      const timer = setTimeout(() => {
        if (isOnboarded) {
          navigateTo('dashboard')
        }
      }, 2000) // Show splash for 2 seconds
      return () => clearTimeout(timer)
    }
  }, [mounted, currentScreen, isOnboarded, navigateTo])
  
  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center text-4xl animate-pulse">
            🧠
          </div>
          <p className="text-lg opacity-80">Loading...</p>
        </div>
      </div>
    )
  }
  
  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />
      case 'onboarding':
        return <OnboardingScreen />
      case 'dashboard':
        return <DashboardScreen />
      case 'checkin':
        return <CheckInScreen />
      case 'checkin-success':
        return <CheckInSuccessScreen />
      case 'medicines':
        return <MedicinesScreen />
      case 'calendar':
        return <CalendarScreen />
      case 'toolbox':
        return <ToolboxScreen />
      case 'breathing':
        return <BreathingScreen />
      case 'grounding':
        return <GroundingScreen />
      case 'gratitude':
        return <GratitudeScreen />
      case 'affirmations':
        return <AffirmationsScreen />
      case 'insights':
        return <InsightsScreen />
      case 'resources':
        return <ResourcesScreen />
      default:
        return <DashboardScreen />
    }
  }
  
  return (
    <div className="app-container bg-background">
      {renderScreen()}
    </div>
  )
}
