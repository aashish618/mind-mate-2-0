"use client"

import { useState, useEffect, useRef } from "react"
import { useMindMateStore, type ReportStatus, type ReportCategory, type HealthReport, type ReportParameter } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { cn } from "@/lib/utils"

// Predefined parameter templates for each category
type ParameterTemplate = {
  name: string
  unit: string
  min: number
  max: number
  description: string
  lowRecommendation: string
  highRecommendation: string
}

const categoryParameterTemplates: Record<ReportCategory, ParameterTemplate[]> = {
  blood: [
    { name: 'Hemoglobin', unit: 'g/dL', min: 12, max: 16, description: 'Oxygen-carrying protein in red blood cells', lowRecommendation: 'Include iron-rich foods like spinach, lentils, and red meat', highRecommendation: 'Stay hydrated and consult doctor if persistently high' },
    { name: 'RBC Count', unit: 'million/uL', min: 4.0, max: 5.5, description: 'Red blood cell count in your blood', lowRecommendation: 'Consider iron and B12 supplements after consulting doctor', highRecommendation: 'May indicate dehydration or other conditions, consult doctor' },
    { name: 'WBC Count', unit: 'thousand/uL', min: 4.0, max: 11.0, description: 'White blood cells that fight infection', lowRecommendation: 'Boost immunity with vitamin C and zinc-rich foods', highRecommendation: 'May indicate infection or inflammation, monitor closely' },
    { name: 'Platelets', unit: 'thousand/uL', min: 150, max: 400, description: 'Cells that help blood clot', lowRecommendation: 'Avoid blood thinners, eat leafy greens', highRecommendation: 'Stay hydrated, avoid smoking' },
    { name: 'Hematocrit', unit: '%', min: 36, max: 48, description: 'Percentage of blood made up of red blood cells', lowRecommendation: 'May indicate anemia, increase iron intake', highRecommendation: 'Stay well hydrated' },
  ],
  lipid: [
    { name: 'Total Cholesterol', unit: 'mg/dL', min: 0, max: 200, description: 'Total amount of cholesterol in blood', lowRecommendation: 'Healthy fats are okay in moderation', highRecommendation: 'Reduce fried foods, exercise regularly' },
    { name: 'LDL Cholesterol', unit: 'mg/dL', min: 0, max: 100, description: 'Bad cholesterol that can clog arteries', lowRecommendation: 'No action needed, this is good', highRecommendation: 'Reduce saturated fats, add more fiber to diet' },
    { name: 'HDL Cholesterol', unit: 'mg/dL', min: 40, max: 100, description: 'Good cholesterol that protects heart', lowRecommendation: 'Exercise more, eat healthy fats like olive oil and nuts', highRecommendation: 'Usually not a concern, keep exercising' },
    { name: 'Triglycerides', unit: 'mg/dL', min: 0, max: 150, description: 'Fat in your blood from food', lowRecommendation: 'Usually not a concern', highRecommendation: 'Limit sugar, alcohol and refined carbs' },
    { name: 'VLDL Cholesterol', unit: 'mg/dL', min: 0, max: 30, description: 'Very low density lipoprotein', lowRecommendation: 'No action needed', highRecommendation: 'Reduce fatty foods and increase exercise' },
  ],
  thyroid: [
    { name: 'TSH', unit: 'mIU/L', min: 0.4, max: 4.0, description: 'Thyroid stimulating hormone', lowRecommendation: 'May indicate overactive thyroid, consult doctor', highRecommendation: 'May indicate underactive thyroid, consult doctor' },
    { name: 'T3 (Total)', unit: 'ng/dL', min: 80, max: 200, description: 'Active thyroid hormone', lowRecommendation: 'May indicate hypothyroidism', highRecommendation: 'May indicate hyperthyroidism' },
    { name: 'T4 (Total)', unit: 'ug/dL', min: 4.5, max: 12.0, description: 'Main thyroid hormone', lowRecommendation: 'Thyroid may be underactive', highRecommendation: 'Thyroid may be overactive' },
    { name: 'Free T3', unit: 'pg/mL', min: 2.3, max: 4.2, description: 'Unbound active thyroid hormone', lowRecommendation: 'Consult endocrinologist', highRecommendation: 'Consult endocrinologist' },
    { name: 'Free T4', unit: 'ng/dL', min: 0.8, max: 1.8, description: 'Unbound thyroxine hormone', lowRecommendation: 'May need thyroid medication', highRecommendation: 'May need to reduce thyroid activity' },
  ],
  diabetes: [
    { name: 'Fasting Glucose', unit: 'mg/dL', min: 70, max: 100, description: 'Blood sugar after 8-12 hours fasting', lowRecommendation: 'Eat regular meals, avoid skipping breakfast', highRecommendation: 'Reduce sugar intake, exercise regularly' },
    { name: 'HbA1c', unit: '%', min: 4.0, max: 5.6, description: 'Average blood sugar over 3 months', lowRecommendation: 'Ensure adequate nutrition', highRecommendation: 'Control carb intake, increase physical activity' },
    { name: 'Post-Prandial Glucose', unit: 'mg/dL', min: 70, max: 140, description: 'Blood sugar 2 hours after eating', lowRecommendation: 'Eat balanced meals', highRecommendation: 'Take a 10-minute walk after meals' },
    { name: 'Fasting Insulin', unit: 'uIU/mL', min: 2.6, max: 24.9, description: 'Insulin level when fasting', lowRecommendation: 'Consult doctor about insulin production', highRecommendation: 'May indicate insulin resistance, lose weight if overweight' },
  ],
  liver: [
    { name: 'ALT (SGPT)', unit: 'U/L', min: 7, max: 56, description: 'Liver enzyme for protein metabolism', lowRecommendation: 'Usually not a concern', highRecommendation: 'Avoid alcohol, fatty foods, and unnecessary medications' },
    { name: 'AST (SGOT)', unit: 'U/L', min: 10, max: 40, description: 'Enzyme found in liver and heart', lowRecommendation: 'Usually not a concern', highRecommendation: 'May indicate liver stress, reduce alcohol' },
    { name: 'ALP', unit: 'U/L', min: 44, max: 147, description: 'Alkaline phosphatase enzyme', lowRecommendation: 'May indicate nutritional deficiency', highRecommendation: 'May indicate liver or bone issues' },
    { name: 'Bilirubin (Total)', unit: 'mg/dL', min: 0.1, max: 1.2, description: 'Waste product from red blood cell breakdown', lowRecommendation: 'Usually not a concern', highRecommendation: 'May cause jaundice, consult doctor' },
    { name: 'Albumin', unit: 'g/dL', min: 3.5, max: 5.0, description: 'Protein made by liver', lowRecommendation: 'Increase protein intake', highRecommendation: 'Stay hydrated' },
  ],
  kidney: [
    { name: 'Creatinine', unit: 'mg/dL', min: 0.6, max: 1.2, description: 'Waste product filtered by kidneys', lowRecommendation: 'May indicate low muscle mass', highRecommendation: 'Stay hydrated, limit protein if advised' },
    { name: 'BUN', unit: 'mg/dL', min: 7, max: 20, description: 'Blood urea nitrogen from protein breakdown', lowRecommendation: 'May indicate low protein diet', highRecommendation: 'Drink more water, reduce protein intake' },
    { name: 'Uric Acid', unit: 'mg/dL', min: 3.5, max: 7.2, description: 'Waste from digesting certain foods', lowRecommendation: 'Usually not a concern', highRecommendation: 'Avoid red meat, shellfish, and alcohol' },
    { name: 'eGFR', unit: 'mL/min', min: 90, max: 120, description: 'Estimated kidney filtration rate', lowRecommendation: 'May indicate reduced kidney function, consult doctor', highRecommendation: 'Usually not a concern' },
  ],
  vitamin: [
    { name: 'Vitamin D', unit: 'ng/mL', min: 30, max: 100, description: 'Essential for bones and immunity', lowRecommendation: 'Get 15-20 mins morning sunlight, consider supplements', highRecommendation: 'Reduce supplements if taking' },
    { name: 'Vitamin B12', unit: 'pg/mL', min: 200, max: 900, description: 'Essential for nerves and blood cells', lowRecommendation: 'Eat more eggs, dairy, meat or take supplements', highRecommendation: 'Usually not harmful, reduce supplements' },
    { name: 'Iron', unit: 'ug/dL', min: 60, max: 170, description: 'Mineral for hemoglobin production', lowRecommendation: 'Eat iron-rich foods with vitamin C', highRecommendation: 'Avoid iron supplements, consult doctor' },
    { name: 'Ferritin', unit: 'ng/mL', min: 12, max: 300, description: 'Iron storage protein', lowRecommendation: 'Increase iron intake', highRecommendation: 'May indicate inflammation or iron overload' },
    { name: 'Folate', unit: 'ng/mL', min: 2.7, max: 17.0, description: 'B vitamin for cell growth', lowRecommendation: 'Eat leafy greens, beans, fortified cereals', highRecommendation: 'Reduce folic acid supplements' },
    { name: 'Calcium', unit: 'mg/dL', min: 8.5, max: 10.5, description: 'Mineral for bones and muscles', lowRecommendation: 'Increase dairy, leafy greens, consider supplements', highRecommendation: 'Reduce calcium supplements, stay hydrated' },
  ],
  urine: [
    { name: 'pH Level', unit: '', min: 4.5, max: 8.0, description: 'Acidity/alkalinity of urine', lowRecommendation: 'Drink more water, eat less protein', highRecommendation: 'May indicate UTI or kidney issues' },
    { name: 'Specific Gravity', unit: '', min: 1.005, max: 1.030, description: 'Concentration of urine', lowRecommendation: 'May indicate overhydration or kidney issue', highRecommendation: 'Drink more water, may be dehydrated' },
    { name: 'Protein', unit: 'mg/dL', min: 0, max: 14, description: 'Protein in urine', lowRecommendation: 'Normal, no action needed', highRecommendation: 'May indicate kidney stress, consult doctor' },
    { name: 'Glucose', unit: 'mg/dL', min: 0, max: 15, description: 'Sugar in urine', lowRecommendation: 'Normal, no action needed', highRecommendation: 'May indicate diabetes, check blood sugar' },
  ],
  general: [
    { name: 'Blood Pressure (Systolic)', unit: 'mmHg', min: 90, max: 120, description: 'Pressure when heart beats', lowRecommendation: 'Increase salt and fluid intake if symptomatic', highRecommendation: 'Reduce salt, exercise, manage stress' },
    { name: 'Blood Pressure (Diastolic)', unit: 'mmHg', min: 60, max: 80, description: 'Pressure between heartbeats', lowRecommendation: 'Stay hydrated, rise slowly from sitting', highRecommendation: 'Lifestyle changes and possibly medication needed' },
    { name: 'Heart Rate', unit: 'bpm', min: 60, max: 100, description: 'Heartbeats per minute', lowRecommendation: 'May be athletic, consult if symptomatic', highRecommendation: 'Practice relaxation, reduce caffeine' },
    { name: 'BMI', unit: 'kg/m2', min: 18.5, max: 24.9, description: 'Body Mass Index', lowRecommendation: 'Increase caloric intake with nutritious foods', highRecommendation: 'Focus on balanced diet and regular exercise' },
  ],
}

