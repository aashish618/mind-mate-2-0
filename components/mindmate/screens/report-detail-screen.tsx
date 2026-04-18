"use client"

import { useState } from "react"
import { useMindMateStore, type ReportParameter, type ReportStatus } from "@/lib/mindmate-store"
import { cn } from "@/lib/utils"

const statusConfig: Record<ReportStatus, { 
  bg: string; 
  text: string; 
  label: string; 
  emoji: string;
  indicator: string;
  lightBg: string;
  description: string;
}> = {
  normal: { 
    bg: "bg-success", 
    text: "text-success", 
    label: "Normal", 
    emoji: "✅",
    indicator: "🟢",
    lightBg: "bg-success/10",
    description: "Within healthy range"
  },
  warning: { 
    bg: "bg-warning", 
    text: "text-warning-foreground", 
    label: "Monitor", 
    emoji: "⚠️",
    indicator: "🟡",
    lightBg: "bg-warning/10",
    description: "Slightly outside optimal range"
  },
  critical: { 
    bg: "bg-destructive", 
    text: "text-destructive", 
    label: "Critical", 
    emoji: "🚨",
    indicator: "🔴",
    lightBg: "bg-destructive/10",
    description: "Needs immediate attention"
  }
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
  const isLow = param.value < param.min
  const isHigh = param.value > param.max
  
  const getValueEmoji = () => {
    if (param.status === 'normal') return "✅"
    if (isLow) return "⬇️"
    if (isHigh) return "⬆️"
    return config.emoji
  }
  
  const getValueLabel = () => {
    if (param.status === 'normal') return "Normal"
    if (isLow) return "Low"
    if (isHigh) return "High"
    return config.label
  }
  
  return (
    <div 
      className={cn(
        "bg-card rounded-xl border-2 overflow-hidden transition-all",
        param.status === 'critical' ? 'border-destructive/50 shadow-md shadow-destructive/10' :
        param.status === 'warning' ? 'border-warning/50 shadow-sm shadow-warning/5' : 'border-success/30'
      )}
    >
      {/* Status strip */}
      <div className={cn("h-1 w-full", config.bg)} />
      
      <div 
        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          {/* Status Icon with emoji */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center text-lg",
            config.lightBg
          )}>
            <span>{config.indicator}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-foreground">{param.name}</h4>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
              {/* Value with direction indicator */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold",
                config.lightBg,
                config.text
              )}>
                <span>{getValueEmoji()}</span>
                <span>{param.value}</span>
                <span className="text-xs font-normal">{param.unit}</span>
              </div>
            </div>
            
            {/* Visual Bar */}
            <ParameterBar param={param} />
            
            {/* Reference Range with emojis */}
            <div className="flex justify-between mt-2 text-xs">
              <span className="flex items-center gap-1 text-destructive">
                <span>⬇️</span>
                <span>{"<"}{param.min}</span>
              </span>
              <span className="flex items-center gap-1 text-success font-medium">
                <span>✅</span>
                <span>{param.min}-{param.max}</span>
              </span>
              <span className="flex items-center gap-1 text-destructive">
                <span>⬆️</span>
                <span>{">"}{param.max}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Expand indicator */}
        <div className="flex justify-center mt-3">
          <span className={cn(
            "text-muted-foreground text-xs transition-transform flex items-center gap-1",
            isExpanded && "rotate-180"
          )}>
            {isExpanded ? "Hide details" : "Tap for details"} ▼
          </span>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-border bg-muted/20 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            {/* What is this */}
            <div className="flex items-start gap-2 p-3 bg-card rounded-lg border border-border">
              <span className="text-lg">📖</span>
              <div>
                <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">What is {param.name}?</h5>
                <p className="text-sm text-foreground">{param.description}</p>
              </div>
            </div>
            
            {/* Recommendation */}
            {param.recommendation && (
              <div className={cn(
                "flex items-start gap-2 p-3 rounded-lg border",
                param.status === 'critical' ? 'bg-destructive/5 border-destructive/30' : 
                param.status === 'warning' ? 'bg-warning/5 border-warning/30' : 'bg-success/5 border-success/30'
              )}>
                <span className="text-lg">{param.status === 'critical' ? '🩺' : param.status === 'warning' ? '💡' : '👍'}</span>
                <div>
                  <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">What You Can Do</h5>
                  <p className={cn(
                    "text-sm font-medium",
                    param.status === 'critical' ? 'text-destructive' : 
                    param.status === 'warning' ? 'text-warning-foreground' : 'text-success'
                  )}>
                    {param.recommendation}
                  </p>
                </div>
              </div>
            )}
            
            {/* Simple explanation */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <span className="text-lg">{param.status === 'normal' ? '🎉' : param.status === 'warning' ? '🤔' : '⚡'}</span>
              <div>
                <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">In Simple Words</h5>
                <p className="text-sm text-foreground">
                  {param.status === 'normal' 
                    ? `Great news! Your ${param.name.toLowerCase()} is perfectly healthy. Keep doing what you're doing! 💪`
                    : param.status === 'warning'
                    ? `Your ${param.name.toLowerCase()} is ${isLow ? 'slightly low' : 'slightly elevated'}. Small lifestyle changes can help bring it back to normal. 🌱`
                    : `Your ${param.name.toLowerCase()} is ${isLow ? 'too low' : 'too high'} and needs attention. Please consult your doctor soon. 🏥`
                  }
                </p>
              </div>
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
          <div className="flex items-center gap-2 mb-3">
            <span className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
              report.overallStatus === 'critical' ? 'bg-destructive text-destructive-foreground' :
              report.overallStatus === 'warning' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'
            )}>
              <span className="text-base">
                {report.overallStatus === 'critical' ? '🚨' :
                 report.overallStatus === 'warning' ? '⚠️' : '✅'}
              </span>
              <span>
                {report.overallStatus === 'critical' ? 'Action Required' :
                 report.overallStatus === 'warning' ? 'Monitor Closely' : 'Looking Good!'}
              </span>
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
          <div className="bg-destructive/10 rounded-xl p-3 text-center border border-destructive/20">
            <div className="text-xl mb-1">🚨</div>
            <div className="text-2xl font-bold text-destructive">
              {report.parameters.filter(p => p.status === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Critical</div>
          </div>
          <div className="bg-warning/10 rounded-xl p-3 text-center border border-warning/20">
            <div className="text-xl mb-1">⚠️</div>
            <div className="text-2xl font-bold text-warning-foreground">
              {report.parameters.filter(p => p.status === 'warning').length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Monitor</div>
          </div>
          <div className="bg-success/10 rounded-xl p-3 text-center border border-success/20">
            <div className="text-xl mb-1">✅</div>
            <div className="text-2xl font-bold text-success">
              {report.parameters.filter(p => p.status === 'normal').length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Normal</div>
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
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>📚</span> Understanding Your Results
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-xl border border-success/20">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="font-semibold text-success">Normal / Healthy</p>
                <p className="text-xs text-muted-foreground">Your value is within the optimal range</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-xl border border-warning/20">
              <span className="text-2xl">🟡</span>
              <div>
                <p className="font-semibold text-warning-foreground">Monitor / Warning</p>
                <p className="text-xs text-muted-foreground">Slightly outside range, keep an eye on it</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="font-semibold text-destructive">Critical / Action Needed</p>
                <p className="text-xs text-muted-foreground">Consult your doctor for guidance</p>
              </div>
            </div>
          </div>
          
          {/* Direction indicators */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Value Direction Indicators</h4>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>⬇️</span>
                <span className="text-muted-foreground">Below normal</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span className="text-muted-foreground">In range</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⬆️</span>
                <span className="text-muted-foreground">Above normal</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom padding for scroll */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
