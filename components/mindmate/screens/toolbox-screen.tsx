"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"

const tools = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Calm your mind with guided breathing',
    icon: '🌬️',
    gradient: 'from-[#6B8E23] to-[#8B9A6B]',
    screen: 'breathing' as const,
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Ground yourself in the present moment',
    icon: '🌿',
    gradient: 'from-[#2E5339] to-[#4A7856]',
    screen: 'grounding' as const,
  },
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Reflect on the good in your life',
    icon: '💛',
    gradient: 'from-[#8B5A2B] to-[#C4A77D]',
    screen: 'gratitude' as const,
  },
  {
    id: 'affirmations',
    title: 'Daily Affirmations',
    description: 'Positive thoughts to lift your spirit',
    icon: '✨',
    gradient: 'from-[#5C4023] to-[#8B6914]',
    screen: 'affirmations' as const,
  },
]

export function ToolboxScreen() {
  const { navigateTo } = useMindMateStore()
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">🧰 Coping Toolbox</h1>
          <button 
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <p className="text-muted-foreground text-center mb-6">
          Choose a tool to help manage your emotions
        </p>
        
        <div className="flex flex-col gap-4">
          {tools.map((tool, idx) => (
            <button
              key={tool.id}
              onClick={() => navigateTo(tool.screen)}
              className="bg-card rounded-xl p-5 flex items-center gap-4 border border-border hover:border-primary/50 transition-all hover:-translate-y-0.5 hover:shadow-md text-left animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div 
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl text-white bg-gradient-to-br ${tool.gradient}`}
              >
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
              <div className="text-muted-foreground">→</div>
            </button>
          ))}
        </div>
        
        {/* Tips Section */}
        <div className="mt-8 bg-muted rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-3">💡 Quick Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Try breathing exercises when feeling anxious</li>
            <li>• Use grounding when overwhelmed or dissociating</li>
            <li>• Practice gratitude before bed for better sleep</li>
            <li>• Read affirmations each morning to start positively</li>
          </ul>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
