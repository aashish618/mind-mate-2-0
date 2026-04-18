"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMedicineStore } from "@/lib/medicine-store"
import { Users, UserPlus, Phone, Heart, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const relationshipOptions = [
  { id: 'child', label: 'Son/Daughter' },
  { id: 'spouse', label: 'Spouse' },
  { id: 'sibling', label: 'Sibling' },
  { id: 'friend', label: 'Friend' },
  { id: 'other', label: 'Other' },
]

export function CaregiverDialog() {
  const { caregivers, addCaregiver, removeCaregiver } = useMedicineStore()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [relationship, setRelationship] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !phone || !relationship) return

    addCaregiver({
      name,
      phone,
      relationship,
    })

    // Reset form
    setName("")
    setPhone("")
    setRelationship("")
    setShowForm(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-full border-2">
          <Users className="w-5 h-5 mr-2" />
          Caregivers
          {caregivers.length > 0 && (
            <span className="ml-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              {caregivers.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            Family Caregivers
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Caregivers will be notified when you miss a dose. They&apos;ll receive alerts via WhatsApp.
          </p>

          {/* Existing Caregivers */}
          {caregivers.length > 0 && (
            <div className="space-y-3">
              {caregivers.map((caregiver) => (
                <div
                  key={caregiver.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{caregiver.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {caregiver.phone}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCaregiver(caregiver.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Form */}
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl bg-secondary/30">
              <div className="space-y-2">
                <Label htmlFor="caregiver-name">Name</Label>
                <Input
                  id="caregiver-name"
                  placeholder="e.g., Priya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 bg-card"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caregiver-phone">WhatsApp Number</Label>
                <Input
                  id="caregiver-phone"
                  placeholder="e.g., +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 bg-card"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Relationship</Label>
                <div className="flex flex-wrap gap-2">
                  {relationshipOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRelationship(option.id)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        relationship === option.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:bg-primary/10"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={!name || !phone || !relationship}
                >
                  Add Caregiver
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2"
              onClick={() => setShowForm(true)}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Caregiver
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
