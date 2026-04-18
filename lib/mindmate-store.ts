import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'dashboard' 
  | 'checkin' 
  | 'checkin-success'
  | 'medicines'
  | 'calendar' 
  | 'toolbox'
  | 'breathing'
  | 'grounding'
  | 'gratitude'
  | 'affirmations'
  | 'insights' 
  | 'resources'
  | 'reports'
  | 'report-detail'
  | 'symptom-checker'

export type Mood = 'great' | 'good' | 'okay' | 'low' | 'rough'

export type BreathingTechnique = 'box' | '478' | 'simple'

export interface CheckIn {
  id: string
  mood: Mood
  energy: number
  note?: string
  timestamp: string
}

export interface Medicine {
  id: string
  name: string
  dosage: string
  timing: ('morning' | 'afternoon' | 'evening' | 'night')[]
  instructions: string
  quantity: number
  totalQuantity: number
  category?: string
}

export interface DoseLog {
  id: string
  medicineId: string
  timing: string
  status: 'taken' | 'skipped'
  feeling?: string
  timestamp: string
}

export interface GratitudeEntry {
  timestamp: string
  items: string[]
}

export type ReportStatus = 'normal' | 'warning' | 'critical'
export type ReportCategory = 'blood' | 'urine' | 'lipid' | 'thyroid' | 'diabetes' | 'liver' | 'kidney' | 'vitamin' | 'general'

export interface ReportParameter {
  name: string
  value: number
  unit: string
  min: number
  max: number
  status: ReportStatus
  description: string
  recommendation?: string
}

export interface HealthReport {
  id: string
  name: string
  category: ReportCategory
  date: string
  lab: string
  doctor?: string
  parameters: ReportParameter[]
  summary: string
  overallStatus: ReportStatus
  aiInsights?: string[]
  followUpDate?: string
}

// Breathing Techniques Config
export const breathingTechniques = {
  box: { name: 'Box Breathing', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, cycles: 4 },
  '478': { name: '4-7-8 Breathing', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0, cycles: 4 },
  simple: { name: 'Simple Deep Breathing', inhale: 4, holdIn: 0, exhale: 4, holdOut: 0, cycles: 6 }
}

export const moodEmojis: Record<Mood, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  low: '😔',
  rough: '😢'
}

