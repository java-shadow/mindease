import Link from "next/link"
import { Heart, Shield, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
              Welcome to <span className="text-blue-600">MindEase</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
              Your anonymous AI-powered mental wellness companion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Compassionate Care</h3>
              <p className="text-slate-600">Get support when you need it most with our AI companion</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Anonymous & Safe</h3>
              <p className="text-slate-600">Your privacy is protected. Share freely without judgment</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Professional Support</h3>
              <p className="text-slate-600">Connect with licensed therapists when you're ready</p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-slate-600 mb-6">Ready to start your wellness journey?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
