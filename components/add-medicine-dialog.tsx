"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMedicineStore } from "@/lib/medicine-store"
import { Plus, Sun, CloudSun, Sunset, Moon, Pill } from "lucide-react"
import { cn } from "@/lib/utils"

const timingOptions = [
  { id: 'morning', label: 'Morning', icon: Sun, time: '8:00 AM' },
  { id: 'afternoon', label: 'Afternoon', icon: CloudSun, time: '2:00 PM' },
  { id: 'evening', label: 'Evening', icon: Sunset, time: '6:00 PM' },
  { id: 'night', label: 'Night', icon: Moon, time: '10:00 PM' },
]

export function AddMedicineDialog() {
  const { addMedicine } = useMedicineStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [quantity, setQuantity] = useState("")
  const [instructions, setInstructions] = useState("")
  const [selectedTimings, setSelectedTimings] = useState<string[]>([])

  const toggleTiming = (timing: string) => {
    setSelectedTimings((prev) =>
      prev.includes(timing) ? prev.filter((t) => t !== timing) : [...prev, timing]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || selectedTimings.length === 0 || !quantity) return

    addMedicine({
      name,
      dosage,
      timing: selectedTimings as ('morning' | 'afternoon' | 'evening' | 'night')[],
      instructions,
      quantity: parseInt(quantity),
      totalQuantity: parseInt(quantity),
      startDate: new Date().toISOString().split('T')[0],
    })

    // Reset form
    setName("")
    setDosage("")
    setQuantity("")
    setInstructions("")
    setSelectedTimings([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90">
          <Plus className="w-5 h-5 mr-2" />
          Add Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            Add New Medicine
          </DialogTitle>
          <DialogDescription>
            Enter the medicine details including name, dosage, and when to take it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Medicine Name</Label>
            <Input
              id="name"
              placeholder="e.g., Metformin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-foreground">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 500mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="h-12 bg-secondary/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">Quantity in Hand</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="e.g., 30 tablets"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-12 bg-secondary/50 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-foreground">Instructions</Label>
            <Input
              id="instructions"
              placeholder="e.g., After meals"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="h-12 bg-secondary/50 border-border"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">When to take</Label>
            <div className="grid grid-cols-2 gap-3">
              {timingOptions.map((option) => {
                const Icon = option.icon
                const isSelected = selectedTimings.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleTiming(option.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{option.label}</span>
                    <span className="text-xs opacity-70">{option.time}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            disabled={!name || selectedTimings.length === 0 || !quantity}
          >
            Add Medicine
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
