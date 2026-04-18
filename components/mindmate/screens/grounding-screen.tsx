"use client"

import { useState } from "react"
import { useMindMateStore } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  { count: 5, sense: 'SEE', icon: '👁️', prompt: 'Look around and name 5 things you can see', gradient: 'from-[#2E5339] to-[#4A7856]' },
  { count: 4, sense: 'TOUCH', icon: '✋', prompt: 'Notice 4 things you can physically feel', gradient: 'from-[#3D5A4C] to-[#5A7869]' },
  { count: 3, sense: 'HEAR', icon: '👂', prompt: 'Listen for 3 sounds around you', gradient: 'from-[#4A6B5A] to-[#6B8A7A]' },
  { count: 2, sense: 'SMELL', icon: '👃', prompt: 'Identify 2 things you can smell', gradient: 'from-[#587C6B] to-[#7A9B8A]' },
  { count: 1, sense: 'TASTE', icon: '👅', prompt: 'Notice 1 thing you can taste', gradient: 'from-[#6B8E7A] to-[#8AAC9A]' },
]

export function GroundingScreen() {
  const { navigateTo } = useMindMateStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [inputs, setInputs] = useState<string[][]>([[], [], [], [], []])
  const [currentInput, setCurrentInput] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  
  const step = steps[currentStep]
  const progress = (currentStep / steps.length) * 100
  
  const addItem = () => {
    if (!currentInput.trim()) return
    
    const newInputs = [...inputs]
    newInputs[currentStep] = [...newInputs[currentStep], currentInput.trim()]
    setInputs(newInputs)
    setCurrentInput('')
    
    // Check if step is complete
    if (newInputs[currentStep].length >= step.count) {
      if (currentStep < steps.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 500)
      } else {
        setIsComplete(true)
      }
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addItem()
    }
  }
  
  const reset = () => {
    setCurrentStep(0)
    setInputs([[], [], [], [], []])
    setCurrentInput('')
    setIsComplete(false)
  }
  
  if (isComplete) {
    return (
      <div className="min-h-screen gradient-grounding flex flex-col items-center justify-center p-8 text-white text-center">
        <div className="bg-white/95 rounded-3xl p-10 shadow-xl max-w-sm w-full animate-scale-in">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">You Did It!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            You&apos;ve successfully grounded yourself in the present moment. Take a deep breath and notice how you feel.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full gradient-primary text-white rounded-full py-6"
            >
              Practice Again
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
  
  return (
    <div className={cn("min-h-screen flex flex-col text-white bg-gradient-to-b", step.gradient)}>
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigateTo('toolbox')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">5-4-3-2-1 Grounding</h1>
        <div className="w-10" />
      </header>
      
      {/* Progress */}
      <div className="px-4 mb-6">
        <div className="flex justify-between text-sm mb-2 opacity-80">
          <span>Progress</span>
          <span>{currentStep + 1} of {steps.length}</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col">
        {/* Step Header */}
        <div className="text-center mb-6 animate-in fade-in">
          <div className="text-6xl mb-4">{step.icon}</div>
          <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
            {step.count} things you can {step.sense}
          </div>
          <p className="text-lg opacity-90">{step.prompt}</p>
        </div>
        
        {/* Items List */}
        <div className="flex flex-wrap gap-2 mb-6 min-h-[60px]">
          {inputs[currentStep].map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2 bg-white/20 rounded-full text-sm animate-scale-in"
            >
              {item}
            </div>
          ))}
          {Array.from({ length: step.count - inputs[currentStep].length }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="w-16 h-9 border-2 border-dashed border-white/30 rounded-full"
            />
          ))}
        </div>
        
        {/* Input */}
        <div className="mt-auto pb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type something you can ${step.sense.toLowerCase()}...`}
              className="flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
            />
            <Button
              onClick={addItem}
              disabled={!currentInput.trim()}
              className="px-6 bg-white text-foreground hover:bg-white/90 rounded-full disabled:opacity-50"
            >
              Add
            </Button>
          </div>
          
          <p className="text-center text-sm opacity-60 mt-4">
            {step.count - inputs[currentStep].length} more to go
          </p>
        </div>
      </div>
    </div>
  )
}
