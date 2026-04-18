"use client"

import { useEffect, useState } from "react"
import { useMedicineStore } from "@/lib/medicine-store"
import { MedicineCard } from "@/components/medicine-card"
import { AddMedicineDialog } from "@/components/add-medicine-dialog"
import { CaregiverDialog } from "@/components/caregiver-dialog"
import { StreakBanner } from "@/components/streak-banner"
import { DashboardStats } from "@/components/dashboard-stats"
import { Onboarding } from "@/components/onboarding"
import { EmptyState } from "@/components/empty-state"
import { Heart, Settings, Bell, Download, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { 
    userName, 
    medicines, 
    getTodaysDoses, 
    loadSampleMedicines, 
    loadDefaultCaregivers,
    caregivers,
  } = useMedicineStore()
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    if (userName) {
      setIsOnboarded(true)
    }
  }, [userName])

  const todaysDoses = getTodaysDoses()

  const handleFeelingLog = (medicineId: string, timing: string, feeling: 'good' | 'okay' | 'unwell') => {
    const today = new Date().toISOString().split('T')[0]
    const existingLog = todaysDoses.find(
      (d) => d.medicine.id === medicineId && d.timing === timing
    )?.log
    
    if (existingLog) {
      useMedicineStore.getState().updateDoseLog(existingLog.id, { feeling })
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Heart className="w-8 h-8 text-primary" />
        </div>
      </div>
    )
  }

  if (!isOnboarded) {
    return <Onboarding onComplete={() => setIsOnboarded(true)} />
  }

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // Group doses by timing
  const morningDoses = todaysDoses.filter((d) => d.timing === 'morning')
  const afternoonDoses = todaysDoses.filter((d) => d.timing === 'afternoon')
  const eveningDoses = todaysDoses.filter((d) => d.timing === 'evening')
  const nightDoses = todaysDoses.filter((d) => d.timing === 'night')

  const doseGroups = [
    { label: 'Morning', doses: morningDoses },
    { label: 'Afternoon', doses: afternoonDoses },
    { label: 'Evening', doses: eveningDoses },
    { label: 'Night', doses: nightDoses },
  ].filter((group) => group.doses.length > 0)

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">MediMind</h1>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            Hello, {userName}! 👋
          </h2>
          <p className="text-muted-foreground">
            {todaysDoses.length > 0
              ? `You have ${todaysDoses.filter((d) => !d.log || d.log.status === 'pending').length} doses pending today`
              : "No medicines scheduled for today"}
          </p>
        </div>

        {/* Stats */}
        {medicines.length > 0 && <DashboardStats />}

        {/* Streak Banner */}
        {medicines.length > 0 && <StreakBanner />}

        {/* Quick Actions - Load Sample Data */}
        <div className="flex flex-wrap gap-3">
          {medicines.length === 0 && (
            <Button 
              variant="outline" 
              onClick={() => loadSampleMedicines()}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Load 50 Common Medicines
            </Button>
          )}
          {caregivers.length === 0 && (
            <Button 
              variant="outline" 
              onClick={() => loadDefaultCaregivers()}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Load Emergency Contacts
            </Button>
          )}
        </div>

        {/* Medicine List or Empty State */}
        {medicines.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {doseGroups.map((group) => (
              <div key={group.label} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {group.label}
                </h3>
                <div className="space-y-3">
                  {group.doses.map((dose) => (
                    <MedicineCard
                      key={`${dose.medicine.id}-${dose.timing}`}
                      medicine={dose.medicine}
                      timing={dose.timing}
                      log={dose.log}
                      onFeelingLog={handleFeelingLog}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {medicines.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
            <AddMedicineDialog />
            <CaregiverDialog />
          </div>
        </div>
      )}
    </main>
  )
}