// Academic Calendar Data (24 weeks)
export const calendarData = [
  { week: 1, start: 'Jan 5', end: 'Jan 11', days: [
    { day: 'Mon', date: 5, month: 'Jan', event: '' },
    { day: 'Tue', date: 6, month: 'Jan', event: '' },
    { day: 'Wed', date: 7, month: 'Jan', event: 'Commencement of Classes', type: 'event' },
    { day: 'Thu', date: 8, month: 'Jan', event: '' },
    { day: 'Fri', date: 9, month: 'Jan', event: '' },
    { day: 'Sat', date: 10, month: 'Jan', event: '' },
    { day: 'Sun', date: 11, month: 'Jan', event: '' }
  ]},
  { week: 2, start: 'Jan 12', end: 'Jan 18', days: [
    { day: 'Mon', date: 12, month: 'Jan', event: '' },
    { day: 'Tue', date: 13, month: 'Jan', event: '' },
    { day: 'Wed', date: 14, month: 'Jan', event: '' },
    { day: 'Thu', date: 15, month: 'Jan', event: '' },
    { day: 'Fri', date: 16, month: 'Jan', event: '' },
    { day: 'Sat', date: 17, month: 'Jan', event: '' },
    { day: 'Sun', date: 18, month: 'Jan', event: '' }
  ]},
  { week: 3, start: 'Jan 19', end: 'Jan 25', days: [
    { day: 'Mon', date: 19, month: 'Jan', event: 'Registration Closed', type: 'event' },
    { day: 'Tue', date: 20, month: 'Jan', event: '' },
    { day: 'Wed', date: 21, month: 'Jan', event: '' },
    { day: 'Thu', date: 22, month: 'Jan', event: '' },
    { day: 'Fri', date: 23, month: 'Jan', event: '' },
    { day: 'Sat', date: 24, month: 'Jan', event: '' },
    { day: 'Sun', date: 25, month: 'Jan', event: '' }
  ]},
  { week: 4, start: 'Jan 26', end: 'Feb 1', days: [
    { day: 'Mon', date: 26, month: 'Jan', event: 'Republic Day', type: 'holiday' },
    { day: 'Tue', date: 27, month: 'Jan', event: '' },
    { day: 'Wed', date: 28, month: 'Jan', event: '' },
    { day: 'Thu', date: 29, month: 'Jan', event: '' },
    { day: 'Fri', date: 30, month: 'Jan', event: '' },
    { day: 'Sat', date: 31, month: 'Jan', event: '' },
    { day: 'Sun', date: 1, month: 'Feb', event: '' }
  ]},
  { week: 5, start: 'Feb 2', end: 'Feb 8', days: [
    { day: 'Mon', date: 2, month: 'Feb', event: '' },
    { day: 'Tue', date: 3, month: 'Feb', event: '' },
    { day: 'Wed', date: 4, month: 'Feb', event: '' },
    { day: 'Thu', date: 5, month: 'Feb', event: '' },
    { day: 'Fri', date: 6, month: 'Feb', event: 'Citius-2024', type: 'event' },
    { day: 'Sat', date: 7, month: 'Feb', event: 'Citius-2024', type: 'event' },
    { day: 'Sun', date: 8, month: 'Feb', event: 'Citius-2024', type: 'event' }
  ]},
  { week: 6, start: 'Feb 9', end: 'Feb 15', days: [
    { day: 'Mon', date: 9, month: 'Feb', event: '' },
    { day: 'Tue', date: 10, month: 'Feb', event: '' },
    { day: 'Wed', date: 11, month: 'Feb', event: '' },
    { day: 'Thu', date: 12, month: 'Feb', event: '' },
    { day: 'Fri', date: 13, month: 'Feb', event: '' },
    { day: 'Sat', date: 14, month: 'Feb', event: '' },
    { day: 'Sun', date: 15, month: 'Feb', event: 'Mahashivratri', type: 'holiday' }
  ]},
  { week: 7, start: 'Feb 16', end: 'Feb 22', days: [
    { day: 'Mon', date: 16, month: 'Feb', event: '' },
    { day: 'Tue', date: 17, month: 'Feb', event: 'Mid-term Exams-1', type: 'exam' },
    { day: 'Wed', date: 18, month: 'Feb', event: 'Mid-term Exams-1', type: 'exam' },
    { day: 'Thu', date: 19, month: 'Feb', event: 'Mid-term Exams-1', type: 'exam' },
    { day: 'Fri', date: 20, month: 'Feb', event: 'Mid-term Exams-1', type: 'exam' },
    { day: 'Sat', date: 21, month: 'Feb', event: '' },
    { day: 'Sun', date: 22, month: 'Feb', event: '' }
  ]},
  { week: 8, start: 'Feb 23', end: 'Mar 1', days: [
    { day: 'Mon', date: 23, month: 'Feb', event: '' },
    { day: 'Tue', date: 24, month: 'Feb', event: '' },
    { day: 'Wed', date: 25, month: 'Feb', event: '' },
    { day: 'Thu', date: 26, month: 'Feb', event: '' },
    { day: 'Fri', date: 27, month: 'Feb', event: '' },
    { day: 'Sat', date: 28, month: 'Feb', event: '' },
    { day: 'Sun', date: 1, month: 'Mar', event: '' }
  ]},
  { week: 9, start: 'Mar 2', end: 'Mar 8', days: [
    { day: 'Mon', date: 2, month: 'Mar', event: 'Mid-term Break', type: 'break' },
    { day: 'Tue', date: 3, month: 'Mar', event: 'Holi', type: 'holiday' },
    { day: 'Wed', date: 4, month: 'Mar', event: 'Mid-term Break', type: 'break' },
    { day: 'Thu', date: 5, month: 'Mar', event: 'Mid-term Break', type: 'break' },
    { day: 'Fri', date: 6, month: 'Mar', event: 'Mid-term Break', type: 'break' },
    { day: 'Sat', date: 7, month: 'Mar', event: '' },
    { day: 'Sun', date: 8, month: 'Mar', event: '' }
  ]},
  { week: 10, start: 'Mar 9', end: 'Mar 15', days: [
    { day: 'Mon', date: 9, month: 'Mar', event: '' },
    { day: 'Tue', date: 10, month: 'Mar', event: '' },
    { day: 'Wed', date: 11, month: 'Mar', event: '' },
    { day: 'Thu', date: 12, month: 'Mar', event: '' },
    { day: 'Fri', date: 13, month: 'Mar', event: '' },
    { day: 'Sat', date: 14, month: 'Mar', event: '' },
    { day: 'Sun', date: 15, month: 'Mar', event: '' }
  ]}
]

