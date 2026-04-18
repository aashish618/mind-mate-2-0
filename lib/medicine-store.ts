import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sampleMedicines, defaultCaregivers } from './sample-data'

export interface Medicine {
  id: string
  name: string
  dosage: string
  timing: ('morning' | 'afternoon' | 'evening' | 'night')[]
  instructions: string
  quantity: number
  totalQuantity: number
  startDate: string
  category?: string
}

export interface DoseLog {
  id: string
  medicineId: string
  date: string
  timing: string
  status: 'taken' | 'skipped' | 'pending'
  timestamp?: string
  feeling?: 'good' | 'okay' | 'unwell'
  notes?: string
}

export interface Caregiver {
  id: string
  name: string
  phone: string
  relationship: string
}

interface MedicineStore {
  medicines: Medicine[]
  doseLogs: DoseLog[]
  caregivers: Caregiver[]
  streak: number
  userName: string
  language: 'en' | 'hi'
  
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void
  removeMedicine: (id: string) => void
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void
  
  logDose: (log: Omit<DoseLog, 'id'>) => void
  updateDoseLog: (id: string, updates: Partial<DoseLog>) => void
  
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => void
  removeCaregiver: (id: string) => void
  
  setUserName: (name: string) => void
  setLanguage: (lang: 'en' | 'hi') => void
  calculateStreak: () => number
  
  getTodaysDoses: () => { medicine: Medicine; timing: string; log: DoseLog | undefined }[]
  getMedicineById: (id: string) => Medicine | undefined
  loadSampleMedicines: () => void
  loadDefaultCaregivers: () => void
  clearAllData: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const getToday = () => new Date().toISOString().split('T')[0]

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set, get) => ({
      medicines: [],
      doseLogs: [],
      caregivers: [],
      streak: 0,
      userName: '',
      language: 'en',

      addMedicine: (medicine) => {
        const newMedicine = { ...medicine, id: generateId() }
        set((state) => ({ medicines: [...state.medicines, newMedicine] }))
      },

      removeMedicine: (id) => {
        set((state) => ({
          medicines: state.medicines.filter((m) => m.id !== id),
          doseLogs: state.doseLogs.filter((l) => l.medicineId !== id),
        }))
      },

      updateMedicine: (id, updates) => {
        set((state) => ({
          medicines: state.medicines.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }))
      },

      logDose: (log) => {
        const newLog = { ...log, id: generateId() }
        set((state) => {
          const existingLogIndex = state.doseLogs.findIndex(
            (l) => l.medicineId === log.medicineId && l.date === log.date && l.timing === log.timing
          )
          
          if (existingLogIndex >= 0) {
            const updatedLogs = [...state.doseLogs]
            updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], ...log }
            return { doseLogs: updatedLogs }
          }
          
          return { doseLogs: [...state.doseLogs, newLog] }
        })
        
        // Decrement quantity if taken
        if (log.status === 'taken') {
          const medicine = get().medicines.find((m) => m.id === log.medicineId)
          if (medicine && medicine.quantity > 0) {
            get().updateMedicine(log.medicineId, { quantity: medicine.quantity - 1 })
          }
        }
      },

      updateDoseLog: (id, updates) => {
        set((state) => ({
          doseLogs: state.doseLogs.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        }))
      },

      addCaregiver: (caregiver) => {
        const newCaregiver = { ...caregiver, id: generateId() }
        set((state) => ({ caregivers: [...state.caregivers, newCaregiver] }))
      },

      removeCaregiver: (id) => {
        set((state) => ({
          caregivers: state.caregivers.filter((c) => c.id !== id),
        }))
      },

      setUserName: (name) => set({ userName: name }),
      setLanguage: (lang) => set({ language: lang }),

      calculateStreak: () => {
        const { medicines, doseLogs } = get()
        if (medicines.length === 0) return 0

        let streak = 0
        const today = new Date()
        
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]
          
          const expectedDoses: { medicineId: string; timing: string }[] = []
          medicines.forEach((m) => {
            m.timing.forEach((t) => {
              expectedDoses.push({ medicineId: m.id, timing: t })
            })
          })
          
          const takenDoses = doseLogs.filter(
            (l) => l.date === dateStr && l.status === 'taken'
          )
          
          const allTaken = expectedDoses.every((ed) =>
            takenDoses.some(
              (td) => td.medicineId === ed.medicineId && td.timing === ed.timing
            )
          )
          
          if (allTaken && expectedDoses.length > 0) {
            streak++
          } else if (i > 0) {
            break
          }
        }
        
        set({ streak })
        return streak
      },

      getTodaysDoses: () => {
        const { medicines, doseLogs } = get()
        const today = getToday()
        
        const doses: { medicine: Medicine; timing: string; log: DoseLog | undefined }[] = []
        
        medicines.forEach((medicine) => {
          medicine.timing.forEach((timing) => {
            const log = doseLogs.find(
              (l) => l.medicineId === medicine.id && l.date === today && l.timing === timing
            )
            doses.push({ medicine, timing, log })
          })
        })
        
        return doses
      },

      getMedicineById: (id) => {
        return get().medicines.find((m) => m.id === id)
      },

      loadSampleMedicines: () => {
        const newMedicines = sampleMedicines.map((m) => {
          const { category, ...rest } = m
          return {
            ...rest,
            id: generateId(),
            category,
          }
        })
        set((state) => ({ 
          medicines: [...state.medicines, ...newMedicines] 
        }))
      },

      loadDefaultCaregivers: () => {
        const existingPhones = new Set(get().caregivers.map(c => c.phone))
        const newCaregivers = defaultCaregivers
          .filter(c => !existingPhones.has(c.phone))
          .map((c) => ({
            ...c,
            id: generateId(),
          }))
        set((state) => ({ 
          caregivers: [...state.caregivers, ...newCaregivers] 
        }))
      },

      clearAllData: () => {
        set({
          medicines: [],
          doseLogs: [],
          caregivers: [],
          streak: 0,
          userName: '',
          language: 'en',
        })
      },
    }),
    {
      name: 'medimind-storage',
    }
  )
)
