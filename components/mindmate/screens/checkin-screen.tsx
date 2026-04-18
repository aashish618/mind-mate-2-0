"use client"

import { useState } from "react"
import { useMindMateStore, Mood, moodEmojis } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const moods: { value: Mood; label: string }[] = [
  { value: 'great', label: 'Great' },
  { value: 'good', label: 'Good' },
  { value: 'okay', label: 'Okay' },
  { value: 'low', label: 'Low' },
  { value: 'rough', label: 'Rough' },
]

export function CheckInScreen() {
  const { navigateTo, addCheckIn } = useMindMateStore()
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [energy, setEnergy] = useState(50)
  const [note, setNote] = useState('')
  
  const handleSubmit = () => {
    if (selectedMood) {
      addCheckIn({ mood: selectedMood, energy, note: note.trim() || undefined })
      navigateTo('checkin-success')
    }
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-muted/80 transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-foreground">Daily Check-In</h1>
      </header>
      
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-8">
        {/* Mood Selection */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">
            How are you feeling right now?
          </h2>
          <div className="flex justify-center gap-3 flex-wrap">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                  selectedMood === mood.value 
                    ? "bg-primary/10 border-primary scale-105 shadow-lg" 
                    : "bg-card border-border hover:border-primary/50"
                )}
              >
                <span className={cn(
                  "text-4xl transition-transform",
                  selectedMood === mood.value && "scale-125"
                )}>
                  {moodEmojis[mood.value]}
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  selectedMood === mood.value ? "text-primary" : "text-muted-foreground"
                )}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Energy Level */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">
            Energy Level
          </h2>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="flex justify-between mb-3 text-sm text-muted-foreground">
              <span>Low</span>
              <span className="font-semibold text-primary text-lg">{energy}%</span>
              <span>High</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Note */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h2 className="text-lg font-bold text-foreground mb-3">
            Anything on your mind? <span className="font-normal text-muted-foreground">(optional)</span>
          </h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write here..."
            className="w-full h-28 p-4 rounded-2xl border border-border bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        {/* Submit */}
        <div className="mt-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="w-full gradient-primary text-white rounded-full py-6 text-lg font-semibold disabled:opacity-50"
          >
            Save Check-In
          </Button>
        </div>
      </div>
    </div>
  )
}
