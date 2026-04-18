"use client"

import { useMedicineStore } from "@/lib/medicine-store"
import { Pill, Check, Clock, AlertTriangle } from "lucide-react"

export function DashboardStats() {
  const { getTodaysDoses, medicines } = useMedicineStore()
  const todaysDoses = getTodaysDoses()
  
  const totalDoses = todaysDoses.length
  const takenDoses = todaysDoses.filter((d) => d.log?.status === 'taken').length
  const pendingDoses = todaysDoses.filter((d) => !d.log || d.log.status === 'pending').length
  const lowStock = medicines.filter((m) => m.quantity <= 7).length

  const stats = [
    {
      label: 'Total Doses',
      value: totalDoses,
      icon: Pill,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Taken',
      value: takenDoses,
      icon: Check,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Pending',
      value: pendingDoses,
      icon: Clock,
      color: 'bg-warning/10 text-warning',
    },
    {
      label: 'Low Stock',
      value: lowStock,
      icon: AlertTriangle,
      color: lowStock > 0 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="flex flex-col items-center p-4 rounded-xl bg-card border border-border"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
          </div>
        )
      })}
    </div>
  )
}
