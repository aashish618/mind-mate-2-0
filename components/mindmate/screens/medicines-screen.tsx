"use client"

import { useState } from "react"
import { useMindMateStore, Medicine } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const timingLabels: Record<string, { label: string; icon: string }> = {
  morning: { label: 'Morning', icon: '🌅' },
  afternoon: { label: 'Afternoon', icon: '☀️' },
  evening: { label: 'Evening', icon: '🌆' },
  night: { label: 'Night', icon: '🌙' },
}

const categoryColors: Record<string, string> = {
  pain: '#C25450',
  vitamins: '#6B8E23',
  mental: '#8B5A2B',
  antibiotics: '#D4A574',
}

export function MedicinesScreen() {
  const { medicines, navigateTo, doseLogs, logDose, loadSampleMedicines } = useMindMateStore()
  const [selectedTiming, setSelectedTiming] = useState<string>('morning')
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  
  const today = new Date().toDateString()
  
  const getFilteredMedicines = () => {
    return medicines.filter(m => m.timing.includes(selectedTiming as 'morning' | 'afternoon' | 'evening' | 'night'))
  }
  
  const isTaken = (medicineId: string, timing: string) => {
    return doseLogs.some(
      log => log.medicineId === medicineId && 
             log.timing === timing && 
             new Date(log.timestamp).toDateString() === today
    )
  }
  
  const handleTakeDose = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowFeedback(true)
  }
  
  const handleFeedback = (feeling: string) => {
    if (selectedMedicine) {
      logDose(selectedMedicine.id, selectedTiming, 'taken', feeling)
      setShowFeedback(false)
      setSelectedMedicine(null)
    }
  }
  
  const handleSkip = () => {
    if (selectedMedicine) {
      logDose(selectedMedicine.id, selectedTiming, 'skipped')
      setShowFeedback(false)
      setSelectedMedicine(null)
    }
  }
  
  const filteredMedicines = getFilteredMedicines()
  const takenCount = filteredMedicines.filter(m => isTaken(m.id, selectedTiming)).length
  const progress = filteredMedicines.length > 0 ? (takenCount / filteredMedicines.length) * 100 : 0
  
  // Feedback Modal
  if (showFeedback && selectedMedicine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border max-w-sm w-full animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center text-3xl text-white">
              💊
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {selectedMedicine.name}
            </h2>
            <p className="text-muted-foreground text-sm">{selectedMedicine.dosage}</p>
          </div>
          
          <p className="text-center text-foreground mb-6">How do you feel after taking this?</p>
          
          <div className="flex justify-center gap-4 mb-6">
            {['😊', '😐', '😕'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleFeedback(emoji)}
                className="w-14 h-14 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center text-3xl transition-all hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleFeedback('no-feedback')}
              className="w-full gradient-primary text-white rounded-full"
            >
              Mark as Taken
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              Skip this dose
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">💊 Medicines</h1>
          <button 
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-muted rounded-full h-3 overflow-hidden mb-2">
          <div 
            className="h-full gradient-primary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{takenCount}/{filteredMedicines.length} taken</span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
      </header>
      
      {/* Timing Tabs */}
      <div className="flex p-2 bg-card border-b border-border">
        {Object.entries(timingLabels).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setSelectedTiming(key)}
            className={cn(
              "flex-1 py-3 px-2 text-center rounded-xl transition-all",
              selectedTiming === key 
                ? "gradient-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="text-lg mr-1">{icon}</span>
            <span className="text-sm font-medium hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-5xl mb-6">
              💊
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Medicines Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Add your medicines to track your doses and never miss a pill.
            </p>
            <Button 
              onClick={loadSampleMedicines}
              className="gradient-primary text-white rounded-full"
            >
              Load Sample Medicines
            </Button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-4">{timingLabels[selectedTiming].icon}</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No {timingLabels[selectedTiming].label} Doses
            </h3>
            <p className="text-muted-foreground text-sm">
              You don&apos;t have any medicines scheduled for this time.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredMedicines.map((medicine) => {
              const taken = isTaken(medicine.id, selectedTiming)
              const lowStock = medicine.quantity <= medicine.totalQuantity * 0.2
              
              return (
                <div
                  key={medicine.id}
                  className={cn(
                    "bg-card rounded-xl p-4 border transition-all",
                    taken 
                      ? "border-success/30 bg-success/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shrink-0"
                      style={{ backgroundColor: categoryColors[medicine.category || 'vitamins'] }}
                    >
                      💊
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={cn(
                            "font-semibold text-foreground",
                            taken && "line-through opacity-60"
                          )}>
                            {medicine.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                        </div>
                        {taken ? (
                          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white shrink-0">
                            ✓
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleTakeDose(medicine)}
                            size="sm"
                            className="gradient-primary text-white rounded-full px-4 shrink-0"
                          >
                            Take
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        📋 {medicine.instructions}
                      </p>
                      
                      {/* Stock indicator */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              lowStock ? "bg-destructive" : "bg-success"
                            )}
                            style={{ width: `${(medicine.quantity / medicine.totalQuantity) * 100}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          lowStock ? "text-destructive" : "text-muted-foreground"
                        )}>
                          {medicine.quantity} left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  )
}
