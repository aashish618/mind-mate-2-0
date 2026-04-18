"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top section - brand */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8">

        {/* Logo mark */}
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-lg">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 6C20 6 8 10 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M14 20H26M20 14V26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3 text-balance text-center">
          Your health, made simple
        </h1>
        <p className="text-base text-muted-foreground text-center max-w-[260px] leading-relaxed">
          Upload your medical reports and we explain what every number means in plain language.
        </p>

        {/* Mini preview of what the app does */}
        <div className="mt-10 w-full max-w-[300px] space-y-3">
          {[
            { color: "bg-success", label: "Hemoglobin", status: "Normal", value: "14.2 g/dL" },
            { color: "bg-warning", label: "Cholesterol", status: "Monitor", value: "215 mg/dL" },
            { color: "bg-destructive", label: "Vitamin D", status: "Low", value: "18 ng/mL" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm"
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.value}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                ${item.color === 'bg-success' ? 'bg-success/10 text-success' : 
                  item.color === 'bg-warning' ? 'bg-warning/15 text-warning-foreground' : 
                  'bg-destructive/10 text-destructive'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-8 pb-10 space-y-3">
        <Button
          onClick={handleGetStarted}
          className="w-full py-6 text-base font-semibold rounded-2xl gradient-primary text-white shadow-lg"
        >
          Get Started
        </Button>
        <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
          Not a substitute for professional medical advice.
          If you are in crisis, call 988.
        </p>
      </div>
    </div>
  )
}
