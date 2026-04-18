"use client"

import { useMindMateStore, moodEmojis, Mood } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

const moodColors: Record<Mood, string> = {
  great: '#6B8E23',
  good: '#8B9A6B',
  okay: '#D4A574',
  low: '#C4956C',
  rough: '#C25450',
}

export function InsightsScreen() {
  const { checkIns, streak, navigateTo, gratitudeEntries, medicines, doseLogs } = useMindMateStore()
  
  // Calculate mood distribution
  const moodCounts = checkIns.reduce((acc, ci) => {
    acc[ci.mood] = (acc[ci.mood] || 0) + 1
    return acc
  }, {} as Record<Mood, number>)
  
  const totalCheckIns = checkIns.length
  
  // Calculate average energy
  const avgEnergy = totalCheckIns > 0 
    ? Math.round(checkIns.reduce((sum, ci) => sum + ci.energy, 0) / totalCheckIns)
    : 0
  
  // Recent moods (last 7)
  const recentMoods = checkIns.slice(0, 7).reverse()
  
  // Medicine adherence
  const today = new Date().toDateString()
  const todayLogs = doseLogs.filter(l => new Date(l.timestamp).toDateString() === today)
  const takenToday = todayLogs.filter(l => l.status === 'taken').length
  const totalDosesToday = medicines.reduce((sum, m) => sum + m.timing.length, 0)
  const adherenceRate = totalDosesToday > 0 ? Math.round((takenToday / totalDosesToday) * 100) : 100
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">📊 Insights</h1>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <div className="text-3xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <div className="text-3xl font-bold text-primary">{totalCheckIns}</div>
            <div className="text-xs text-muted-foreground">Check-ins</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border">
            <div className="text-3xl font-bold text-primary">{avgEnergy}%</div>
            <div className="text-xs text-muted-foreground">Avg Energy</div>
          </div>
        </div>
        
        {/* Recent Moods */}
        <div className="bg-card rounded-xl p-5 border border-border mb-4">
          <h2 className="font-semibold text-foreground mb-4">Recent Mood Trend</h2>
          {recentMoods.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-muted-foreground text-sm">No check-ins yet. Start tracking!</p>
            </div>
          ) : (
            <div className="flex justify-between items-end gap-2">
              {recentMoods.map((ci, idx) => (
                <div key={ci.id} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full rounded-lg transition-all"
                    style={{ 
                      height: `${(ci.energy / 100) * 80 + 20}px`,
                      backgroundColor: moodColors[ci.mood]
                    }}
                  />
                  <span className="text-xl">{moodEmojis[ci.mood]}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(ci.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Mood Distribution */}
        {totalCheckIns > 0 && (
          <div className="bg-card rounded-xl p-5 border border-border mb-4">
            <h2 className="font-semibold text-foreground mb-4">Mood Distribution</h2>
            <div className="space-y-3">
              {(['great', 'good', 'okay', 'low', 'rough'] as Mood[]).map((mood) => {
                const count = moodCounts[mood] || 0
                const percentage = totalCheckIns > 0 ? (count / totalCheckIns) * 100 : 0
                
                return (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-2xl w-8">{moodEmojis[mood]}</span>
                    <div className="flex-1">
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: moodColors[mood]
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-10 text-right">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Medicine Adherence */}
        <div className="bg-card rounded-xl p-5 border border-border mb-4">
          <h2 className="font-semibold text-foreground mb-4">💊 Medicine Adherence</h2>
          <div className="flex items-center gap-4">
            <div 
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#6B8E23 ${adherenceRate}%, #E8E0D5 ${adherenceRate}%)`
              }}
            >
              <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{adherenceRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-foreground font-medium">
                {adherenceRate >= 80 ? "Great job!" : adherenceRate >= 50 ? "Keep it up!" : "You can do better!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {takenToday} of {totalDosesToday} doses taken today
              </p>
            </div>
          </div>
        </div>
        
        {/* Gratitude Stats */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="font-semibold text-foreground mb-4">💛 Gratitude Entries</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl gradient-gratitude flex items-center justify-center text-white">
              <span className="text-2xl font-bold">{gratitudeEntries.length}</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">
                {gratitudeEntries.length === 0 
                  ? "Start your gratitude practice" 
                  : `${gratitudeEntries.reduce((sum, e) => sum + e.items.length, 0)} things you're grateful for`}
              </p>
              <p className="text-sm text-muted-foreground">
                Gratitude improves mental wellbeing
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
