'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Disc3, Headphones, Music, Radio, Mail } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])

      if (error) throw error

      setEmail('')
      setMessage('Thank you for joining our waitlist!')
    } catch (error) {
      setMessage('This email has already been signed up! Contact Christian or Tiki if you think this could be an error.')    
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Neon background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-50"></div>

      <div className="relative z-10">
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              Dex
            </h1>
          </div>
        </header>

        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block text-cyan-400">Get Gigs.</span>
              <span className="block text-pink-500">Drop Beats.</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join the ultimate marketplace for DJs. Sign up, get gigs, and let the music play.
            </p>
            <div className="mt-10 flex flex-col items-center">
              <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500"
                  required
                />
                <Button type="submit" className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold hover:from-pink-600 hover:to-cyan-600" disabled={isLoading}>
                  {isLoading ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </form>
              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  'bg-cyan-800 text-white-100'
                }`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Disc3 className="h-10 w-10 text-cyan-400" />}
                title="Easy Booking"
                description="Streamlined process to book gigs and manage your schedule."
              />
              <FeatureCard
                icon={<Headphones className="h-10 w-10 text-pink-500" />}
                title="Profile Showcase"
                description="Highlight your skills, equipment, and music style."
              />
              <FeatureCard
                icon={<Music className="h-10 w-10 text-purple-500" />}
                title="Music Samples"
                description="Upload and share your mixes to attract more clients."
              />
              <FeatureCard
                icon={<Radio className="h-10 w-10 text-cyan-400" />}
                title="Secure Payments"
                description="Get paid easily and securely through our platform."
              />
            </div>
          </div>
        </main>

        <footer className="mt-20 py-8 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ContactCard
                name="Christian Okokhere"
                email="christian.okokhere@duke.edu"
              />
              <ContactCard
                name="Kartikeye (Tiki) Gupta"
                email="kartikeye.gupta@duke.edu"
              />
            </div>
            <p className="mt-8 text-gray-400">&copy; 2024 Dex. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-cyan-400 transition-colors">
      {icon}
      <h3 className="mt-4 text-xl font-semibold text-cyan-400">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  )
}
function ContactCard({ name, email }: { name: string, email: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-pink-400 transition-colors">
      <Mail className="h-10 w-10 text-pink-500" />
      <h4 className="mt-4 text-xl font-semibold text-pink-400">{name}</h4>
      <a href={`mailto:${email}`} className="mt-2 text-gray-400 hover:text-cyan-400 transition-colors">
        {email}
      </a>
    </div>
  )
}


