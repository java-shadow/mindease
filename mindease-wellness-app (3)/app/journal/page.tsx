"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { saveJournalEntry, getUserJournalEntries, type JournalEntry } from "@/lib/firebase-service"
import { Smile, Meh, Frown, Lightbulb, BookOpen } from "lucide-react"

// Simple sentiment analysis (demo)
function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
  const positiveWords = ["happy", "grateful", "good", "excited", "love", "joy", "hope"]
  const negativeWords = ["sad", "angry", "anxious", "bad", "depressed", "tired", "hopeless", "stress"]
  const lower = text.toLowerCase()
  let score = 0
  positiveWords.forEach((w) => { if (lower.includes(w)) score++ })
  negativeWords.forEach((w) => { if (lower.includes(w)) score-- })
  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}

function getSuggestion(sentiment: "positive" | "neutral" | "negative") {
  if (sentiment === "positive") return "Keep up the positive mindset! Consider sharing your joy with someone or setting a new goal."
  if (sentiment === "negative") return "It seems you're having a tough time. Try a short mindfulness exercise, talk to a friend, or take a walk. Remember, it's okay to ask for help."
  return "Reflect on your day and consider what small thing could make tomorrow better."
}

export default function JournalPage() {
  const { user, firebaseUser } = useAuth()
  const [entry, setEntry] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null)
  const [suggestion, setSuggestion] = useState("")
  const [history, setHistory] = useState<JournalEntry[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (firebaseUser) {
      getUserJournalEntries(firebaseUser.uid, 10).then(setHistory)
    }
  }, [firebaseUser])

  const handleSave = async () => {
    setError("")
    if (!entry.trim() || !firebaseUser) return
    setIsSaving(true)
    try {
      const sentimentResult = analyzeSentiment(entry)
      setSentiment(sentimentResult)
      setSuggestion(getSuggestion(sentimentResult))
      await saveJournalEntry(firebaseUser.uid, entry)
      setEntry("")
      // Refresh history
      const updated = await getUserJournalEntries(firebaseUser.uid, 10)
      setHistory(updated)
    } catch (e) {
      setError("Failed to save entry. Please try again.")
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Journal</h1>
            <p className="text-slate-600">Write about your day, your feelings, or anything on your mind. Your entries are private and secure.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <textarea
              className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 mb-4"
              placeholder="How are you feeling today? Write your thoughts here..."
              value={entry}
              onChange={e => setEntry(e.target.value)}
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button
              onClick={handleSave}
              disabled={!entry.trim() || isSaving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save Entry"}
            </button>
          </div>

          {sentiment && (
            <div className="mb-8 flex items-center bg-green-50 border border-green-200 rounded-xl p-4">
              {sentiment === "positive" && <Smile className="w-6 h-6 text-green-600 mr-2" />}
              {sentiment === "neutral" && <Meh className="w-6 h-6 text-yellow-600 mr-2" />}
              {sentiment === "negative" && <Frown className="w-6 h-6 text-red-600 mr-2" />}
              <div>
                <div className="font-semibold text-slate-800 mb-1">We analyzed your entry:</div>
                <div className="text-slate-700 mb-1">Mood detected: <span className="capitalize">{sentiment}</span></div>
                <div className="flex items-center text-blue-700"><Lightbulb className="w-4 h-4 mr-1" />{suggestion}</div>
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Entries</h2>
            {history.length === 0 && <div className="text-slate-500 italic">No entries yet. Start writing!</div>}
            <ul className="space-y-4">
              {history.map(entry => (
                <li key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">{formatDate(entry.createdAt)}</div>
                  <div className="text-slate-700 whitespace-pre-line">{entry.content}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
