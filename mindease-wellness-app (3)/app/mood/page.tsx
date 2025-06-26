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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Mood Tracker</h1>
            <p className="text-slate-600">How are you feeling today? Track your mood and get helpful suggestions.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="mb-4 text-lg font-medium text-slate-700">Select your current mood:</div>
            <div className="flex justify-between mb-4">
              {moods.map((m) => (
                <button
                  key={m.value}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg border-2 transition-all ${selectedMood === m.value ? "border-blue-500 bg-blue-50" : "border-transparent"}`}
                  onClick={() => setSelectedMood(m.value)}
                  type="button"
                >
                  {m.icon}
                  <span className="text-xs mt-1">{m.label}</span>
                </button>
              ))}
            </div>
            <textarea
              className="w-full h-20 p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 mb-4"
              placeholder="Add a note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button
              onClick={handleSave}
              disabled={selectedMood === null || isSaving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save Mood"}
            </button>
          </div>

          <div className="mb-8 flex items-center bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <Lightbulb className="w-6 h-6 text-yellow-600 mr-2" />
            <div>
              <div className="font-semibold text-slate-800 mb-1">Suggestion</div>
              <div className="text-slate-700">{suggestion}</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Moods</h2>
            {history.length === 0 && <div className="text-slate-500 italic">No moods tracked yet. Start today!</div>}
            <ul className="space-y-4">
              {history.map((m, i) => (
                <li key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">{formatDate(m.createdAt)}</div>
                    <div className="text-slate-700">Mood: <span className="font-semibold">{m.mood}</span></div>
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
