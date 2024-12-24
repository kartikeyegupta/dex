// app/page.tsx
import { createClient } from "@/utils/supabase/server"
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  // 1. Check if logged in using getUser instead of getSession
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return redirect('/login')
  }

  // 2. Check their role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return redirect('/login')
  }

  // 3. Redirect based on role
  switch(profile?.user_type) {
    case 'DJ':
      return redirect('/dj/dashboard')
    case 'Venue':
      return redirect('/venue/dashboard')
    default:
      return redirect('/demo')
  }
}