"use client"

import { useMindMateStore } from "@/lib/mindmate-store"
import { BottomNav } from "../bottom-nav"
import { Button } from "@/components/ui/button"

const crisisResources = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 crisis support',
    icon: '📞',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 text support',
    icon: '💬',
  },
  {
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Treatment referral service',
    icon: '🏥',
  },
]

const selfCareResources = [
  {
    title: 'Understanding Anxiety',
    description: 'Learn about anxiety symptoms and coping strategies',
    icon: '📚',
  },
  {
    title: 'Sleep Hygiene Tips',
    description: 'Improve your sleep quality naturally',
    icon: '😴',
  },
  {
    title: 'Mindfulness Basics',
    description: 'Introduction to mindfulness meditation',
    icon: '🧘',
  },
  {
    title: 'Stress Management',
    description: 'Practical tips for managing daily stress',
    icon: '💆',
  },
]

const campusResources = [
  {
    name: 'College Counseling Center',
    hours: 'Mon-Fri, 9am-5pm',
    description: 'Free counseling for students',
    icon: '🏫',
  },
  {
    name: 'Student Wellness Center',
    hours: 'Mon-Fri, 8am-6pm',
    description: 'Health and wellness services',
    icon: '💚',
  },
  {
    name: 'Peer Support Network',
    hours: 'Available 24/7',
    description: 'Talk to trained student peers',
    icon: '🤝',
  },
]

export function ResourcesScreen() {
  const { navigateTo } = useMindMateStore()
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Crisis Banner */}
      <div className="bg-[#B84040] text-white p-4 text-center">
        <p className="font-semibold mb-2">🆘 If you&apos;re in crisis</p>
        <a href="tel:988" className="inline-block">
          <Button className="bg-white text-[#B84040] hover:bg-white/90 rounded-full font-bold">
            Call 988 Now
          </Button>
        </a>
      </div>
      
      {/* Header */}
      <header className="p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">💚 Help & Resources</h1>
          <button 
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {/* Crisis Resources */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">🚨</span> Crisis Resources
          </h2>
          <div className="flex flex-col gap-3">
            {crisisResources.map((resource, idx) => (
              <div 
                key={idx}
                className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-2xl">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{resource.name}</h3>
                  <p className="text-primary font-medium">{resource.number}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Campus Resources */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">🏫</span> Campus Resources
          </h2>
          <div className="flex flex-col gap-3">
            {campusResources.map((resource, idx) => (
              <div 
                key={idx}
                className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-2xl">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground">{resource.hours}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Self-Care Resources */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-xl">📖</span> Learn & Grow
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {selfCareResources.map((resource, idx) => (
              <div 
                key={idx}
                className="bg-card rounded-xl p-4 border border-border text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="text-3xl mb-2">{resource.icon}</div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{resource.title}</h3>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Important Note */}
        <div className="bg-muted rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Remember:</strong> MindMate is a self-care companion, not a substitute for professional help. 
            If you&apos;re struggling, please reach out to a mental health professional.
          </p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
