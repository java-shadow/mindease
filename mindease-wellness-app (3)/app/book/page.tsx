import { Calendar, Clock, Star, MapPin } from "lucide-react"

const therapists = [
  {
    id: 1,
    name: "Dr. Asha Verma",
    specialty: "Anxiety & Depression",
    availability: "Mon-Wed",
    rating: 4.9,
    experience: "8 years",
    location: "Online Sessions",
    price: "$120/session",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Trauma & PTSD",
    availability: "Tue-Thu",
    rating: 4.8,
    experience: "12 years",
    location: "Online Sessions",
    price: "$140/session",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialty: "Relationship Counseling",
    availability: "Wed-Fri",
    rating: 4.9,
    experience: "10 years",
    location: "Online Sessions",
    price: "$130/session",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function BookTherapistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Book a Therapist</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Connect with licensed mental health professionals who can provide personalized support for your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={therapist.image || "/placeholder.svg"}
                  alt={therapist.name}
                  className="w-16 h-16 rounded-full object-cover bg-slate-200"
                />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{therapist.name}</h3>
                  <p className="text-sm text-slate-600">{therapist.specialty}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600">{therapist.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Available: {therapist.availability}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{therapist.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{therapist.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{therapist.price}</p>
                  <p className="text-xs text-slate-500">Insurance accepted</p>
                </div>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Why Choose Professional Therapy?</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Flexible Scheduling</h3>
                <p className="text-sm text-slate-600">Book sessions that fit your schedule</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Licensed Professionals</h3>
                <p className="text-sm text-slate-600">All therapists are licensed and verified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Online & In-Person</h3>
                <p className="text-sm text-slate-600">Choose the format that works for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
