"use client"

import { useState, useEffect, useRef } from "react"
import { useMindMateStore, type ReportStatus, type ReportCategory, type HealthReport, type ReportParameter } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

// Upload Modal Component
function UploadReportModal({ 
  isOpen, 
  onClose,
  onSubmit 
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: Omit<HealthReport, 'id'>) => void
}) {
  const [step, setStep] = useState<'method' | 'details' | 'parameters' | 'review'>('method')
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'file' | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [reportName, setReportName] = useState('')
  const [category, setCategory] = useState<ReportCategory>('blood')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [lab, setLab] = useState('')
  const [doctor, setDoctor] = useState('')
  const [parameters, setParameters] = useState<ReportParameter[]>([])
  const [newParam, setNewParam] = useState({
    name: '',
    value: '',
    unit: '',
    min: '',
    max: ''
  })
  
  const resetForm = () => {
    setStep('method')
    setUploadMethod(null)
    setFileName(null)
    setReportName('')
    setCategory('blood')
    setDate(new Date().toISOString().split('T')[0])
    setLab('')
    setDoctor('')
    setParameters([])
    setNewParam({ name: '', value: '', unit: '', min: '', max: '' })
  }
  
  const handleClose = () => {
    resetForm()
    onClose()
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Simulate parsing - in real app, you'd parse the PDF/image
      // For now, we'll set some demo data
      setReportName('Uploaded Report')
      setCategory('general')
      setLab('Lab from document')
      setStep('details')
    }
  }
  
  const addParameter = () => {
    if (newParam.name && newParam.value && newParam.min && newParam.max) {
      const value = parseFloat(newParam.value)
      const min = parseFloat(newParam.min)
      const max = parseFloat(newParam.max)
      
      let status: ReportStatus = 'normal'
      if (value < min * 0.8 || value > max * 1.2) status = 'critical'
      else if (value < min || value > max) status = 'warning'
      
      const param: ReportParameter = {
        name: newParam.name,
        value,
        unit: newParam.unit || '-',
        min,
        max,
        status,
        description: `${newParam.name} measurement`
      }
      
      if (status !== 'normal') {
        param.recommendation = status === 'critical' 
          ? `Consult your doctor about your ${newParam.name.toLowerCase()} levels.`
          : `Monitor your ${newParam.name.toLowerCase()} and consider lifestyle adjustments.`
      }
      
      setParameters([...parameters, param])
      setNewParam({ name: '', value: '', unit: '', min: '', max: '' })
    }
  }
  
  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index))
  }
  
  const calculateOverallStatus = (): ReportStatus => {
    if (parameters.some(p => p.status === 'critical')) return 'critical'
    if (parameters.some(p => p.status === 'warning')) return 'warning'
    return 'normal'
  }
  
  const handleSubmit = () => {
    const overallStatus = calculateOverallStatus()
    const criticalCount = parameters.filter(p => p.status === 'critical').length
    const warningCount = parameters.filter(p => p.status === 'warning').length
    
    const report: Omit<HealthReport, 'id'> = {
      name: reportName,
      category,
      date,
      lab,
      doctor: doctor || undefined,
      parameters,
      overallStatus,
      summary: criticalCount > 0 
        ? `${criticalCount} parameter(s) need immediate attention. Please consult your doctor.`
        : warningCount > 0
        ? `${warningCount} parameter(s) are slightly outside normal range. Monitor closely.`
        : 'All parameters are within normal range. Great health!',
      aiInsights: [
        criticalCount > 0 
          ? 'Some values need immediate medical attention.'
          : warningCount > 0
          ? 'Minor adjustments to lifestyle may help improve these values.'
          : 'Excellent results! Keep maintaining your healthy lifestyle.',
        'Regular monitoring helps track your health trends over time.',
        'Discuss any concerns with your healthcare provider.'
      ]
    }
    
    onSubmit(report)
    handleClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button 
            onClick={step === 'method' ? handleClose : () => setStep(step === 'parameters' ? 'details' : step === 'review' ? 'parameters' : 'method')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {step === 'method' ? 'Cancel' : '< Back'}
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {step === 'method' ? 'Add Report' : 
             step === 'details' ? 'Report Details' :
             step === 'parameters' ? 'Add Parameters' : 'Review Report'}
          </h2>
          <div className="w-16"></div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-6">
                How would you like to add your health report?
              </p>
              
              {/* Manual Entry */}
              <button
                onClick={() => { setUploadMethod('manual'); setStep('details') }}
                className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border border-border flex items-center gap-4 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  ✍️
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-foreground">Manual Entry</h3>
                  <p className="text-sm text-muted-foreground">Enter report details yourself</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </button>
              
              {/* File Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border border-border flex items-center gap-4 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center text-2xl">
                  📄
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-foreground">Upload File</h3>
                  <p className="text-sm text-muted-foreground">PDF, Image, or Document</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Load Samples */}
              <div className="pt-4 border-t border-border mt-6">
                <p className="text-xs text-muted-foreground text-center mb-3">Or try with sample data</p>
                <button
                  onClick={() => { 
                    const { loadSampleReports } = useMindMateStore.getState()
                    loadSampleReports()
                    handleClose()
                  }}
                  className="w-full p-3 bg-muted/30 hover:bg-muted/50 rounded-xl text-sm text-muted-foreground transition-colors"
                >
                  Load Sample Reports
                </button>
              </div>
            </div>
          )}
          
          {step === 'details' && (
            <div className="space-y-4">
              {fileName && (
                <div className="p-3 bg-success/10 rounded-xl border border-success/30 flex items-center gap-3 mb-4">
                  <span className="text-xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-success truncate">{fileName}</p>
                    <p className="text-xs text-muted-foreground">File uploaded successfully</p>
                  </div>
                </div>
              )}
              
              {/* Report Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Report Name *</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Complete Blood Count"
                  className="w-full p-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(categoryConfig) as ReportCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "p-2 rounded-xl border text-center transition-all",
                        category === cat 
                          ? "border-primary bg-primary/10 text-foreground" 
                          : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <span className="text-lg block mb-1">{categoryConfig[cat].icon}</span>
                      <span className="text-xs">{categoryLabels[cat]}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Test Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-muted rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              {/* Lab */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Laboratory *</label>
                <input
                  type="text"
                  value={lab}
                  onChange={(e) => setLab(e.target.value)}
                  placeholder="e.g., City Medical Labs"
                  className="w-full p-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              {/* Doctor (Optional) */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Doctor (Optional)</label>
                <input
                  type="text"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="e.g., Dr. Smith"
                  className="w-full p-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <button
                onClick={() => setStep('parameters')}
                disabled={!reportName || !lab || !date}
                className="w-full mt-4 p-4 gradient-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Next: Add Parameters
              </button>
            </div>
          )}
          
          {step === 'parameters' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add the test parameters from your report. The status will be calculated automatically.
              </p>
              
              {/* Add Parameter Form */}
              <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
                <h4 className="font-medium text-foreground text-sm">Add Parameter</h4>
                
                <input
                  type="text"
                  value={newParam.name}
                  onChange={(e) => setNewParam({...newParam, name: e.target.value})}
                  placeholder="Parameter name (e.g., Hemoglobin)"
                  className="w-full p-2.5 bg-card rounded-lg border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={newParam.value}
                    onChange={(e) => setNewParam({...newParam, value: e.target.value})}
                    placeholder="Your value"
                    className="w-full p-2.5 bg-card rounded-lg border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="text"
                    value={newParam.unit}
                    onChange={(e) => setNewParam({...newParam, unit: e.target.value})}
                    placeholder="Unit (e.g., g/dL)"
                    className="w-full p-2.5 bg-card rounded-lg border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={newParam.min}
                    onChange={(e) => setNewParam({...newParam, min: e.target.value})}
                    placeholder="Min normal"
                    className="w-full p-2.5 bg-card rounded-lg border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="number"
                    value={newParam.max}
                    onChange={(e) => setNewParam({...newParam, max: e.target.value})}
                    placeholder="Max normal"
                    className="w-full p-2.5 bg-card rounded-lg border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <button
                  onClick={addParameter}
                  disabled={!newParam.name || !newParam.value || !newParam.min || !newParam.max}
                  className="w-full p-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Parameter
                </button>
              </div>
              
              {/* Parameters List */}
              {parameters.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm">Added Parameters ({parameters.length})</h4>
                  {parameters.map((param, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between",
                        param.status === 'critical' ? 'bg-destructive/10 border-destructive/30' :
                        param.status === 'warning' ? 'bg-warning/10 border-warning/30' : 'bg-success/10 border-success/30'
                      )}
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{param.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {param.value} {param.unit} (Range: {param.min}-{param.max})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          param.status === 'critical' ? 'bg-destructive text-destructive-foreground' :
                          param.status === 'warning' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'
                        )}>
                          {param.status === 'critical' ? '🔴' : param.status === 'warning' ? '🟡' : '🟢'}
                        </span>
                        <button 
                          onClick={() => removeParameter(index)}
                          className="w-6 h-6 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setStep('review')}
                disabled={parameters.length === 0}
                className="w-full mt-4 p-4 gradient-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Review Report
              </button>
            </div>
          )}
          
          {step === 'review' && (
            <div className="space-y-4">
              {/* Report Summary Card */}
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: categoryConfig[category].bgColor }}
                  >
                    {categoryConfig[category].icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{reportName}</h3>
                    <p className="text-sm text-muted-foreground">{categoryLabels[category]}</p>
                    <p className="text-xs text-muted-foreground">{lab} • {new Date(date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Status Summary */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 bg-destructive/10 rounded-lg text-center">
                    <span className="text-lg font-bold text-destructive">
                      {parameters.filter(p => p.status === 'critical').length}
                    </span>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </div>
                  <div className="p-2 bg-warning/10 rounded-lg text-center">
                    <span className="text-lg font-bold text-warning-foreground">
                      {parameters.filter(p => p.status === 'warning').length}
                    </span>
                    <p className="text-xs text-muted-foreground">Warning</p>
                  </div>
                  <div className="p-2 bg-success/10 rounded-lg text-center">
                    <span className="text-lg font-bold text-success">
                      {parameters.filter(p => p.status === 'normal').length}
                    </span>
                    <p className="text-xs text-muted-foreground">Normal</p>
                  </div>
                </div>
                
                {/* Overall Status */}
                <div className={cn(
                  "p-3 rounded-xl text-center",
                  calculateOverallStatus() === 'critical' ? 'bg-destructive/20' :
                  calculateOverallStatus() === 'warning' ? 'bg-warning/20' : 'bg-success/20'
                )}>
                  <span className={cn(
                    "text-sm font-semibold",
                    calculateOverallStatus() === 'critical' ? 'text-destructive' :
                    calculateOverallStatus() === 'warning' ? 'text-warning-foreground' : 'text-success'
                  )}>
                    Overall Status: {calculateOverallStatus() === 'critical' ? '🚨 Needs Attention' :
                                     calculateOverallStatus() === 'warning' ? '⚠️ Monitor Closely' : '✅ All Good'}
                  </span>
                </div>
              </div>
              
              {/* Parameters Preview */}
              <div className="space-y-2">
                <h4 className="font-medium text-foreground text-sm">Parameters ({parameters.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {parameters.map((param, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm">
                      <span className="text-foreground">{param.name}</span>
                      <span className={cn(
                        "font-medium",
                        param.status === 'critical' ? 'text-destructive' :
                        param.status === 'warning' ? 'text-warning-foreground' : 'text-success'
                      )}>
                        {param.value} {param.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full mt-4 p-4 gradient-primary text-white rounded-xl font-semibold"
              >
                Save Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
  const { navigateTo, reports, addReport, selectReport } = useMindMateStore()
  const [filter, setFilter] = useState<'all' | ReportStatus>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  
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
  
  const handleAddReport = (report: Omit<HealthReport, 'id'>) => {
    addReport(report)
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Upload Modal */}
      <UploadReportModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleAddReport}
      />
      
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
          onClick={() => setShowUploadModal(true)}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg hover:bg-primary/90 transition-colors"
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
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-2.5 gradient-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Add Your First Report
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
