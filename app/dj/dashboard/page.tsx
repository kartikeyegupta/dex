// app/dj/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function DJDashboard() {
   const [showOnboarding, setShowOnboarding] = useState(false)
   const [userId, setUserId] = useState<string | null>(null)

   useEffect(() => {
     const checkOnboarding = async () => {
       const supabase = createClient()
       
       // Get the current user
       const { data: { user } } = await supabase.auth.getUser()
       
       if (user) {
         setUserId(user.id)
         
         // Fetch the specific user's profile
         const { data: profile } = await supabase
           .from('user_profiles')
           .select('Onboard')
           .eq('user_id', user.id)
           .single()

         if (!profile?.Onboard) {
           setShowOnboarding(true)
         }
       }
     }

     checkOnboarding()
   }, [])

   const handleClick = async () => {
     const supabase = createClient()
     
     if (!userId) {
       console.error('No user ID found')
       return
     }

     const { data, error } = await supabase
       .from('user_profiles')
       .update({ onboard: true })
       .eq('user_id', userId)
       .single()

     if (error) {
       console.error('Error updating profile:', error)
       return
     }
     setShowOnboarding(false)
   }

   return (
     <div>
       <h1>DJ Dashboard</h1>

       <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Complete Your Profile</DialogTitle>
           </DialogHeader>
           <Button onClick={handleClick}>Complete</Button>
         </DialogContent>
       </Dialog>
     </div>
   )
}