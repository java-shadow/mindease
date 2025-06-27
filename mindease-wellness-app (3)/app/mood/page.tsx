"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { saveMoodEntry, getUserMoodEntries, type MoodEntry } from "@/lib/firebase-service"
import { Smile, Meh, Frown, TrendingUp, Lightbulb } from "lucide-react"

const moods = [
  { value: 2, label: "Very Sad", icon: <Frown className="w-7 h-7 text-red-500" /> },
  { value: 4, label: "Sad", icon: <Frown className="w-7 h-7 text-orange-400" /> },
  { value: 6, label: "Neutral", icon: <Meh className="w-7 h-7 text-yellow-500" /> },
  { value: 8, label: "Happy", icon: <Smile className="w-7 h-7 text-green-500" /> },
  { value: 10, label: "Very Happy", icon: <Smile className="w-7 h-7 text-blue-500" /> },
]

function getMoodSuggestion(moods: MoodEntry[]) {
  if (!moods.length) return "Track your mood daily to get personalized tips!"
  const avg = moods.reduce((sum, m) => sum + m.mood, 0) / moods.length
  if (avg <= 4) return "It looks like you've been feeling down. Try some self-care, talk to a friend, or take a walk outside."
  if (avg <= 7) return "Your mood has been average. Consider doing something you enjoy or practicing mindfulness."
  return "Great mood! Keep up the positive habits and spread your joy!"
}

export default function MoodPage() {
  const { firebaseUser } = useAuth()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [history, setHistory] = useState<MoodEntry[]>([])
  const [error, setError] = useState("")
  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {
    if (firebaseUser) {
      getUserMoodEntries(firebaseUser.uid, 10).then((moods) => {
        setHistory(moods)
        setSuggestion(getMoodSuggestion(moods))
      })
    }
  }, [firebaseUser])

  const handleSave = async () => {
    setError("")
    if (!firebaseUser || selectedMood === null) return
    setIsSaving(true)
    try {
      await saveMoodEntry(firebaseUser.uid, selectedMood, note)
      setSelectedMood(null)
      setNote("")
      const moods = await getUserMoodEntries(firebaseUser.uid, 10)
      setHistory(moods)
      setSuggestion(getMoodSuggestion(moods))
    } catch (e) {
      setError("Failed to save mood. Please try again.")
    }
    setIsSaving(false)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <TrendingUp className="w-14 h-14 text-fuchsia-600 mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 mb-2">Mood Tracker</h1>
            <p className="text-lg text-slate-700">How are you feeling today? Track your mood and get helpful suggestions.</p>
          </div>

          <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-fuchsia-200 p-10 mb-10">
            <div className="mb-4 text-lg font-bold text-fuchsia-700">Select your current mood:</div>
            <div className="flex justify-between mb-6">
              {moods.map((m) => (
                <button
                  key={m.value}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all text-base font-semibold shadow-lg ${selectedMood === m.value ? "border-fuchsia-500 bg-fuchsia-50 scale-110" : "border-transparent bg-white hover:bg-fuchsia-50"}`}
                  onClick={() => setSelectedMood(m.value)}
                  type="button"
                >
                  {m.icon}
                  <span className="text-xs mt-1">{m.label}</span>
                </button>
              ))}
            </div>
            <textarea
              className="w-full h-20 p-3 border-2 border-fuchsia-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent resize-none text-slate-700 mb-4 bg-white"
              placeholder="Add a note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button
              onClick={handleSave}
              disabled={selectedMood === null || isSaving}
              className="bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:from-fuchsia-700 hover:to-blue-700 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Mood"}
            </button>
          </div>

          <div className="mb-10 flex items-center bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 border border-yellow-200 rounded-xl p-5 shadow">
            <Lightbulb className="w-7 h-7 text-yellow-600 mr-3" />
            <div>
              <div className="font-bold text-fuchsia-700 mb-1">Suggestion</div>
              <div className="text-slate-700">{suggestion}</div>
            </div>
          </div>

          <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-blue-200 p-8">
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 mb-4">Recent Moods</h2>
            {history.length === 0 && <div className="text-slate-500 italic">No moods tracked yet. Start today!</div>}
            <ul className="space-y-4">
              {history.map((m, i) => (
                <li key={i} className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between shadow">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">{formatDate(m.createdAt)}</div>
                    <div className="text-slate-700">Mood: <span className="font-bold text-fuchsia-700">{m.mood}</span></div>
                    {m.notes && <div className="text-slate-600 text-sm mt-1">Note: {m.notes}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
