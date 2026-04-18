"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMedicineStore } from "@/lib/medicine-store"
import { Heart, ArrowRight, User, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { setUserName, setLanguage, language } = useMedicineStore()
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")

  const handleNameSubmit = () => {
    if (name.trim()) {
      setUserName(name.trim())
      setStep(2)
    }
  }

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang)
    onComplete()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">MediMind</h1>
          <p className="text-muted-foreground">Your caring medication companion</p>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">What&apos;s your name?</h2>
              <p className="text-sm text-muted-foreground">We&apos;ll use this to personalize your experience</p>
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-14 pl-12 text-lg bg-card border-2 border-border focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
            </div>

            <Button
              onClick={handleNameSubmit}
              disabled={!name.trim()}
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Language */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome, {name}! 👋
              </h2>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleLanguageSelect('en')}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                  language === 'en'
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">English</p>
                  <p className="text-sm text-muted-foreground">Continue in English</p>
                </div>
              </button>

              <button
                onClick={() => handleLanguageSelect('hi')}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                  language === 'hi'
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-xl">
                  🇮🇳
                </div>
                <div>
                  <p className="font-semibold text-foreground">हिंदी</p>
                  <p className="text-sm text-muted-foreground">Continue in Hindi</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                s === step ? "w-6 bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
