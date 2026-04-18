"use client"

import { useState } from "react"
import { useMedicineStore, Medicine } from "@/lib/medicine-store"
import { medicineCategories, MedicineCategory } from "@/lib/sample-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Heart,
  Droplet,
  Thermometer,
  Shield,
  Apple,
  Wind,
  Sun,
  Activity,
  Brain,
  Zap,
  Droplets,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Pill,
  Trash2,
  X,
} from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  cardiovascular: <Heart className="w-4 h-4" />,
  diabetes: <Droplet className="w-4 h-4" />,
  pain: <Thermometer className="w-4 h-4" />,
  antibiotics: <Shield className="w-4 h-4" />,
  gastric: <Apple className="w-4 h-4" />,
  respiratory: <Wind className="w-4 h-4" />,
  vitamins: <Sun className="w-4 h-4" />,
  thyroid: <Activity className="w-4 h-4" />,
  mental: <Brain className="w-4 h-4" />,
  steroids: <Zap className="w-4 h-4" />,
  urinary: <Droplets className="w-4 h-4" />,
  nerve: <Sparkles className="w-4 h-4" />,
}

interface MedicineBrowserProps {
  viewMode: 'timing' | 'category'
}

export function MedicineBrowser({ viewMode }: MedicineBrowserProps) {
  const { medicines, removeMedicine, getTodaysDoses } = useMedicineStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(medicineCategories)))
  const [expandedTimings, setExpandedTimings] = useState<Set<string>>(new Set(['morning', 'afternoon', 'evening', 'night']))

  const todaysDoses = getTodaysDoses()

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleTiming = (timing: string) => {
    const newExpanded = new Set(expandedTimings)
    if (newExpanded.has(timing)) {
      newExpanded.delete(timing)
    } else {
      newExpanded.add(timing)
    }
    setExpandedTimings(newExpanded)
  }

  // Filter medicines by search query
  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (med.instructions && med.instructions.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Group medicines by category
  const getMedicinesByCategory = () => {
    const grouped: Record<string, Medicine[]> = {}
    Object.keys(medicineCategories).forEach((cat) => {
      grouped[cat] = []
    })
    grouped['uncategorized'] = []

    filteredMedicines.forEach((med) => {
      const cat = med.category || 'uncategorized'
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push(med)
    })

    return grouped
  }

  // Group medicines by timing
  const getMedicinesByTiming = () => {
    const grouped: Record<string, Medicine[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
    }

    filteredMedicines.forEach((med) => {
      med.timing.forEach((t) => {
        if (grouped[t]) {
          grouped[t].push(med)
        }
      })
    })

    return grouped
  }

  const timingLabels: Record<string, string> = {
    morning: "Morning (6 AM - 12 PM)",
    afternoon: "Afternoon (12 PM - 5 PM)",
    evening: "Evening (5 PM - 9 PM)",
    night: "Night (9 PM - 6 AM)",
  }

  const timingColors: Record<string, string> = {
    morning: "bg-amber-100 text-amber-800 border-amber-200",
    afternoon: "bg-orange-100 text-orange-800 border-orange-200",
    evening: "bg-purple-100 text-purple-800 border-purple-200",
    night: "bg-indigo-100 text-indigo-800 border-indigo-200",
  }

  const getDoseStatus = (medicineId: string, timing: string) => {
    const dose = todaysDoses.find((d) => d.medicine.id === medicineId && d.timing === timing)
    return dose?.log?.status
  }

  if (viewMode === 'category') {
    const grouped = getMedicinesByCategory()
    const categoriesWithMedicines = Object.entries(grouped).filter(([_, meds]) => meds.length > 0)

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Category Groups */}
        {categoriesWithMedicines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No medicines found
          </div>
        ) : (
          categoriesWithMedicines.map(([category, meds]) => {
            const catInfo = medicineCategories[category as MedicineCategory]
            const isExpanded = expandedCategories.has(category)

            return (
              <Card key={category} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", catInfo?.color || "bg-muted")}>
                      {categoryIcons[category] || <Pill className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{catInfo?.name || "Other"}</p>
                      <p className="text-sm text-muted-foreground">{meds.length} medicine{meds.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-4 space-y-2">
                    {meds.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-foreground">{med.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {med.dosage}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {med.instructions}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {med.timing.map((t) => (
                              <span
                                key={t}
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full border",
                                  getDoseStatus(med.id, t) === 'taken' && "bg-success/20 text-success border-success/30",
                                  getDoseStatus(med.id, t) === 'skipped' && "bg-destructive/20 text-destructive border-destructive/30",
                                  !getDoseStatus(med.id, t) && "bg-muted text-muted-foreground border-border"
                                )}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <div className="text-right">
                            <p className={cn(
                              "text-sm font-medium",
                              med.quantity <= 7 && "text-destructive",
                              med.quantity > 7 && med.quantity <= 14 && "text-warning",
                              med.quantity > 14 && "text-foreground"
                            )}>
                              {med.quantity} left
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeMedicine(med.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    )
  }

  // Timing view
  const grouped = getMedicinesByTiming()
  const timingsWithMedicines = Object.entries(grouped).filter(([_, meds]) => meds.length > 0)

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Timing Groups */}
      {timingsWithMedicines.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No medicines found
        </div>
      ) : (
        timingsWithMedicines.map(([timing, meds]) => {
          const isExpanded = expandedTimings.has(timing)

          return (
            <Card key={timing} className="overflow-hidden">
              <button
                onClick={() => toggleTiming(timing)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("px-4 py-2 rounded-xl font-medium border", timingColors[timing])}>
                    {timing.charAt(0).toUpperCase() + timing.slice(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {meds.length} medicine{meds.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">{timingLabels[timing]}</p>
                  {meds.map((med) => {
                    const catInfo = med.category ? medicineCategories[med.category as MedicineCategory] : null
                    const status = getDoseStatus(med.id, timing)

                    return (
                      <div
                        key={`${med.id}-${timing}`}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg transition-colors",
                          status === 'taken' && "bg-success/10 border border-success/20",
                          status === 'skipped' && "bg-destructive/10 border border-destructive/20",
                          !status && "bg-secondary/30 hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {catInfo && (
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", catInfo.color)}>
                              {categoryIcons[med.category || ''] || <Pill className="w-3 h-3" />}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{med.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {med.dosage}
                              </span>
                              {status === 'taken' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                                  Taken
                                </span>
                              )}
                              {status === 'skipped' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                                  Skipped
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {catInfo?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <p className={cn(
                            "text-sm font-medium",
                            med.quantity <= 7 && "text-destructive",
                            med.quantity > 7 && med.quantity <= 14 && "text-warning",
                            med.quantity > 14 && "text-foreground"
                          )}>
                            {med.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
