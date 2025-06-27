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
    price: "₹2,000/session",
    image: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  },
  {
    id: 2,
    name: "Dr. Rajesh Iyer",
    specialty: "Trauma & PTSD",
    availability: "Tue-Thu",
    rating: 4.8,
    experience: "12 years",
    location: "Online Sessions",
    price: "₹2,500/session",
    image: "https://images.unsplash.com/photo-1511174511562-5f97f4f4e0c8?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Relationship Counseling",
    availability: "Wed-Fri",
    rating: 4.9,
    experience: "10 years",
    location: "Online Sessions",
    price: "₹2,200/session",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  },
]

export default function BookTherapistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 mb-2">Book a Therapist</h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Connect with licensed mental health professionals who can provide personalized support for your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white/90 rounded-3xl shadow-lg border-2 border-fuchsia-200 hover:border-fuchsia-400 p-7 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-5 mb-5">
                <img
                  src={therapist.image || "/placeholder.svg"}
                  alt={therapist.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-fuchsia-300 shadow"
                />
                <div>
                  <h3 className="text-xl font-bold text-fuchsia-700">{therapist.name}</h3>
                  <p className="text-sm text-purple-700">{therapist.specialty}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-slate-600">{therapist.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Calendar className="w-4 h-4" />
                  <span>Available: {therapist.availability}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-purple-700">
                  <Clock className="w-4 h-4" />
                  <span>{therapist.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-fuchsia-700">
                  <MapPin className="w-4 h-4" />
                  <span>{therapist.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-blue-700">{therapist.price}</p>
                  <p className="text-xs text-slate-500">Insurance accepted</p>
                </div>
                <button className="bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white px-7 py-2 rounded-full font-semibold shadow hover:from-fuchsia-700 hover:to-blue-700 transition-colors">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white/90 rounded-3xl shadow-lg border-2 border-blue-200 p-10">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 mb-6">Why Choose Professional Therapy?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <Calendar className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="font-bold text-blue-700 mb-2">Flexible Scheduling</h3>
                <p className="text-sm text-slate-600">Book sessions that fit your schedule</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-fuchsia-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <Star className="w-7 h-7 text-fuchsia-700" />
                </div>
                <h3 className="font-bold text-fuchsia-700 mb-2">Licensed Professionals</h3>
                <p className="text-sm text-slate-600">All therapists are licensed and verified</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <MapPin className="w-7 h-7 text-purple-700" />
                </div>
                <h3 className="font-bold text-purple-700 mb-2">Online & In-Person</h3>
                <p className="text-sm text-slate-600">Choose the format that works for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
