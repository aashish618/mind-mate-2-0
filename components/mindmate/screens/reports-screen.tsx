"use client"

import { useState, useEffect } from "react"
import { useMindMateStore, type ReportStatus, type ReportCategory, type HealthReport } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

const categoryConfig: Record<ReportCategory, { icon: string; color: string; bgColor: string }> = {
  blood: { icon: "🩸", color: "#DC2626", bgColor: "rgba(220, 38, 38, 0.1)" },
  urine: { icon: "🧪", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.1)" },
  lipid: { icon: "❤️", color: "#EC4899", bgColor: "rgba(236, 72, 153, 0.1)" },
  thyroid: { icon: "🦋", color: "#8B5CF6", bgColor: "rgba(139, 92, 246, 0.1)" },
  diabetes: { icon: "🍯", color: "#F97316", bgColor: "rgba(249, 115, 22, 0.1)" },
  liver: { icon: "🫀", color: "#7C3AED", bgColor: "rgba(124, 58, 237, 0.1)" },
  kidney: { icon: "🫘", color: "#059669", bgColor: "rgba(5, 150, 105, 0.1)" },
  vitamin: { icon: "💊", color: "#0EA5E9", bgColor: "rgba(14, 165, 233, 0.1)" },
  general: { icon: "📋", color: "#6B7280", bgColor: "rgba(107, 114, 128, 0.1)" }
}

const categoryLabels: Record<ReportCategory, string> = {
  blood: "Blood Test",
  urine: "Urine Test",
  lipid: "Lipid Profile",
  thyroid: "Thyroid",
  diabetes: "Diabetes",
  liver: "Liver Function",
  kidney: "Kidney Function",
  vitamin: "Vitamins",
  general: "General"
}

const statusConfig: Record<ReportStatus, { 
  bg: string; 
  text: string; 
  border: string; 
  emoji: string; 
  label: string;
  gradient: string;
}> = {
  normal: { 
    bg: "bg-success/10", 
    text: "text-success", 
    border: "border-success/40",
    emoji: "✅",
    label: "All Good",
    gradient: "from-success/20 to-success/5"
  },
  warning: { 
    bg: "bg-warning/15", 
    text: "text-warning-foreground", 
    border: "border-warning/50",
    emoji: "⚠️",
    label: "Monitor",
    gradient: "from-warning/20 to-warning/5"
  },
  critical: { 
    bg: "bg-destructive/15", 
    text: "text-destructive", 
    border: "border-destructive/50",
    emoji: "🚨",
    label: "Attention",
    gradient: "from-destructive/20 to-destructive/5"
  }
}

function HealthScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = useState(circumference)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference)
    }, 100)
    return () => clearTimeout(timer)
  }, [score, circumference])
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22C55E"
    if (s >= 60) return "#F59E0B"
    if (s >= 40) return "#F97316"
    return "#EF4444"
  }
  
  const getScoreEmoji = (s: number) => {
    if (s >= 90) return "🌟"
    if (s >= 80) return "💚"
    if (s >= 60) return "💛"
    if (s >= 40) return "🟠"
    return "🔴"
  }
  
  const getScoreLabel = (s: number) => {
    if (s >= 90) return "Excellent!"
    if (s >= 80) return "Very Good"
    if (s >= 60) return "Fair"
    if (s >= 40) return "Needs Work"
    return "Critical"
  }
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl">{getScoreEmoji(score)}</span>
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
      </div>
    </div>
  )
}

function calculateHealthScore(reports: HealthReport[]): number {
  if (reports.length === 0) return 0
  
  let totalScore = 0
  let totalParams = 0
  
  reports.forEach(report => {
    report.parameters.forEach(param => {
      totalParams++
      if (param.status === 'normal') totalScore += 100
      else if (param.status === 'warning') totalScore += 60
      else totalScore += 20
    })
  })
  
  return totalParams > 0 ? Math.round(totalScore / totalParams) : 0
}

