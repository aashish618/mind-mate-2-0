"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

export function DashboardScreen() {
  const { navigateTo, streak, reports } = useMindMateStore()

  const criticalCount = reports.flatMap(r => r.parameters).filter(p => p.status === 'critical').length
  const warningCount = reports.flatMap(r => r.parameters).filter(p => p.status === 'warning').length

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-card border-b border-border sticky top-0 z-50">
        <div>
          <p className="text-xs text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-base font-semibold text-foreground leading-tight">Your Health Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground font-medium">{streak} day streak</span>
        </div>
      </header>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5 pb-24">

        {/* Health Reports — Primary Feature */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Health Reports</h2>
            <button
              onClick={() => navigateTo('reports')}
              className="text-xs text-primary font-medium"
            >
              View all
            </button>
          </div>

          {reports.length === 0 ? (
            /* Empty state */
            <button
              onClick={() => navigateTo('reports')}
              className="w-full bg-card border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20M12 12V18M9 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Add your first report</p>
                <p className="text-xs text-muted-foreground mt-0.5">Upload a blood test, lipid panel, thyroid — any report</p>
              </div>
            </button>
          ) : (
            /* Reports summary */
            <div className="flex flex-col gap-3">
              {/* Alert strip if there are flags */}
              {criticalCount > 0 && (
                <button
                  onClick={() => navigateTo('reports')}
                  className="w-full flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-2xl px-4 py-3 text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive shrink-0" />
                  <p className="text-sm text-destructive font-medium flex-1">
                    {criticalCount} value{criticalCount > 1 ? 's' : ''} need{criticalCount === 1 ? 's' : ''} attention
                  </p>
                  <span className="text-xs text-destructive">View</span>
                </button>
              )}
              {warningCount > 0 && criticalCount === 0 && (
                <button
                  onClick={() => navigateTo('reports')}
                  className="w-full flex items-center gap-3 bg-warning/10 border border-warning/30 rounded-2xl px-4 py-3 text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-warning shrink-0" />
                  <p className="text-sm text-warning-foreground font-medium flex-1">
                    {warningCount} value{warningCount > 1 ? 's' : ''} to monitor
                  </p>
                  <span className="text-xs text-warning-foreground">View</span>
                </button>
              )}
              {criticalCount === 0 && warningCount === 0 && (
                <div className="w-full flex items-center gap-3 bg-success/10 border border-success/30 rounded-2xl px-4 py-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
                  <p className="text-sm text-success font-medium">All values are in the healthy range</p>
                </div>
              )}

              {/* Recent reports list */}
              {reports.slice(0, 2).map((report) => (
                <button
                  key={report.id}
                  onClick={() => { useMindMateStore.getState().selectReport(report.id); navigateTo('report-detail') }}
                  className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 text-left hover:border-primary/30 transition-colors"
                >
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full shrink-0",
                    report.overallStatus === 'critical' ? 'bg-destructive' :
                    report.overallStatus === 'warning' ? 'bg-warning' : 'bg-success'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                    report.overallStatus === 'critical' ? 'bg-destructive/10 text-destructive' :
                    report.overallStatus === 'warning' ? 'bg-warning/15 text-warning-foreground' :
                    'bg-success/10 text-success'
                  )}>
                    {report.overallStatus === 'critical' ? 'Attention' :
                     report.overallStatus === 'warning' ? 'Monitor' : 'Normal'}
                  </span>
                </button>
              ))}

              {reports.length > 2 && (
                <button
                  onClick={() => navigateTo('reports')}
                  className="w-full text-center text-xs text-primary font-medium py-2"
                >
                  {reports.length - 2} more report{reports.length - 2 > 1 ? 's' : ''} — tap to view all
                </button>
              )}
            </div>
          )}
        </section>

        {/* Divider label */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">Wellness tools</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Symptom Checker — featured banner */}
        <button
          onClick={() => navigateTo('symptom-checker')}
          className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 text-left hover:border-primary/30 hover:-translate-y-0.5 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
              <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 10v2a7 7 0 0014 0v-2M12 19v3M9 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">Symptom Checker</p>
            <p className="text-xs text-muted-foreground">Speak in Hindi or your language</p>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full shrink-0">New</span>
        </button>

        {/* Daily Check-In */}
        <button
          onClick={() => navigateTo('checkin')}
          className="w-full flex items-center gap-4 gradient-primary text-white rounded-2xl px-5 py-4 text-left shadow-md hover:-translate-y-0.5 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C10 2 4 4.5 4 10C4 13.314 6.686 16 10 16C13.314 16 16 13.314 16 10C16 6.686 13.314 4 10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 10H13M10 7V13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Daily Check-In</p>
            <p className="text-xs text-white/70">How are you feeling today?</p>
          </div>
          <span className="text-white/70 text-lg">›</span>
        </button>

        {/* Quick actions grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Medicines",
              desc: "Reminders",
              screen: 'medicines' as const,
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="8" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 8V5C7 3.895 7.895 3 9 3H13C14.105 3 15 3.895 15 5V8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 12V16M9 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            },
            {
              label: "Breathe",
              desc: "Calm down",
              screen: 'breathing' as const,
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 3C11 3 5 6 5 11C5 14.314 7.686 17 11 17C14.314 17 17 14.314 17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            },
            {
              label: "Tools",
              desc: "Coping kit",
              screen: 'toolbox' as const,
              icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 9H19M3 15H19M9 3V19M15 3V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigateTo(item.screen)}
              className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl py-4 px-3 hover:border-primary/30 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                {item.icon}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Crisis help */}
        <button
          onClick={() => navigateTo('resources')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/30 bg-destructive/5"
        >
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-xs font-medium text-destructive">Need help right now? Crisis resources</span>
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
