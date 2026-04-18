"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SplashScreen() {
  const { navigateTo, isOnboarded } = useMindMateStore()
  
  const handleGetStarted = () => {
    if (isOnboarded) {
      navigateTo('dashboard')
    } else {
      navigateTo('onboarding')
    }
  }
  
  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 animate-float border-2 border-white/30 overflow-hidden">
        <Image
          src="/mindmate-logo.png"
          alt="Mind Mate Logo"
          width={160}
          height={160}
          className="rounded-full object-contain"
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-3 tracking-tight">Mind Mate</h1>
      <p className="text-lg opacity-90 mb-12 max-w-[280px]">
        Your private space for mental wellness. No judgment, just support.
      </p>
      
      <Button
        onClick={handleGetStarted}
        className="bg-white text-primary hover:bg-white/90 shadow-lg px-10 py-6 text-lg font-semibold rounded-full"
      >
        Get Started
      </Button>
      
      <p className="absolute bottom-8 left-6 right-6 text-xs opacity-70 leading-relaxed">
        Mind Mate is a self-care companion, not a substitute for professional mental health support. 
        If you are in crisis, please call 988.
      </p>
    </div>
  )
}
