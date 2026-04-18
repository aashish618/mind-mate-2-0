"use client"

import { useState } from "react"
import { useMindMateStore, type ReportParameter, type ReportStatus } from "@/lib/mindmate-store"
import { cn } from "@/lib/utils"

const statusConfig: Record<ReportStatus, { bg: string; text: string; label: string; icon: string }> = {
  normal: { bg: "bg-success", text: "text-success", label: "Normal", icon: "✓" },
  warning: { bg: "bg-warning", text: "text-warning-foreground", label: "Needs Attention", icon: "!" },
  critical: { bg: "bg-destructive", text: "text-destructive", label: "Critical", icon: "⚠" }
}

function ParameterBar({ param }: { param: ReportParameter }) {
  const range = param.max - param.min
  const normalizedValue = Math.max(0, Math.min(100, ((param.value - param.min) / range) * 100))
  
  // Calculate positions for visual reference
  const normalStart = 20 // Green zone starts at 20%
  const normalEnd = 80 // Green zone ends at 80%
  
  // Where is the value relative to normal range?
  let valuePosition: number
  let isBelow = param.value < param.min
  let isAbove = param.value > param.max
  
  if (isBelow) {
    // Below min - map to 0-20% zone
    const belowRange = param.min - (param.min - range * 0.5)
    valuePosition = Math.max(5, (1 - (param.min - param.value) / belowRange) * normalStart)
  } else if (isAbove) {
    // Above max - map to 80-100% zone
    const aboveRange = (param.max + range * 0.5) - param.max
    valuePosition = Math.min(95, normalEnd + ((param.value - param.max) / aboveRange) * (100 - normalEnd))
  } else {
    // In normal range - map to 20-80% zone
    valuePosition = normalStart + ((param.value - param.min) / (param.max - param.min)) * (normalEnd - normalStart)
  }
  
  return (
    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
      {/* Low zone */}
      <div 
        className="absolute left-0 top-0 bottom-0 bg-destructive/30"
        style={{ width: `${normalStart}%` }}
      />
      {/* Normal zone */}
      <div 
        className="absolute top-0 bottom-0 bg-success/30"
        style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%` }}
      />
      {/* High zone */}
      <div 
        className="absolute right-0 top-0 bottom-0 bg-destructive/30"
        style={{ width: `${100 - normalEnd}%` }}
      />
      {/* Value indicator */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-500",
          statusConfig[param.status].bg
        )}
        style={{ left: `calc(${valuePosition}% - 8px)` }}
      />
    </div>
  )
}

function ParameterCard({ param, isExpanded, onToggle }: { param: ReportParameter; isExpanded: boolean; onToggle: () => void }) {
  const config = statusConfig[param.status]
  
  return (
    <div 
      className={cn(
        "bg-card rounded-xl border overflow-hidden transition-all",
        param.status === 'critical' ? 'border-destructive/50 shadow-sm shadow-destructive/10' :
        param.status === 'warning' ? 'border-warning/50' : 'border-border'
      )}
    >
      <div 
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
            config.bg
          )}>
            {config.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-foreground">{param.name}</h4>
              <span className={cn("text-sm font-medium", config.text)}>
                {param.value} {param.unit}
              </span>
            </div>
            
            {/* Visual Bar */}
            <ParameterBar param={param} />
            
            {/* Reference Range */}
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
              <span>Low: {"<"}{param.min}</span>
              <span className="text-success">Normal: {param.min}-{param.max}</span>
              <span>High: {">"}{param.max}</span>
            </div>
          </div>
        </div>
        
        {/* Expand indicator */}
        <div className="flex justify-center mt-2">
          <span className={cn(
            "text-muted-foreground text-sm transition-transform",
            isExpanded && "rotate-180"
          )}>
            ▼
          </span>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/30 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            <div>
              <h5 className="text-xs font-medium text-muted-foreground uppercase mb-1">What is this?</h5>
              <p className="text-sm text-foreground">{param.description}</p>
            </div>
            
            {param.recommendation && (
              <div className={cn(
                "p-3 rounded-lg",
                param.status === 'critical' ? 'bg-destructive/10' : 
                param.status === 'warning' ? 'bg-warning/10' : 'bg-success/10'
              )}>
                <h5 className="text-xs font-medium text-muted-foreground uppercase mb-1">Recommendation</h5>
                <p className={cn(
                  "text-sm font-medium",
                  param.status === 'critical' ? 'text-destructive' : 
                  param.status === 'warning' ? 'text-warning-foreground' : 'text-success'
                )}>
                  {param.recommendation}
                </p>
              </div>
            )}
            
            {/* Simple explanation */}
            <div className="p-3 bg-primary/5 rounded-lg">
              <h5 className="text-xs font-medium text-muted-foreground uppercase mb-1">In Simple Words</h5>
              <p className="text-sm text-foreground">
                {param.status === 'normal' 
                  ? `Your ${param.name.toLowerCase()} level is healthy and within the expected range. Keep up the good work!`
                  : param.status === 'warning'
                  ? `Your ${param.name.toLowerCase()} is slightly outside the ideal range. With some adjustments, you can improve this.`
                  : `Your ${param.name.toLowerCase()} needs immediate attention. Please follow up with your doctor and follow the recommendations.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AIInsightsCard({ insights }: { insights: string[] }) {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold text-foreground">AI Health Insights</h3>
        <span className="ml-auto px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
          Personalized
        </span>
      </div>
      
      <div className="space-y-2">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
            <span className="text-primary mt-0.5">•</span>
            <p className="text-sm text-foreground">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReportDetailScreen() {
  const { navigateTo, reports, selectedReportId } = useMindMateStore()
  const [expandedParam, setExpandedParam] = useState<string | null>(null)
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false)
  
  const report = reports.find(r => r.id === selectedReportId)
  
  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Report not found</p>
          <button 
            onClick={() => navigateTo('reports')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
  
  const flaggedParams = report.parameters.filter(p => p.status !== 'normal')
  const displayParams = showOnlyFlagged ? flaggedParams : report.parameters
  
  // Sort to show critical first, then warning, then normal
  const sortedParams = [...displayParams].sort((a, b) => {
    const priority = { critical: 0, warning: 1, normal: 2 }
    return priority[a.status] - priority[b.status]
  })
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-card border-b border-border sticky top-0 z-50">
        <button 
          onClick={() => navigateTo('reports')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-muted/80 transition-colors"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">{report.name}</h1>
          <p className="text-xs text-muted-foreground">{report.lab}</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {/* Report Summary */}
        <div className={cn(
          "p-4 border-b",
          report.overallStatus === 'critical' ? 'bg-destructive/5 border-destructive/20' :
          report.overallStatus === 'warning' ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium capitalize",
              report.overallStatus === 'critical' ? 'bg-destructive text-destructive-foreground' :
              report.overallStatus === 'warning' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'
            )}>
              {report.overallStatus === 'critical' ? '⚠ Attention Required' :
               report.overallStatus === 'warning' ? '! Needs Monitoring' : '✓ All Good'}
            </span>
          </div>
          
          <p className="text-sm text-foreground">{report.summary}</p>
          
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <span>📅 {formatDate(report.date)}</span>
            {report.doctor && <span>👨‍⚕️ {report.doctor}</span>}
            {report.followUpDate && (
              <span className="text-primary font-medium">🔔 Follow-up: {formatDate(report.followUpDate)}</span>
            )}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="bg-destructive/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-destructive">
              {report.parameters.filter(p => p.status === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="bg-warning/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D4A574' }}>
              {report.parameters.filter(p => p.status === 'warning').length}
            </div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </div>
          <div className="bg-success/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-success">
              {report.parameters.filter(p => p.status === 'normal').length}
            </div>
            <div className="text-xs text-muted-foreground">Normal</div>
          </div>
        </div>
        
        {/* AI Insights */}
        {report.aiInsights && report.aiInsights.length > 0 && (
          <div className="px-4 pb-4">
            <AIInsightsCard insights={report.aiInsights} />
          </div>
        )}
        
        {/* Parameters Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Test Results</h2>
            {flaggedParams.length > 0 && (
              <button
                onClick={() => setShowOnlyFlagged(!showOnlyFlagged)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  showOnlyFlagged 
                    ? "bg-destructive text-destructive-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {showOnlyFlagged ? `Showing ${flaggedParams.length} Flagged` : `Show Only Flagged (${flaggedParams.length})`}
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {sortedParams.map(param => (
              <ParameterCard
                key={param.name}
                param={param}
                isExpanded={expandedParam === param.name}
                onToggle={() => setExpandedParam(expandedParam === param.name ? null : param.name)}
              />
            ))}
          </div>
        </div>
        
        {/* Understanding Section */}
        <div className="p-4 bg-card border-t border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>💡</span> How to Read This Report
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              <span><strong className="text-foreground">Green/Normal:</strong> Value is within healthy range</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span><strong className="text-foreground">Yellow/Warning:</strong> Slightly outside range, monitor it</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive"></span>
              <span><strong className="text-foreground">Red/Critical:</strong> Needs attention, consult your doctor</span>
            </div>
          </div>
        </div>
        
        {/* Bottom padding for scroll */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
