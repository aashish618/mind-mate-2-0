"use client"

import { useState, useEffect, useCallback } from "react"
import { useMindMateStore, BreathingTechnique, breathingTechniques } from "@/lib/mindmate-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Phase = 'ready' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'complete'

const phaseMessages: Record<Phase, string> = {
  ready: 'Ready to begin',
  inhale: 'Breathe In...',
  holdIn: 'Hold...',
  exhale: 'Breathe Out...',
  holdOut: 'Hold...',
  complete: 'Well done!',
}

export function BreathingScreen() {
  const { navigateTo } = useMindMateStore()
  const [technique, setTechnique] = useState<BreathingTechnique>('box')
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('ready')
  const [cycle, setCycle] = useState(0)
  const [timer, setTimer] = useState(0)
  
  const config = breathingTechniques[technique]
  
  const runBreathingCycle = useCallback(() => {
    if (cycle >= config.cycles) {
      setPhase('complete')
      setIsActive(false)
      return
    }
    
    // Inhale
    setPhase('inhale')
    setTimer(config.inhale)
    
    const inhaleInterval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(inhaleInterval)
          
          // Hold In
          if (config.holdIn > 0) {
            setPhase('holdIn')
            setTimer(config.holdIn)
            
            const holdInInterval = setInterval(() => {
              setTimer((t) => {
                if (t <= 1) {
                  clearInterval(holdInInterval)
                  
                  // Exhale
                  setPhase('exhale')
                  setTimer(config.exhale)
                  
                  const exhaleInterval = setInterval(() => {
                    setTimer((t) => {
                      if (t <= 1) {
                        clearInterval(exhaleInterval)
                        
                        // Hold Out
                        if (config.holdOut > 0) {
                          setPhase('holdOut')
                          setTimer(config.holdOut)
                          
                          const holdOutInterval = setInterval(() => {
                            setTimer((t) => {
                              if (t <= 1) {
                                clearInterval(holdOutInterval)
                                setCycle((c) => c + 1)
                                return 0
                              }
                              return t - 1
                            })
                          }, 1000)
                        } else {
                          setCycle((c) => c + 1)
                        }
                        return 0
                      }
                      return t - 1
                    })
                  }, 1000)
                  
                  return 0
                }
                return t - 1
              })
            }, 1000)
          } else {
            // Skip holdIn, go to exhale
            setPhase('exhale')
            setTimer(config.exhale)
            
            const exhaleInterval = setInterval(() => {
              setTimer((t) => {
                if (t <= 1) {
                  clearInterval(exhaleInterval)
                  setCycle((c) => c + 1)
                  return 0
                }
                return t - 1
              })
            }, 1000)
          }
          
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [cycle, config])
  
  useEffect(() => {
    if (isActive && cycle < config.cycles && phase === 'ready') {
      runBreathingCycle()
    } else if (isActive && cycle > 0 && cycle < config.cycles && phase !== 'ready') {
      // Continue cycle when previous one completes
      const checkInterval = setInterval(() => {
        if (timer === 0 && phase !== 'complete' && phase !== 'ready') {
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }
  }, [isActive, cycle, phase, config.cycles, runBreathingCycle, timer])
  
  // Watch for cycle changes to continue
  useEffect(() => {
    if (isActive && cycle > 0 && cycle < config.cycles) {
      runBreathingCycle()
    } else if (cycle >= config.cycles && isActive) {
      setPhase('complete')
      setIsActive(false)
    }
  }, [cycle, isActive, config.cycles, runBreathingCycle])
  
  const start = () => {
    setCycle(0)
    setPhase('ready')
    setIsActive(true)
    setTimeout(() => runBreathingCycle(), 500)
  }
  
  const reset = () => {
    setIsActive(false)
    setPhase('ready')
    setCycle(0)
    setTimer(0)
  }
  
  return (
    <div className="min-h-screen gradient-breathing flex flex-col text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button 
          onClick={() => navigateTo('toolbox')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">Breathing Exercise</h1>
        <div className="w-10" />
      </header>
      
      {/* Technique Selector */}
      {!isActive && phase !== 'complete' && (
        <div className="px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(breathingTechniques).map(([key, tech]) => (
              <button
                key={key}
                onClick={() => setTechnique(key as BreathingTechnique)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  technique === key 
                    ? "bg-white text-foreground" 
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Circle */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative">
          <div 
            className={cn(
              "w-56 h-56 rounded-full flex items-center justify-center transition-all duration-1000 breathing-circle",
              phase === 'inhale' && "animate-breathe-in bg-white/20",
              phase === 'exhale' && "animate-breathe-out bg-white/10",
              phase === 'holdIn' || phase === 'holdOut' ? "bg-white/15" : "",
              phase === 'ready' && "bg-white/10",
              phase === 'complete' && "bg-success/30"
            )}
            style={{ background: 'linear-gradient(135deg, rgba(196, 167, 125, 0.3) 0%, rgba(139, 90, 43, 0.3) 100%)' }}
          >
            <div className="text-center">
              {timer > 0 && (
                <div className="text-6xl font-light mb-2">{timer}</div>
              )}
              <div className="text-lg opacity-90">{phaseMessages[phase]}</div>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        {isActive && (
          <div className="mt-8 text-center">
            <div className="text-sm opacity-70">Cycle {cycle + 1} of {config.cycles}</div>
            <div className="flex gap-2 mt-3 justify-center">
              {Array.from({ length: config.cycles }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    i < cycle ? "bg-white" : i === cycle ? "bg-white/60" : "bg-white/20"
                  )}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Complete Message */}
        {phase === 'complete' && (
          <div className="mt-8 text-center animate-in fade-in">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
            <p className="opacity-80">You completed all {config.cycles} cycles</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-6 pb-12">
        {!isActive && phase !== 'complete' && (
          <Button
            onClick={start}
            className="w-full bg-white text-foreground hover:bg-white/90 rounded-full py-6 text-lg font-semibold"
          >
            Start Breathing
          </Button>
        )}
        
        {isActive && (
          <Button
            onClick={reset}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10 rounded-full py-6"
          >
            Stop
          </Button>
        )}
        
        {phase === 'complete' && (
          <div className="flex flex-col gap-3">
            <Button
              onClick={start}
              className="w-full bg-white text-foreground hover:bg-white/90 rounded-full py-6"
            >
              Do Another Round
            </Button>
            <Button
              onClick={() => navigateTo('dashboard')}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 rounded-full py-6"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