// Sample Medicines Data
export const sampleMedicines: Omit<Medicine, 'id'>[] = [
  { name: 'Paracetamol 500mg', dosage: '1 tablet', timing: ['morning', 'evening'], instructions: 'After meals', quantity: 20, totalQuantity: 30, category: 'pain' },
  { name: 'Vitamin D3', dosage: '1 capsule', timing: ['morning'], instructions: 'With breakfast', quantity: 25, totalQuantity: 30, category: 'vitamins' },
  { name: 'Melatonin 3mg', dosage: '1 tablet', timing: ['night'], instructions: '30 mins before sleep', quantity: 15, totalQuantity: 30, category: 'mental' },
  { name: 'Omega-3', dosage: '1 capsule', timing: ['morning'], instructions: 'With food', quantity: 28, totalQuantity: 30, category: 'vitamins' },
  { name: 'B-Complex', dosage: '1 tablet', timing: ['morning'], instructions: 'After breakfast', quantity: 22, totalQuantity: 30, category: 'vitamins' },
]

// Affirmations
export const affirmations = [
  "I am capable of handling whatever comes my way today.",
  "I deserve to take up space and be heard.",
  "My feelings are valid, and it is okay to feel them.",
  "I am doing the best I can, and that is enough.",
  "I choose to focus on what I can control.",
  "I am worthy of love and kindness, especially from myself.",
  "Every challenge is an opportunity to grow.",
  "I trust myself to make good decisions.",
  "I am resilient and can overcome obstacles.",
  "Today, I choose peace over perfection."
]

const generateId = () => Math.random().toString(36).substring(2, 9)

interface MindMateState {
  // Navigation
  currentScreen: Screen
  onboardingStep: number
  isOnboarded: boolean
  privacyMode: 'anonymous' | 'personalized'
  checkInTime: 'morning' | 'evening'
  
  // Check-in
  checkIns: CheckIn[]
  streak: number
  
  // Medicines
  medicines: Medicine[]
  doseLogs: DoseLog[]
  
  // Gratitude
  gratitudeEntries: GratitudeEntry[]
  
  // Calendar
  currentWeek: number
  
  // Reports
  reports: HealthReport[]
  selectedReportId: string | null
  
  // Actions
  navigateTo: (screen: Screen) => void
  setOnboardingStep: (step: number) => void
  setPrivacyMode: (mode: 'anonymous' | 'personalized') => void
  setCheckInTime: (time: 'morning' | 'evening') => void
  completeOnboarding: () => void
  
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => void
  
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void
  removeMedicine: (id: string) => void
  logDose: (medicineId: string, timing: string, status: 'taken' | 'skipped', feeling?: string) => void
  loadSampleMedicines: () => void
  
  addGratitude: (items: string[]) => void
  
  setCurrentWeek: (week: number) => void
  
  // Reports
  addReport: (report: Omit<HealthReport, 'id'>) => void
  removeReport: (id: string) => void
  selectReport: (id: string | null) => void
  loadSampleReports: () => void
}

