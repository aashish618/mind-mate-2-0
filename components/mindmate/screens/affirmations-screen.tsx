"use client"

import { useState, useEffect } from "react"
import { useMindMateStore, affirmations } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AffirmationsScreen() {
  const { navigateTo } = useMindMateStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  
  const currentAffirmation = affirmations[currentIndex]
  
  const nextAffirmation = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % affirmations.length)
      setIsAnimating(false)
    }, 300)
  }
  
  const prevAffirmation = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length)
      setIsAnimating(false)
    }, 300)
  }
  
  const toggleFavorite = () => {
    if (favorites.includes(currentIndex)) {
      setFavorites(favorites.filter(i => i !== currentIndex))
    } else {
      setFavorites([...favorites, currentIndex])
    }
  }
  
  const isFavorite = favorites.includes(currentIndex)
  
  // Auto-advance every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextAffirmation()
    }, 10000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="min-h-screen gradient-affirmations flex flex-col text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigateTo('toolbox')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">Daily Affirmations</h1>
        <div className="w-10" />
      </header>
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 px-4 py-2">
        {affirmations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === currentIndex ? "w-6 bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div 
          className={cn(
            "text-center transition-all duration-300",
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
        >
          <div className="text-5xl mb-8 animate-pulse-gentle">✨</div>
          <p className="text-2xl font-medium leading-relaxed mb-8 max-w-sm">
            &ldquo;{currentAffirmation}&rdquo;
          </p>
          
          <button
            onClick={toggleFavorite}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all",
              isFavorite ? "bg-white text-primary" : "bg-white/10 hover:bg-white/20"
            )}
          >
            {isFavorite ? '💛' : '🤍'}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="p-6 pb-12">
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={prevAffirmation}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextAffirmation}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
          >
            →
          </button>
        </div>
        
        <p className="text-center text-sm opacity-60 mb-4">
          {currentIndex + 1} of {affirmations.length}
        </p>
        
        <Button
          onClick={() => navigateTo('dashboard')}
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/10 rounded-full py-6"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}
