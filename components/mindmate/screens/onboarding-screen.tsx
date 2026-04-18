"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4C16 4 6 8 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11 16H21M16 11V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    heading: "Understand your reports",
    subheading: "No medical degree needed",
    description: "Upload any blood test, lipid panel, thyroid report — we read it and explain every value in simple words.",
    visual: [
      { dot: "bg-destructive", label: "Vitamin D is low. Get 20 min of morning sunlight.", color: "text-destructive" },
      { dot: "bg-warning", label: "Cholesterol slightly high. Reduce fried food.", color: "text-warning-foreground" },
      { dot: "bg-success", label: "Blood sugar is normal. Keep it up!", color: "text-success" },
    ],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 12H28" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 4V8M22 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 18H16M10 22H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    heading: "Track over time",
    subheading: "See your trends, not just one test",
    description: "Add multiple reports and we show you if things are getting better or worse — like a health diary.",
    visual: null,
    trackVisual: true,
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L19.09 11.26L27 12.27L21.5 17.64L22.91 25.52L16 21.77L9.09 25.52L10.5 17.64L5 12.27L12.91 11.26L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    heading: "You are in control",
    subheading: "Private. Yours. Always.",
    description: "Your data stays on your device. Nothing is shared or sold. You can delete everything at any time.",
    visual: null,
    privacyVisual: true,
  },
]

export function OnboardingScreen() {
  const {
    onboardingStep,
    setOnboardingStep,
    completeOnboarding,
    loadSampleMedicines,
  } = useMindMateStore()

  const stepIndex = onboardingStep - 1
  const step = STEPS[stepIndex]
  const isLast = onboardingStep === STEPS.length

  const next = () => {
    if (!isLast) setOnboardingStep(onboardingStep + 1)
  }
  const prev = () => {
    if (onboardingStep > 1) setOnboardingStep(onboardingStep - 1)
  }
  const finish = () => {
    loadSampleMedicines()
    completeOnboarding()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-14 pb-10">

      {/* Step dots */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === stepIndex ? "w-8 bg-primary" : i < stepIndex ? "w-4 bg-primary/40" : "w-4 bg-border"
            )}
          />
        ))}
      </div>

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
        {step.icon}
      </div>

      {/* Text */}
      <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
        {step.subheading}
      </p>
      <h2 className="text-2xl font-bold text-foreground text-balance mb-3 leading-tight">
        {step.heading}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        {step.description}
      </p>

      {/* Visual for step 1 — report preview */}
      {step.visual && (
        <div className="flex-1 space-y-3">
          {step.visual.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${item.dot}`} />
              <p className={`text-sm font-medium ${item.color}`}>{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Visual for step 2 — track over time */}
      {step.trackVisual && (
        <div className="flex-1 bg-card border border-border rounded-2xl p-5">
          <p className="text-xs text-muted-foreground mb-4 font-medium">Hemoglobin over time</p>
          <div className="flex items-end gap-2 h-24">
            {[
              { h: 55, label: "Jan", ok: false },
              { h: 65, label: "Feb", ok: false },
              { h: 72, label: "Mar", ok: true },
              { h: 80, label: "Apr", ok: true },
              { h: 90, label: "May", ok: true },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={cn("w-full rounded-t-md transition-all", bar.ok ? "bg-success" : "bg-warning")}
                  style={{ height: `${bar.h}%` }}
                />
                <span className="text-xs text-muted-foreground">{bar.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-success font-medium mt-4">Getting better every month</p>
        </div>
      )}

      {/* Visual for step 3 — privacy */}
      {step.privacyVisual && (
        <div className="flex-1 space-y-3">
          {[
            { icon: "📱", title: "Stays on your phone", desc: "We never upload your data" },
            { icon: "🔒", title: "No account required", desc: "No email, no password needed" },
            { icon: "🗑️", title: "Delete anytime", desc: "One tap clears everything" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        {onboardingStep > 1 && (
          <Button
            onClick={prev}
            variant="outline"
            className="flex-1 py-6 rounded-2xl font-semibold"
          >
            Back
          </Button>
        )}
        <Button
          onClick={isLast ? finish : next}
          className="flex-1 py-6 rounded-2xl font-semibold gradient-primary text-white"
        >
          {isLast ? "Start using the app" : "Continue"}
        </Button>
      </div>
    </div>
  )
}
