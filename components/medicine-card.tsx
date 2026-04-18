"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMedicineStore, type Medicine, type DoseLog } from "@/lib/medicine-store"
import { Check, Clock, X, Pill, Sun, Sunset, Moon, CloudSun } from "lucide-react"
import { cn } from "@/lib/utils"

interface MedicineCardProps {
  medicine: Medicine
  timing: string
  log: DoseLog | undefined
  onFeelingLog?: (medicineId: string, timing: string, feeling: 'good' | 'okay' | 'unwell') => void
}

const timingIcons = {
  morning: Sun,
  afternoon: CloudSun,
  evening: Sunset,
  night: Moon,
}

const timingLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
}

export function MedicineCard({ medicine, timing, log, onFeelingLog }: MedicineCardProps) {
  const { logDose } = useMedicineStore()
  const [showFeeling, setShowFeeling] = useState(false)
  
  const status = log?.status || 'pending'
  const TimingIcon = timingIcons[timing as keyof typeof timingIcons] || Sun
  const daysRemaining = medicine.quantity
  const percentRemaining = (medicine.quantity / medicine.totalQuantity) * 100

  const handleAction = (action: 'taken' | 'skipped') => {
    const today = new Date().toISOString().split('T')[0]
    logDose({
      medicineId: medicine.id,
      date: today,
      timing,
      status: action,
      timestamp: new Date().toISOString(),
    })
    
    if (action === 'taken') {
      setShowFeeling(true)
    }
  }

  const handleFeeling = (feeling: 'good' | 'okay' | 'unwell') => {
    onFeelingLog?.(medicine.id, timing, feeling)
    setShowFeeling(false)
  }

  return (
    <Card className={cn(
      "transition-all duration-300 border-2",
      status === 'taken' && "border-success bg-success/5",
      status === 'skipped' && "border-destructive/50 bg-destructive/5",
      status === 'pending' && "border-border bg-card"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
              status === 'taken' && "bg-success text-success-foreground",
              status === 'skipped' && "bg-destructive/80 text-destructive-foreground",
              status === 'pending' && "bg-primary/10 text-primary"
            )}>
              <Pill className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-foreground">{medicine.name}</h3>
              <p className="text-muted-foreground text-sm">{medicine.dosage}</p>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <TimingIcon className="w-4 h-4" />
                <span>{timingLabels[timing as keyof typeof timingLabels]}</span>
                {medicine.instructions && (
                  <>
                    <span className="text-border">•</span>
                    <span>{medicine.instructions}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {status === 'taken' && (
            <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-success-foreground" />
            </div>
          )}
          {status === 'skipped' && (
            <div className="w-10 h-10 rounded-full bg-destructive/80 flex items-center justify-center shrink-0">
              <X className="w-5 h-5 text-destructive-foreground" />
            </div>
          )}
        </div>

        {/* Refill Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pills remaining</span>
            <span className={cn(
              "font-medium",
              daysRemaining <= 7 && "text-destructive",
              daysRemaining > 7 && daysRemaining <= 14 && "text-warning",
              daysRemaining > 14 && "text-foreground"
            )}>
              {daysRemaining} pills
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all rounded-full",
                daysRemaining <= 7 && "bg-destructive",
                daysRemaining > 7 && daysRemaining <= 14 && "bg-warning",
                daysRemaining > 14 && "bg-success",
              )}
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {status === 'pending' && !showFeeling && (
          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => handleAction('taken')}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              Taken
            </Button>
            <Button
              onClick={() => handleAction('skipped')}
              variant="outline"
              className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>
        )}

        {/* Feeling Prompt */}
        {showFeeling && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground text-center">How are you feeling?</p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFeeling('good')}
                className="flex-1 text-2xl hover:bg-success/10 hover:border-success"
              >
                😊
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFeeling('okay')}
                className="flex-1 text-2xl hover:bg-warning/10 hover:border-warning"
              >
                😐
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFeeling('unwell')}
                className="flex-1 text-2xl hover:bg-destructive/10 hover:border-destructive"
              >
                😷
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
