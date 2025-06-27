import Link from "next/link"
import { Heart, Shield, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 leading-tight">
              Welcome to <span className="text-blue-600">MindEase</span>
            </h1>
            <p className="text-2xl text-slate-700 max-w-2xl mx-auto">
              Your anonymous AI-powered mental wellness companion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-fuchsia-200 hover:border-fuchsia-400 p-7 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <Heart className="w-7 h-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-blue-700 mb-2">Compassionate Care</h3>
              <p className="text-slate-600">Get support when you need it most with our AI companion</p>
            </div>

            <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-purple-200 hover:border-purple-400 p-7 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <Shield className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="text-lg font-bold text-green-700 mb-2">Anonymous & Safe</h3>
              <p className="text-slate-600">Your privacy is protected. Share freely without judgment</p>
            </div>

            <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-blue-200 hover:border-blue-400 p-7 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-fuchsia-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <Users className="w-7 h-7 text-fuchsia-700" />
              </div>
              <h3 className="text-lg font-bold text-fuchsia-700 mb-2">Professional Support</h3>
              <p className="text-slate-600">Connect with licensed therapists when you're ready</p>
            </div>
          </div>

          <div className="mt-14">
            <p className="text-slate-700 mb-6 text-lg">Ready to start your wellness journey?</p>
            <div className="flex justify-center">
              <Link
                href="/login"
                className="bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:from-fuchsia-700 hover:to-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
