import { createClient } from "@/utils/supabase/server"
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  // Explicitly refresh the session to get the most up-to-date user data
  const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()

  if (sessionError || !session) {
    return redirect('/login')
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return redirect('/login')
  }

  // Check their role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('user_type, *')  // Select all profile data for more flexibility
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return redirect('/login')
  }

  // Validate profile exists and has a user type
  if (!profile || !profile.user_type) {
    console.error('No profile or user type found')
    return redirect('/login')
  }

  // Redirect based on role
  switch(profile.user_type) {
    case 'DJ':
      return redirect('/dj/dashboard')
    case 'Venue':
      return redirect('/venue/dashboard')
    default:
      return redirect('/demo')
  }
}