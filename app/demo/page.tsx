'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, Calendar, Users, Play, PlusCircle, Edit, Star, Facebook, Instagram, Twitter } from "lucide-react"

type DJ = {
  id: string;
  name: string;
  cost: number;
  badges: string[];
  image: string;
  recentShows: { venue: string; attendance: number; review: number }[];
  featuredMix: string;
  mixes: string[];
  rating?: number;
}

type Event = {
  id: string;
  name: string;
  date: string;
  applicants: number;
  djs: DJ[];
  selectedDJ?: DJ;
  attendance?: number;
}

type Venue = {
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const mockVenue: Venue = {
  name: "Neon Nights Club",
  address: "123 Party Street, Clubville, CV 12345",
  phone: "+1 (555) 123-4567",
  email: "info@neonnightsclub.com",
  image: "/nightclub_profile_image.jpg",
  socialMedia: {
    facebook: "https://facebook.com/neonnightsclub",
    instagram: "https://instagram.com/neonnightsclub",
    twitter: "https://twitter.com/neonnightsclub",
  },
}

const generateDJs = (count: number): DJ[] => {
  const djNames = ["Rhythm Master", "Beat Wizard", "Groove Goddess", "Sonic Sorcerer", "Tempo Titan", "Mix Maestro", "Vinyl Vixen", "Bass Boss", "Synth Savant", "Decibel Diva"]
  const genres = ["House", "Techno", "Hip Hop", "EDM", "Trance", "Dubstep", "Drum & Bass", "Reggaeton", "Pop", "Rock"]
  const experiences = ["Beginner", "Intermediate", "Advanced", "Expert"]

  return Array.from({ length: count }, (_, i) => ({
    id: `dj-${i + 1}`,
    name: djNames[i % djNames.length],
    cost: Math.floor(Math.random() * (200 - 50 + 1) + 50),
    badges: [
      genres[Math.floor(Math.random() * genres.length)],
      experiences[Math.floor(Math.random() * experiences.length)],
      Math.random() > 0.5 ? "10k+ followers" : "Rising Star"
    ],
    image: `/ChapelHeadshotHSA.jpeg?height=100&width=100&text=DJ${i + 1}`,
    recentShows: [
      { venue: "Club X", attendance: Math.floor(Math.random() * 500) + 100, review: Number((Math.random() * 2 + 3).toFixed(1)) },
      { venue: "Festival Y", attendance: Math.floor(Math.random() * 1000) + 500, review: Number((Math.random() * 2 + 3).toFixed(1)) },
    ],
    featuredMix: `${genres[Math.floor(Math.random() * genres.length)]} Fusion`,
    mixes: ["Summer Vibes", "Late Night Grooves", "Party Starter"],
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
  }))
}

const mockUpcomingEvents: Event[] = [
  {
    id: "event-1",
    name: "Salsa Night",
    date: "2024-12-15",
    applicants: 10,
    djs: generateDJs(10),
  },
  {
    id: "event-2",
    name: "Techno Rave",
    date: "2024-12-31",
    applicants: 10,
    djs: generateDJs(10),
  },
]

const mockPastEvents: Event[] = [
  {
    id: "past-event-1",
    name: "Summer Bash",
    date: "2023-08-15",
    applicants: 15,
    djs: generateDJs(5),
    selectedDJ: generateDJs(1)[0],
    attendance: 450,
  },
  {
    id: "past-event-2",
    name: "Retro Night",
    date: "2023-09-22",
    applicants: 12,
    djs: generateDJs(5),
    selectedDJ: generateDJs(1)[0],
    attendance: 380,
  },
  {
    id: "past-event-3",
    name: "Halloween Special",
    date: "2023-10-31",
    applicants: 20,
    djs: generateDJs(5),
    selectedDJ: generateDJs(1)[0],
    attendance: 520,
  },
]

export default function VenueHomepage() {
  const [upcomingEvents, setUpcomingEvents] = useState(mockUpcomingEvents)
  const [pastEvents, setPastEvents] = useState(mockPastEvents)
  const [showVenueProfile, setShowVenueProfile] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const addEvent = (newEvent: Event) => {
    setUpcomingEvents([...upcomingEvents, newEvent])
  }

  const editEvent = (editedEvent: Event) => {
    setUpcomingEvents(upcomingEvents.map(event => 
      event.id === editedEvent.id ? editedEvent : event
    ))
    setEditingEvent(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-black border-b border-pink-500">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Dex Venue Dashboard
          </h1>
          <nav>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white"
              onClick={() => setShowVenueProfile(true)}
            >
              Profile
            </Button>
          </nav>
        </div>
      </header>

      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-400">Upcoming Events</h2>
          <EventPostingDialog onEventPost={addEvent} />
        </div>
        <div className="space-y-6 mb-12">
          {upcomingEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              isUpcoming={true} 
              onEdit={() => setEditingEvent(event)} 
            />
          ))}
        </div>

        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Past Events</h2>
        <div className="space-y-6 mb-12">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} isUpcoming={false} />
          ))}
        </div>

        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Past DJs</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border border-pink-500">
          <div className="flex w-max space-x-4 p-4">
            {generateDJs(20).map((dj) => (
              <DJProfileButton key={dj.id} dj={dj} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-black border-t border-pink-500 mt-10">
        <p className="text-center text-cyan-400">&copy; 2024 Dex. All rights reserved.</p>
      </footer>

      {showVenueProfile && (
        <VenueProfileDialog venue={mockVenue} onClose={() => setShowVenueProfile(false)} />
      )}

      {editingEvent && (
        <EventEditingDialog event={editingEvent} onEventEdit={editEvent} onClose={() => setEditingEvent(null)} />
      )}
    </div>
  )
}

function EventCard({ event, isUpcoming, onEdit }: { event: Event; isUpcoming: boolean; onEdit?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const eventDate = new Date(event.date)
  const today = new Date()
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

  return (
    <Card className={`bg-black border-2 ${isUpcoming ? 'border-pink-500 shadow-lg shadow-pink-500/50' : 'border-purple-500 shadow-lg shadow-purple-500/50'}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-bold text-pink-400">{event.name}</span>
          <div className="flex items-center space-x-2">
            {isUpcoming && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="text-cyan-400 hover:text-cyan-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Calendar className="text-pink-400" />
            <span className="font-bold">{isUpcoming ? `${daysUntilEvent} days until event` : new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <Users className="text-pink-400" />
            <span className="font-bold">{isUpcoming ? `${event.applicants} DJs applied` : `${event.attendance} attendees`}</span>
          </div>
        </div>
        {isExpanded && (
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold text-cyan-400">
              {isUpcoming ? "Applied DJs:" : "Event Details:"}
            </h3>
            {isUpcoming ? (
              event.djs.map((dj) => (
                <DJCard key={dj.id} dj={dj} />
              ))
            ) : (
              <>
                <div className="bg-purple-900 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-pink-400 mb-2">Selected DJ</h4>
                  {event.selectedDJ && <DJCard dj={event.selectedDJ} />}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-pink-400 mb-2">Other Applicants</h4>
                  {event.djs.map((dj) => (
                    <DJCard key={dj.id} dj={dj} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DJCard({ dj }: { dj: DJ }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-black border border-cyan-500 p-4 rounded-lg cursor-pointer hover:bg-cyan-900 transition-colors">
          <div className="flex items-center space-x-4 mb-2">
            <img src={dj.image} alt={dj.name} className="w-12 h-12 rounded-full" />
            <span className="font-semibold text-cyan-400">{dj.name}</span>
            <span className="text-white font-bold">${dj.cost}/hr</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dj.badges.map((badge, badgeIndex) => (
              <Badge key={badgeIndex} variant="secondary" className="bg-pink-900 text-pink-300">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-black border-2 border-cyan-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">{dj.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img src={dj.image} alt={dj.name} className="w-full h-auto rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-pink-400 mb-2">Recent Shows</h3>
            {dj.recentShows.map((show, index) => (
              <div key={index} className="mb-2">
                <p className="text-cyan-400 font-bold">{show.venue}</p>
                <p className="text-sm">Attendance: {show.attendance} <span className="ml-2">
                  <Star className="inline-block text-yellow-400 w-4 h-4" />
                  {show.review}
                </span>
                </p>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">Featured Mix</h3>
              <div className="bg-cyan-900 p-4 rounded-lg flex items-center justify-center">
                <Play className="text-white mr-2" />
                <span>{dj.featuredMix}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-pink-400 mb-2">All Mixes</h3>
            <ul className="space-y-2">
              {dj.mixes.map((mix, index) => (
                <li key={index} className="bg-pink-900 p-2 rounded-lg text-pink-300">{mix}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DJProfileButton({ dj }: { dj: DJ }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-flex flex-col items-center space-y-1">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img src={dj.image} alt={dj.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-cyan-400">{dj.name}</span>
          <div className="flex items-center">
            <Star className="text-yellow-400 w-4 h-4 mr-1" />
            <span className="text-sm">{dj.rating}</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-black border-2 border-cyan-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">{dj.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img src={dj.image} alt={dj.name} className="w-full h-auto rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-pink-400 mb-2">Recent Shows</h3>
            {dj.recentShows.map((show, index) => (
              <div key={index} className="mb-2">
                <p className="text-cyan-400 font-bold">{show.venue}</p>
                <p className="text-sm">Attendance: {show.attendance}
                <span className="ml-2">
                  <Star className="inline-block text-yellow-400 w-4 h-4" />
                  {show.review}
                </span>
                </p>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">Featured Mix</h3>
              <div className="bg-cyan-900 p-4 rounded-lg flex items-center justify-center">
                <Play className="text-white mr-2" />
                <span>{dj.featuredMix}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-pink-400 mb-2">All Mixes</h3>
            <ul className="space-y-2">
              {dj.mixes.map((mix, index) => (
                <li key={index} className="bg-pink-900 p-2 rounded-lg text-pink-300">{mix}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventPostingDialog({ onEventPost }: { onEventPost: (event: Event) => void }) {
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [experienceLevels, setExperienceLevels] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [minFollowers, setMinFollowers] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      name: eventName,
      date: eventDate,
      applicants: 0,
      djs: []
    }
    onEventPost(newEvent)
    // Reset form
    setEventName('')
    setEventDate('')
    setExperienceLevels([])
    setGenres([])
    setMinFollowers('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Post New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-2 border-cyan-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">Post New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="eventName" className="text-pink-400">Event Name</Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-black border-cyan-500 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDate" className="text-pink-400">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-black border-cyan-500 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-pink-400">Experience Levels</Label>
            <div className="flex space-x-4">
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                <div key={level} className="flex items-center">
                  <Checkbox
                    id={level}
                    checked={experienceLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      setExperienceLevels(
                        checked
                          ? [...experienceLevels, level]
                          : experienceLevels.filter((l) => l !== level)
                      )
                    }}
                    className="border-cyan-500"
                  />
                  <label htmlFor={level} className="ml-2 text-white">
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-pink-400">Genres</Label>
            <div className="flex space-x-4">
              {['Latin', 'Techno', 'Hip Hop', 'Pop', 'Rock'].map((genre) => (
                <div key={genre} className="flex items-center">
                  <Checkbox
                    id={genre}
                    checked={genres.includes(genre)}
                    onCheckedChange={(checked) => {
                      setGenres(
                        checked
                          ? [...genres, genre]
                          : genres.filter((g) => g !== genre)
                      )
                    }}
                    className="border-cyan-500"
                  />
                  <label htmlFor={genre} className="ml-2 text-white">
                    {genre}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="minFollowers" className="text-pink-400">Minimum Followers</Label>
            <Select onValueChange={setMinFollowers}>
              <SelectTrigger className="bg-black border-cyan-500 text-white">
                <SelectValue placeholder="Select minimum followers" />
              </SelectTrigger>
              <SelectContent className="bg-black border-cyan-500 text-white">
                <SelectItem value="1000">1,000+</SelectItem>
                <SelectItem value="5000">5,000+</SelectItem>
                <SelectItem value="10000">10,000+</SelectItem>
                <SelectItem value="50000">50,000+</SelectItem>
                <SelectItem value="100000">100,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white">
            Post Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function VenueProfileDialog({ venue, onClose }: { venue: Venue; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-cyan-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">{venue.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img src={venue.image} alt={venue.name} className="w-full h-auto rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-pink-400 mb-2">Contact Information</h3>
            <p className="text-cyan-400"><strong>Address:</strong> {venue.address}</p>
            <p className="text-cyan-400"><strong>Phone:</strong> {venue.phone}</p>
            <p className="text-cyan-400"><strong>Email:</strong> {venue.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-pink-400 mb-2">Social Media</h3>
            <div className="flex space-x-4">
              {venue.socialMedia.facebook && (
                <a href={venue.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="text-cyan-400 hover:text-cyan-300" />
                </a>
              )}
              {venue.socialMedia.instagram && (
                <a href={venue.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="text-cyan-400 hover:text-cyan-300" />
                </a>
              )}
              {venue.socialMedia.twitter && (
                <a href={venue.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="text-cyan-400 hover:text-cyan-300" />
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventEditingDialog({ event, onEventEdit, onClose }: { event: Event; onEventEdit: (event: Event) => void; onClose: () => void }) {
  const [eventName, setEventName] = useState(event.name)
  const [eventDate, setEventDate] = useState(event.date)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const editedEvent: Event = {
      ...event,
      name: eventName,
      date: eventDate,
    }
    onEventEdit(editedEvent)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-cyan-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="eventName" className="text-pink-400">Event Name</Label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="bg-black border-cyan-500 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDate" className="text-pink-400">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-black border-cyan-500 text-white"
              required
            />
          </div>
          <Button type="submit" className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}