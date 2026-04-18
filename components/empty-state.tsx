"use client"

import { Pill, Plus } from "lucide-react"
import { AddMedicineDialog } from "./add-medicine-dialog"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <Pill className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">No medicines yet</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Add your first medicine to start tracking your doses and building healthy habits.
      </p>
      <AddMedicineDialog />
    </div>
  )
}
