// app/dj/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // or whatever modal component you use
import { createClient } from '@/utils/supabase/client'

export default function DJDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  useEffect(() => {
    const checkOnboarding = async () => {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('Onboard')
        .single()

      if (!profile?.Onboard) {
        setShowOnboarding(true)
      }
    }

    checkOnboarding()
  }, [])
  //this is a function to update thier onboarded status
  
  return (
    <div>
      {/* Your DJ dashboard content */}
      <h1>DJ Dashboard</h1>

      {/* Onboarding Modal */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
          </DialogHeader>
          {/* Your onboarding form */}
        </DialogContent>
      </Dialog>
    </div>
  )
}