function ReportCard({ report, onClick }: { report: HealthReport; onClick: () => void }) {
  const criticalCount = report.parameters.filter(p => p.status === 'critical').length
  const warningCount = report.parameters.filter(p => p.status === 'warning').length
  const normalCount = report.parameters.filter(p => p.status === 'normal').length
  const status = statusConfig[report.overallStatus]
  const category = categoryConfig[report.category]
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden",
        status.border
      )}
    >
      {/* Status gradient strip at top */}
      <div className={cn("h-1.5 w-full bg-gradient-to-r", status.gradient)} />
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Category icon with colored background */}
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm"
            style={{ backgroundColor: category.bgColor, border: `2px solid ${category.color}20` }}
          >
            {category.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
              {/* Status badge with emoji */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0",
                status.bg,
                status.text
              )}>
                <span>{status.emoji}</span>
                <span>{status.label}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">📅 {formatDate(report.date)}</p>
            <p className="text-xs text-muted-foreground">🏥 {report.lab}</p>
          </div>
        </div>
        
        {/* Parameter Summary with colored indicators */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/10">
                <span>🔴</span>
                <span className="text-xs font-medium text-destructive">{criticalCount}</span>
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-warning/10">
                <span>🟡</span>
                <span className="text-xs font-medium text-warning-foreground">{warningCount}</span>
              </div>
            )}
            {normalCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/10">
                <span>🟢</span>
                <span className="text-xs font-medium text-success">{normalCount}</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-1 text-primary text-sm font-medium">
              <span>View Details</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReportsScreen() {
  const { navigateTo, reports, loadSampleReports, selectReport } = useMindMateStore()
  const [filter, setFilter] = useState<'all' | ReportStatus>('all')
  
  const healthScore = calculateHealthScore(reports)
  
  const filteredReports = reports.filter(r => 
    filter === 'all' ? true : r.overallStatus === filter
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const criticalReports = reports.filter(r => r.overallStatus === 'critical').length
  const warningReports = reports.filter(r => r.overallStatus === 'warning').length
  
  const handleReportClick = (reportId: string) => {
    selectReport(reportId)
    navigateTo('report-detail')
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-muted/80 transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-foreground">Health Reports</h1>
        <button 
          onClick={loadSampleReports}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-muted/80 transition-colors"
        >
          +
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {/* Health Score Section */}
        <div className="p-6 bg-card border-b border-border">
          <div className="flex items-center gap-6">
            <HealthScoreRing score={healthScore} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-2">Your Health Score</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Based on {reports.length} report{reports.length !== 1 ? 's' : ''} and {reports.reduce((acc, r) => acc + r.parameters.length, 0)} parameters
              </p>
              
              {(criticalReports > 0 || warningReports > 0) && (
                <div className="flex flex-wrap gap-2">
                  {criticalReports > 0 && (
                    <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full">
                      {criticalReports} need immediate attention
                    </span>
                  )}
                  {warningReports > 0 && (
                    <span className="px-2 py-1 bg-warning/10 text-warning-foreground text-xs rounded-full">
                      {warningReports} need monitoring
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="p-4 flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: '📊 All', count: reports.length },
            { key: 'critical', label: '🚨 Critical', count: reports.filter(r => r.overallStatus === 'critical').length },
            { key: 'warning', label: '⚠️ Warning', count: reports.filter(r => r.overallStatus === 'warning').length },
            { key: 'normal', label: '✅ Normal', count: reports.filter(r => r.overallStatus === 'normal').length }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as 'all' | ReportStatus)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                filter === f.key 
                  ? f.key === 'critical' ? "bg-destructive text-destructive-foreground"
                    : f.key === 'warning' ? "bg-warning text-warning-foreground"
                    : f.key === 'normal' ? "bg-success text-success-foreground"
                    : "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span>{f.label}</span>
              {f.count > 0 && (
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  filter === f.key ? "bg-white/20" : "bg-foreground/10"
                )}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Reports List */}
        <div className="p-4 flex flex-col gap-4">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center text-4xl">
                📋
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your health reports to track and analyze your health metrics
              </p>
              <button
                onClick={loadSampleReports}
                className="px-6 py-2.5 gradient-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Load Sample Reports
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No {filter} reports found</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onClick={() => handleReportClick(report.id)}
              />
            ))
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
