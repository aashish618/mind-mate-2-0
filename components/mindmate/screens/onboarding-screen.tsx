"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function OnboardingScreen() {
  const { 
    onboardingStep, 
    setOnboardingStep, 
    privacyMode, 
    setPrivacyMode,
    checkInTime,
    setCheckInTime,
    completeOnboarding,
    loadSampleMedicines
  } = useMindMateStore()
  
  const nextStep = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1)
    }
  }
  
  const prevStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1)
    }
  }
  
  const handleComplete = () => {
    loadSampleMedicines()
    completeOnboarding()
  }
  
  return (
    <div className="min-h-screen gradient-calm p-8 pt-16 flex flex-col">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={cn(
              "h-2 rounded-full transition-all",
              step === onboardingStep 
                ? "w-6 bg-white" 
                : "w-2 bg-white/40"
            )}
          />
        ))}
      </div>
      
      {/* Card */}
      <div className="flex-1 bg-gradient-to-br from-white/95 to-background/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 flex flex-col">
        {/* Step 1: Privacy */}
        {onboardingStep === 1 && (
          <>
            <div className="w-20 h-20 gradient-primary rounded-xl flex items-center justify-center mb-6 text-4xl text-white">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Your Privacy Matters</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Everything you share stays on your device. Choose how you want to use MindMate.
            </p>
            
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setPrivacyMode('anonymous')}
                className={cn(
                  "flex items-center gap-4 p-4 bg-card border-2 rounded-xl transition-all",
                  privacyMode === 'anonymous' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                  privacyMode === 'anonymous' ? "bg-primary/10" : "bg-muted"
                )}>
                  👤
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Anonymous Mode</div>
                  <div className="text-sm text-muted-foreground">No name, no tracking, just support</div>
                </div>
              </button>
              
              <button
                onClick={() => setPrivacyMode('personalized')}
                className={cn(
                  "flex items-center gap-4 p-4 bg-card border-2 rounded-xl transition-all",
                  privacyMode === 'personalized' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                  privacyMode === 'personalized' ? "bg-primary/10" : "bg-muted"
                )}>
                  ✨
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Personalized</div>
                  <div className="text-sm text-muted-foreground">Add a nickname for a personal touch</div>
                </div>
              </button>
            </div>
            
            <div className="mt-auto">
              <Button onClick={nextStep} className="w-full gradient-primary text-white rounded-full py-6">
                Continue
              </Button>
            </div>
          </>
        )}
        
        {/* Step 2: Check-in Time */}
        {onboardingStep === 2 && (
          <>
            <div className="w-20 h-20 gradient-primary rounded-xl flex items-center justify-center mb-6 text-4xl text-white">
              ⏰
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">When Should We Check In?</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We will send a gentle reminder to help you build a daily wellness habit.
            </p>
            
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setCheckInTime('morning')}
                className={cn(
                  "flex items-center gap-4 p-4 bg-card border-2 rounded-xl transition-all",
                  checkInTime === 'morning' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                  checkInTime === 'morning' ? "bg-primary/10" : "bg-muted"
                )}>
                  🌅
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Morning</div>
                  <div className="text-sm text-muted-foreground">Start your day with intention</div>
                </div>
              </button>
              
              <button
                onClick={() => setCheckInTime('evening')}
                className={cn(
                  "flex items-center gap-4 p-4 bg-card border-2 rounded-xl transition-all",
                  checkInTime === 'evening' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                  checkInTime === 'evening' ? "bg-primary/10" : "bg-muted"
                )}>
                  🌙
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Evening</div>
                  <div className="text-sm text-muted-foreground">Reflect before winding down</div>
                </div>
              </button>
            </div>
            
            <div className="mt-auto flex gap-3">
              <Button onClick={prevStep} variant="outline" className="flex-1 rounded-full py-6">
                Back
              </Button>
              <Button onClick={nextStep} className="flex-1 gradient-primary text-white rounded-full py-6">
                Continue
              </Button>
            </div>
          </>
        )}
        
        {/* Step 3: Features */}
        {onboardingStep === 3 && (
          <>
            <div className="w-20 h-20 gradient-primary rounded-xl flex items-center justify-center mb-6 text-4xl text-white">
              💜
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">You are All Set!</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Here is what MindMate offers:
            </p>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Daily Check-Ins</div>
                  <div className="text-sm text-muted-foreground">Track your mood in seconds</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                  💊
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Medicine Tracking</div>
                  <div className="text-sm text-muted-foreground">Never miss a dose again</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                  🧘
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Coping Tools</div>
                  <div className="text-sm text-muted-foreground">Breathing, grounding & more</div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex gap-3">
              <Button onClick={prevStep} variant="outline" className="flex-1 rounded-full py-6">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1 gradient-primary text-white rounded-full py-6">
                Let&apos;s Go!
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
