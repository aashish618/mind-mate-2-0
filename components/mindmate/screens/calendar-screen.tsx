"use client"

import { useMindMateStore, calendarData } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

const eventTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
  holiday: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
  exam: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  event: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  break: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
}

export function CalendarScreen() {
  const { currentWeek, setCurrentWeek, navigateTo } = useMindMateStore()
  
  const weekData = calendarData[currentWeek - 1]
  
  const nextWeek = () => {
    if (currentWeek < calendarData.length) {
      setCurrentWeek(currentWeek + 1)
    }
  }
  
  const prevWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1)
    }
  }
  
  // Get upcoming events across all weeks
  const upcomingEvents = calendarData.flatMap(week => 
    week.days
      .filter(day => day.event)
      .map(day => ({ ...day, week: week.week }))
  ).slice(0, 5)
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">📅 Academic Calendar</h1>
          <button 
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-between bg-muted rounded-xl p-3">
          <button 
            onClick={prevWeek}
            disabled={currentWeek === 1}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center disabled:opacity-40"
          >
            ←
          </button>
          <div className="text-center">
            <div className="font-bold text-foreground">Week {currentWeek}</div>
            <div className="text-sm text-muted-foreground">
              {weekData?.start} - {weekData?.end}
            </div>
          </div>
          <button 
            onClick={nextWeek}
            disabled={currentWeek === calendarData.length}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center disabled:opacity-40"
          >
            →
          </button>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {/* Week View */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekData?.days.map((day) => {
            const eventType = day.type as keyof typeof eventTypeColors
            const colors = eventTypeColors[eventType]
            
            return (
              <div
                key={`${day.month}-${day.date}`}
                className={cn(
                  "rounded-xl p-2 text-center border transition-all",
                  day.event 
                    ? `${colors?.bg || 'bg-card'} border-transparent` 
                    : "bg-card border-border"
                )}
              >
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div className={cn(
                  "text-lg font-bold",
                  day.event ? colors?.text : "text-foreground"
                )}>
                  {day.date}
                </div>
                {day.event && (
                  <div className={cn("w-2 h-2 rounded-full mx-auto mt-1", colors?.dot)} />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Events for Current Week */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">This Week</h2>
          {weekData?.days.filter(d => d.event).length === 0 ? (
            <div className="bg-card rounded-xl p-6 text-center border border-border">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-muted-foreground">Regular classes this week</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {weekData?.days.filter(d => d.event).map((day) => {
                const eventType = day.type as keyof typeof eventTypeColors
                const colors = eventTypeColors[eventType]
                
                return (
                  <div
                    key={`event-${day.month}-${day.date}`}
                    className={cn(
                      "bg-card rounded-xl p-4 border-l-4 flex items-center gap-4",
                      colors?.dot ? `border-l-[${colors.dot.replace('bg-', '')}]` : "border-l-primary"
                    )}
                    style={{ borderLeftColor: colors?.dot.replace('bg-', 'var(--') + ')' }}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0",
                      colors?.dot || "bg-primary"
                    )}>
                      <div className="text-center">
                        <div className="text-xs opacity-80">{day.month}</div>
                        <div className="font-bold">{day.date}</div>
                      </div>
                    </div>
                    <div>
                      <div className={cn("font-semibold", colors?.text || "text-foreground")}>
                        {day.event}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">{day.type}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Upcoming Events */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Upcoming Events</h2>
          <div className="flex flex-col gap-2">
            {upcomingEvents.map((event, idx) => {
              const eventType = event.type as keyof typeof eventTypeColors
              const colors = eventTypeColors[eventType]
              
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-3 flex items-center gap-3 border border-border"
                >
                  <div className={cn("w-2 h-2 rounded-full", colors?.dot || "bg-primary")} />
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{event.event}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.month} {event.date} • Week {event.week}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 p-4 bg-card rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Legend</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(eventTypeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", colors.dot)} />
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
