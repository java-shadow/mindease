"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { User, Calendar, Heart, Zap, Gamepad2, Plus, X, Save } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, updateUserData, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    fears: [] as string[],
    stressFactors: [] as string[],
    hobbies: [] as string[],
  })

  const [newFear, setNewFear] = useState("")
  const [newStress, setNewStress] = useState("")
  const [newHobby, setNewHobby] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age?.toString() || "",
        fears: user.fears || [],
        stressFactors: user.stressFactors || [],
        hobbies: user.hobbies || [],
      })
    }
  }, [user, isAuthenticated, isLoading, router])

  const addItem = (type: "fears" | "stressFactors" | "hobbies", value: string) => {
    if (!value.trim()) return

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }))

    // Clear the input
    if (type === "fears") setNewFear("")
    if (type === "stressFactors") setNewStress("")
    if (type === "hobbies") setNewHobby("")
  }

  const removeItem = (type: "fears" | "stressFactors" | "hobbies", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      updateUserData({
        name: formData.name,
        age: Number.parseInt(formData.age) || 0,
        fears: formData.fears,
        stressFactors: formData.stressFactors,
        hobbies: formData.hobbies,
      })

      setSaveMessage("Profile updated successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Error saving profile. Please try again.")
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Profile</h1>
          <p className="text-slate-600">Help us personalize your mental wellness journey</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="age" className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Age</span>
                </label>
                <input
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            {/* Fears Section */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-3">
                <Heart className="w-4 h-4" />
                <span>Fears & Anxieties</span>
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFear}
                    onChange={(e) => setNewFear(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addItem("fears", newFear)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a fear or anxiety (e.g., public speaking, heights)"
                  />
                  <button
                    onClick={() => addItem("fears", newFear)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.fears.map((fear, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{fear}</span>
                      <button onClick={() => removeItem("fears", index)} className="text-red-500 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stress Factors Section */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-3">
                <Zap className="w-4 h-4" />
                <span>Stress Factors</span>
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newStress}
                    onChange={(e) => setNewStress(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addItem("stressFactors", newStress)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a stress factor (e.g., work deadlines, relationships)"
                  />
                  <button
                    onClick={() => addItem("stressFactors", newStress)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.stressFactors.map((stress, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{stress}</span>
                      <button
                        onClick={() => removeItem("stressFactors", index)}
                        className="text-orange-500 hover:text-orange-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hobbies Section */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-3">
                <Gamepad2 className="w-4 h-4" />
                <span>Hobbies & Interests</span>
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addItem("hobbies", newHobby)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a hobby or interest (e.g., reading, hiking, music)"
                  />
                  <button
                    onClick={() => addItem("hobbies", newHobby)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{hobby}</span>
                      <button
                        onClick={() => removeItem("hobbies", index)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              {saveMessage && (
                <div className={`text-sm ${saveMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                  {saveMessage}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 ml-auto"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-3">💡 Why we collect this information</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>
              • <strong>Personalized Support:</strong> Our AI chatbot can provide more relevant advice based on your
              specific concerns
            </li>
            <li>
              • <strong>Targeted Resources:</strong> We can recommend coping strategies that align with your interests
              and hobbies
            </li>
            <li>
              • <strong>Progress Tracking:</strong> Understanding your stress factors helps us track your wellness
              journey
            </li>
            <li>
              • <strong>Privacy First:</strong> All information is stored securely and never shared with third parties
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
