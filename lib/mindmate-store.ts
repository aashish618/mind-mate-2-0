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
      setCurrentWeek: (week) => set({ currentWeek: week })
    }),
    {
      name: 'mindmate-storage'
    }
  )
)
