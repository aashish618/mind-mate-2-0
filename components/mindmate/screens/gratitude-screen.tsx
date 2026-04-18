"use client"

import { useState } from "react"
import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"

export function GratitudeScreen() {
  const { navigateTo, addGratitude, gratitudeEntries } = useMindMateStore()
  const [items, setItems] = useState(['', '', ''])
  const [showHistory, setShowHistory] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const handleChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }
  
  const handleSave = () => {
    const validItems = items.filter(i => i.trim())
    if (validItems.length > 0) {
      addGratitude(validItems)
      setIsSaved(true)
    }
  }
  
  const reset = () => {
    setItems(['', '', ''])
    setIsSaved(false)
  }
  
  if (isSaved) {
    return (
      <div className="min-h-screen gradient-gratitude flex flex-col items-center justify-center p-8 text-white text-center">
        <div className="bg-white/95 rounded-3xl p-10 shadow-xl max-w-sm w-full animate-scale-in">
          <div className="text-6xl mb-6">💛</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Beautiful!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Gratitude helps rewire your brain for positivity. Come back tomorrow to continue building this habit.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full gradient-primary text-white rounded-full py-6"
            >
              Add More
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
  
  if (showHistory) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
          <button 
            onClick={() => setShowHistory(false)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-foreground">Gratitude History</h1>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {gratitudeEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-muted-foreground">No entries yet. Start writing!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {gratitudeEntries.map((entry, idx) => (
                <div key={idx} className="bg-card rounded-xl p-5 border border-border">
                  <div className="text-xs text-muted-foreground mb-3">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <ul className="space-y-2">
                    {entry.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground">
                        <span className="text-primary">💛</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen gradient-gratitude flex flex-col text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigateTo('toolbox')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">Gratitude Journal</h1>
        <button 
          onClick={() => setShowHistory(true)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg"
        >
          📜
        </button>
      </header>
      
      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className="text-center mb-8 animate-in fade-in">
          <div className="text-5xl mb-4">💛</div>
          <h2 className="text-2xl font-bold mb-2">What are you grateful for?</h2>
          <p className="opacity-80">Write 3 things, big or small</p>
        </div>
        
        <div className="flex flex-col gap-4 mb-8">
          {items.map((item, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <span className="text-sm opacity-80">
                  {idx === 0 ? 'Something that made you smile' : idx === 1 ? 'Someone you appreciate' : 'A small joy today'}
                </span>
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder="Write here..."
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-auto">
          <Button
            onClick={handleSave}
            disabled={items.every(i => !i.trim())}
            className="w-full bg-white text-foreground hover:bg-white/90 rounded-full py-6 text-lg font-semibold disabled:opacity-50"
          >
            Save Gratitude
          </Button>
        </div>
      </div>
    </div>
  )
}
