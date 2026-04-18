"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"

export function DashboardScreen() {
  const { navigateTo, streak } = useMindMateStore()
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Crisis Banner */}
      <div 
        onClick={() => navigateTo('resources')}
        className="bg-[#B84040] text-white text-center py-2 px-4 text-sm cursor-pointer hover:bg-[#A03030] transition-colors"
      >
        🆘 Need help now? Tap here for crisis resources
      </div>
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground">
          🔒 Anonymous
        </div>
        <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-muted/80 transition-colors">
          ⚙️
        </button>
      </header>
      
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Greeting */}
        <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl font-bold text-foreground">Hey there 👋</h1>
          <p className="text-muted-foreground mt-1">How are you feeling today?</p>
        </div>
        
        {/* Check-in Card */}
        <div 
          onClick={() => navigateTo('checkin')}
          className="gradient-primary text-white rounded-xl p-6 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
        >
          <div className="text-5xl mb-4 animate-pulse-gentle">💭</div>
          <h2 className="text-xl font-semibold mb-2">Daily Check-In</h2>
          <p className="opacity-80 text-sm">Takes only 10 seconds</p>
        </div>
        
        {/* Streak Card */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="w-14 h-14 gradient-calm rounded-xl flex items-center justify-center text-3xl">
            🔥
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">You are on a roll!</h3>
            <p className="text-sm text-muted-foreground">Keep the momentum going</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Days</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div 
            onClick={() => navigateTo('medicines')}
            className="bg-card rounded-xl p-5 text-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md border border-border shadow-sm"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #D4A574 0%, #C4956C 100%)' }}>
              💊
            </div>
            <div className="font-semibold text-sm text-foreground">Medicines</div>
          </div>
          
          <div 
            onClick={() => navigateTo('calendar')}
            className="bg-card rounded-xl p-5 text-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md border border-border shadow-sm"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #8B5A2B 0%, #C4A77D 100%)' }}>
              📅
            </div>
            <div className="font-semibold text-sm text-foreground">Calendar</div>
          </div>
          
          <div 
            onClick={() => navigateTo('breathing')}
            className="bg-card rounded-xl p-5 text-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md border border-border shadow-sm"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6B8E23 0%, #8B9A6B 100%)' }}>
              🌬️
            </div>
            <div className="font-semibold text-sm text-foreground">Breathe</div>
          </div>
          
          <div 
            onClick={() => navigateTo('toolbox')}
            className="bg-card rounded-xl p-5 text-center cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md border border-border shadow-sm"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #8B5A2B 0%, #A0704A 100%)' }}>
              🧰
            </div>
            <div className="font-semibold text-sm text-foreground">Tools</div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