export const useMindMateStore = create<MindMateState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentScreen: 'splash',
      onboardingStep: 1,
      isOnboarded: false,
      privacyMode: 'anonymous',
      checkInTime: 'evening',
      checkIns: [],
      streak: 1,
      medicines: [],
      doseLogs: [],
      gratitudeEntries: [],
      currentWeek: 1,
      
      // Navigation
      navigateTo: (screen) => set({ currentScreen: screen }),
      
      // Onboarding
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setPrivacyMode: (mode) => set({ privacyMode: mode }),
      setCheckInTime: (time) => set({ checkInTime: time }),
      completeOnboarding: () => set({ isOnboarded: true, currentScreen: 'dashboard' }),
      
      // Check-ins
      addCheckIn: (checkIn) => {
        const newCheckIn: CheckIn = {
          ...checkIn,
          id: generateId(),
          timestamp: new Date().toISOString()
        }
        set((state) => ({
          checkIns: [newCheckIn, ...state.checkIns],
          streak: state.streak + 1
        }))
      },
      
      // Medicines
      addMedicine: (medicine) => {
        const newMedicine: Medicine = { ...medicine, id: generateId() }
        set((state) => ({ medicines: [...state.medicines, newMedicine] }))
      },
      
      removeMedicine: (id) => {
        set((state) => ({
          medicines: state.medicines.filter((m) => m.id !== id)
        }))
      },
      
      logDose: (medicineId, timing, status, feeling) => {
        const log: DoseLog = {
          id: generateId(),
          medicineId,
          timing,
          status,
          feeling,
          timestamp: new Date().toISOString()
        }
        
        set((state) => {
          const medicine = state.medicines.find(m => m.id === medicineId)
          if (medicine && status === 'taken') {
            return {
              doseLogs: [...state.doseLogs, log],
              medicines: state.medicines.map(m => 
                m.id === medicineId 
                  ? { ...m, quantity: Math.max(0, m.quantity - 1) }
                  : m
              )
            }
          }
          return { doseLogs: [...state.doseLogs, log] }
        })
      },
      
      loadSampleMedicines: () => {
        const newMedicines = sampleMedicines.map(m => ({ ...m, id: generateId() }))
        set((state) => ({ medicines: [...state.medicines, ...newMedicines] }))
      },
      
      // Gratitude
      addGratitude: (items) => {
        const entry: GratitudeEntry = {
          timestamp: new Date().toISOString(),
          items: items.filter(i => i.trim())
        }
        set((state) => ({ gratitudeEntries: [entry, ...state.gratitudeEntries] }))
      },
      
      // Calendar
      setCurrentWeek: (week) => set({ currentWeek: week }),
      
      // Reports
      reports: [],
      selectedReportId: null,
      
      addReport: (report) => {
        const newReport: HealthReport = { ...report, id: generateId() }
        set((state) => ({ reports: [...state.reports, newReport] }))
      },
      
      removeReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id)
        }))
      },
      
      selectReport: (id) => set({ selectedReportId: id }),
      
      loadSampleReports: () => {
        const sampleReports: Omit<HealthReport, 'id'>[] = [
          {
            name: 'Complete Blood Count (CBC)',
            category: 'blood',
            date: '2026-04-15',
            lab: 'HealthFirst Diagnostics',
            doctor: 'Dr. Sharma',
            overallStatus: 'warning',
            summary: 'Most values are within normal range. Hemoglobin is slightly low, which may indicate mild anemia. Vitamin D levels require attention.',
            aiInsights: [
              'Your hemoglobin has been trending down over the last 3 reports. Consider iron-rich foods.',
              'Low Vitamin D is common but easily correctable with supplements and sun exposure.',
              'Overall blood health is good - keep up with regular check-ups.'
            ],
            followUpDate: '2026-05-15',
            parameters: [
              { name: 'Hemoglobin', value: 11.2, unit: 'g/dL', min: 12, max: 16, status: 'warning', description: 'Oxygen-carrying protein in blood', recommendation: 'Include iron-rich foods like spinach, lentils, and red meat' },
              { name: 'RBC Count', value: 4.5, unit: 'million/μL', min: 4.0, max: 5.5, status: 'normal', description: 'Red blood cell count' },
              { name: 'WBC Count', value: 7.2, unit: 'thousand/μL', min: 4.0, max: 11.0, status: 'normal', description: 'White blood cell count - immunity indicator' },
              { name: 'Platelets', value: 250, unit: 'thousand/μL', min: 150, max: 400, status: 'normal', description: 'Blood clotting cells' },
              { name: 'Vitamin D', value: 18, unit: 'ng/mL', min: 30, max: 100, status: 'critical', description: 'Essential for bone health and immunity', recommendation: 'Take Vitamin D3 supplements and get 15-20 mins of morning sunlight' },
              { name: 'Iron', value: 55, unit: 'μg/dL', min: 60, max: 170, status: 'warning', description: 'Essential mineral for hemoglobin production', recommendation: 'Pair iron-rich foods with Vitamin C for better absorption' }
            ]
          },
          {
            name: 'Lipid Profile',
            category: 'lipid',
            date: '2026-04-10',
            lab: 'City Medical Labs',
            doctor: 'Dr. Patel',
            overallStatus: 'critical',
            summary: 'LDL cholesterol is elevated which increases cardiovascular risk. HDL (good cholesterol) is within range. Immediate lifestyle changes recommended.',
            aiInsights: [
              'Your LDL has increased by 15% since last test. Diet modification is crucial.',
              'Good news: Your HDL levels are healthy, providing some protection.',
              'Consider reducing saturated fats and increasing omega-3 intake.'
            ],
            followUpDate: '2026-05-10',
            parameters: [
              { name: 'Total Cholesterol', value: 245, unit: 'mg/dL', min: 0, max: 200, status: 'critical', description: 'Total cholesterol in blood', recommendation: 'Reduce fried foods and processed snacks' },
              { name: 'LDL Cholesterol', value: 165, unit: 'mg/dL', min: 0, max: 100, status: 'critical', description: 'Bad cholesterol - clogs arteries', recommendation: 'Add more fiber, reduce red meat, exercise 30 mins daily' },
              { name: 'HDL Cholesterol', value: 52, unit: 'mg/dL', min: 40, max: 60, status: 'normal', description: 'Good cholesterol - protects heart' },
              { name: 'Triglycerides', value: 180, unit: 'mg/dL', min: 0, max: 150, status: 'warning', description: 'Fat in blood', recommendation: 'Limit sugar, alcohol, and refined carbs' }
            ]
          },
          {
            name: 'Thyroid Panel',
            category: 'thyroid',
            date: '2026-03-28',
            lab: 'Wellness Diagnostics',
            doctor: 'Dr. Kumar',
            overallStatus: 'normal',
            summary: 'All thyroid markers are within optimal range. Thyroid function is healthy.',
            aiInsights: [
              'Excellent thyroid health! Your levels have been stable for 6 months.',
              'Continue with your current lifestyle - it is working well.',
              'Next thyroid check recommended in 6 months.'
            ],
            parameters: [
              { name: 'TSH', value: 2.5, unit: 'mIU/L', min: 0.4, max: 4.0, status: 'normal', description: 'Thyroid stimulating hormone' },
              { name: 'T3', value: 120, unit: 'ng/dL', min: 80, max: 200, status: 'normal', description: 'Active thyroid hormone' },
              { name: 'T4', value: 7.5, unit: 'μg/dL', min: 4.5, max: 12.0, status: 'normal', description: 'Main thyroid hormone' }
            ]
          },
          {
            name: 'Diabetes Panel (HbA1c)',
            category: 'diabetes',
            date: '2026-04-01',
            lab: 'HealthFirst Diagnostics',
            doctor: 'Dr. Sharma',
            overallStatus: 'warning',
            summary: 'Fasting glucose is slightly elevated indicating pre-diabetic range. HbA1c shows borderline values. Lifestyle modifications recommended.',
            aiInsights: [
              'You are in the pre-diabetic range - this is reversible with action now.',
              'Regular exercise can improve insulin sensitivity by up to 40%.',
              'Consider reducing refined carbs and sugary beverages.'
            ],
            followUpDate: '2026-07-01',
            parameters: [
              { name: 'Fasting Glucose', value: 115, unit: 'mg/dL', min: 70, max: 100, status: 'warning', description: 'Blood sugar after fasting', recommendation: 'Monitor carb intake, avoid sugar on empty stomach' },
              { name: 'HbA1c', value: 5.9, unit: '%', min: 4.0, max: 5.6, status: 'warning', description: '3-month average blood sugar', recommendation: 'Aim for 150 mins of moderate exercise weekly' },
              { name: 'Post-Prandial Glucose', value: 145, unit: 'mg/dL', min: 70, max: 140, status: 'warning', description: 'Blood sugar 2 hours after meal', recommendation: 'Take a 10-min walk after meals' }
            ]
          }
        ]
        
        const newReports = sampleReports.map(r => ({ ...r, id: generateId() }))
        set((state) => ({ reports: [...state.reports, ...newReports] }))
      }
    }),
    {
      name: 'mindmate-storage'
    }
  )
)
