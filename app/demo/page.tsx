import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import VenueHomepageClient from './VenueHomepageClient'

export default async function VenueHomepage() {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  return <VenueHomepageClient user= { user } />
}