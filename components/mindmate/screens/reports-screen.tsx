"use client"

import { useState, useEffect } from "react"
import { useMindMateStore, type ReportStatus, type ReportCategory, type HealthReport } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

const categoryIcons: Record<ReportCategory, string> = {
  blood: "🩸",
  urine: "🧪",
  lipid: "❤️",
  thyroid: "🦋",
  diabetes: "🍬",
  liver: "🫁",
  kidney: "🫘",
  vitamin: "💊",
  general: "📋"
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

const statusColors: Record<ReportStatus, { bg: string; text: string; border: string }> = {
  normal: { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
  warning: { bg: "bg-warning/10", text: "text-warning-foreground", border: "border-warning/30" },
  critical: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" }
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
    if (s >= 80) return "#6B8E23"
    if (s >= 60) return "#D4A574"
    return "#C25450"
  }
  
  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Good"
    if (s >= 40) return "Needs Attention"
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
        <span className="text-3xl font-bold text-foreground">{score}</span>
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
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl p-4 border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md",
        statusColors[report.overallStatus].border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
          statusColors[report.overallStatus].bg
        )}>
          {categoryIcons[report.category]}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(report.date)}</p>
          <p className="text-xs text-muted-foreground">{report.lab}</p>
        </div>
        
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium capitalize",
          statusColors[report.overallStatus].bg,
          statusColors[report.overallStatus].text
        )}>
          {report.overallStatus}
        </div>
      </div>
      
      {/* Parameter Summary */}
      <div className="mt-3 pt-3 border-t border-border flex items-center gap-4">
        {criticalCount > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            <span className="text-muted-foreground">{criticalCount} Critical</span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-warning"></span>
            <span className="text-muted-foreground">{warningCount} Warning</span>
          </div>
        )}
        {normalCount > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-muted-foreground">{normalCount} Normal</span>
          </div>
        )}
        <div className="ml-auto text-primary text-sm font-medium">View →</div>
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
          {(['all', 'critical', 'warning', 'normal'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                filter === f 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {f === 'all' ? 'All Reports' : f.charAt(0).toUpperCase() + f.slice(1)}
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