// Type for parameter values input
type ParameterValueInput = {
  template: ParameterTemplate
  value: string
  included: boolean
}

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
  
  // Parameter value inputs based on category templates
  const [parameterInputs, setParameterInputs] = useState<ParameterValueInput[]>([])
  
  // Initialize parameter inputs when category changes
  const initializeParameterInputs = (cat: ReportCategory) => {
    const templates = categoryParameterTemplates[cat]
    setParameterInputs(templates.map(template => ({
      template,
      value: '',
      included: true
    })))
  }
  
  // Handle category change
  const handleCategoryChange = (newCategory: ReportCategory) => {
    setCategory(newCategory)
    initializeParameterInputs(newCategory)
    // Auto-set report name based on category
    setReportName(categoryLabels[newCategory])
  }
  
  // Update parameter value
  const updateParameterValue = (index: number, value: string) => {
    setParameterInputs(prev => prev.map((p, i) => 
      i === index ? { ...p, value } : p
    ))
  }
  
  // Toggle parameter inclusion
  const toggleParameterIncluded = (index: number) => {
    setParameterInputs(prev => prev.map((p, i) => 
      i === index ? { ...p, included: !p.included } : p
    ))
  }
  
  // Build final parameters from inputs
  const buildParameters = (): ReportParameter[] => {
    return parameterInputs
      .filter(p => p.included && p.value !== '')
      .map(p => {
        const value = parseFloat(p.value)
        const { min, max, name, unit, description, lowRecommendation, highRecommendation } = p.template
        
        let status: ReportStatus = 'normal'
        const isLow = value < min
        const isHigh = value > max
        
        if (value < min * 0.8 || value > max * 1.2) status = 'critical'
        else if (isLow || isHigh) status = 'warning'
        
        const param: ReportParameter = {
          name,
          value,
          unit,
          min,
          max,
          status,
          description,
        }
        
        if (status !== 'normal') {
          param.recommendation = isLow ? lowRecommendation : highRecommendation
        }
        
        return param
      })
  }
  
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
    setParameterInputs([])
  }
  
  const handleClose = () => {
    resetForm()
    onClose()
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setReportName('Uploaded Report')
      setCategory('general')
      initializeParameterInputs('general')
      setLab('Lab from document')
      setStep('details')
    }
  }
  
  const calculateOverallStatus = (params: ReportParameter[]): ReportStatus => {
    if (params.some(p => p.status === 'critical')) return 'critical'
    if (params.some(p => p.status === 'warning')) return 'warning'
    return 'normal'
  }
  
  const handleSubmit = () => {
    const finalParameters = buildParameters()
    const overallStatus = calculateOverallStatus(finalParameters)
    const criticalCount = finalParameters.filter(p => p.status === 'critical').length
    const warningCount = finalParameters.filter(p => p.status === 'warning').length
    
    const report: Omit<HealthReport, 'id'> = {
      name: reportName,
      category,
      date,
      lab,
      doctor: doctor || undefined,
      parameters: finalParameters,
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
                onClick={() => { 
                  setUploadMethod('manual')
                  initializeParameterInputs('blood')
                  setReportName(categoryLabels['blood'])
                  setStep('details') 
                }}
                className="w-full p-4 bg-muted/50 hover:bg-muted rounded-xl border border-border flex items-center gap-4 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  ✍️
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-foreground">Enter Report</h3>
                  <p className="text-sm text-muted-foreground">Select test type and enter your values</p>
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
                <label className="text-sm font-medium text-foreground mb-1.5 block">Report Type *</label>
                <p className="text-xs text-muted-foreground mb-2">Select the type and we will show you the relevant parameters</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(categoryConfig) as ReportCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
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
                Next: Enter Your Values
              </button>
            </div>
          )}
          
          {step === 'parameters' && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
                <p className="text-sm text-foreground font-medium">Enter your test values</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Just fill in the values from your report. We have pre-filled the normal ranges for you.
                </p>
              </div>
              
              {/* Parameter Input Cards */}
              <div className="space-y-3">
                {parameterInputs.map((paramInput, index) => {
                  const { template, value, included } = paramInput
                  const numValue = parseFloat(value)
                  const hasValue = value !== '' && !isNaN(numValue)
                  
                  // Calculate status for preview
                  let previewStatus: ReportStatus = 'normal'
                  if (hasValue) {
                    if (numValue < template.min * 0.8 || numValue > template.max * 1.2) previewStatus = 'critical'
                    else if (numValue < template.min || numValue > template.max) previewStatus = 'warning'
                  }
                  
                  const isLow = hasValue && numValue < template.min
                  const isHigh = hasValue && numValue > template.max
                  
                  return (
                    <div 
                      key={template.name}
                      className={cn(
                        "rounded-xl border-2 overflow-hidden transition-all",
                        !included ? "opacity-50 border-border" :
                        hasValue && previewStatus === 'critical' ? "border-destructive/50 bg-destructive/5" :
                        hasValue && previewStatus === 'warning' ? "border-warning/50 bg-warning/5" :
                        hasValue ? "border-success/50 bg-success/5" : "border-border bg-card"
                      )}
                    >
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          {/* Toggle checkbox */}
                          <button
                            onClick={() => toggleParameterIncluded(index)}
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                              included ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                            )}
                          >
                            {included && <span className="text-xs">✓</span>}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-medium text-foreground text-sm">{template.name}</h4>
                              {hasValue && included && (
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full font-medium",
                                  previewStatus === 'critical' ? "bg-destructive text-destructive-foreground" :
                                  previewStatus === 'warning' ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground"
                                )}>
                                  {previewStatus === 'critical' ? (isLow ? "Too Low" : "Too High") :
                                   previewStatus === 'warning' ? (isLow ? "Low" : "High") : "Normal"}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                            
                            {/* Value Input */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  step="any"
                                  value={value}
                                  onChange={(e) => updateParameterValue(index, e.target.value)}
                                  placeholder="Enter value"
                                  disabled={!included}
                                  className="w-full p-2.5 pr-16 bg-background rounded-lg border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                  {template.unit}
                                </span>
                              </div>
                            </div>
                            
                            {/* Normal Range */}
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">Normal range:</span>
                              <span className="font-medium text-success">{template.min} - {template.max} {template.unit}</span>
                            </div>
                            
                            {/* Status indicator with recommendation preview */}
                            {hasValue && included && previewStatus !== 'normal' && (
                              <div className={cn(
                                "mt-2 p-2 rounded-lg text-xs",
                                previewStatus === 'critical' ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning-foreground"
                              )}>
                                {isLow ? template.lowRecommendation : template.highRecommendation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Summary */}
              {parameterInputs.some(p => p.included && p.value !== '') && (
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{parameterInputs.filter(p => p.included && p.value !== '').length}</span> parameters entered
                  </p>
                </div>
              )}
              
              <button
                onClick={() => {
                  setParameters(buildParameters())
                  setStep('review')
                }}
                disabled={!parameterInputs.some(p => p.included && p.value !== '')}
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
                  calculateOverallStatus(parameters) === 'critical' ? 'bg-destructive/20' :
                  calculateOverallStatus(parameters) === 'warning' ? 'bg-warning/20' : 'bg-success/20'
                )}>
                  <span className={cn(
                    "text-sm font-semibold",
                    calculateOverallStatus(parameters) === 'critical' ? 'text-destructive' :
                    calculateOverallStatus(parameters) === 'warning' ? 'text-warning-foreground' : 'text-success'
                  )}>
                    Overall Status: {calculateOverallStatus(parameters) === 'critical' ? 'Needs Attention' :
                                     calculateOverallStatus(parameters) === 'warning' ? 'Monitor Closely' : 'All Good'}
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
