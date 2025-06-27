"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useChat } from "ai/react"
import { Send, Bot, User, Loader2, History } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import ApiSetupGuide from "@/components/api-setup-guide"
import { saveChatMessage, getUserChatHistory, type ChatMessage } from "@/lib/firebase-service"

export default function ChatbotPage() {
  const { user, firebaseUser } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      userData: user
        ? {
            name: user.name,
            age: user.age,
            fears: user.fears,
            stressFactors: user.stressFactors,
            hobbies: user.hobbies,
          }
        : null,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: user?.name
          ? `Hello ${user.name}! I'm here to listen and support you on your mental wellness journey. How are you feeling today?`
          : "Hello! I'm here to listen and support you. How are you feeling today?",
      },
    ],
    onError: (error) => {
      if (error.message.includes("GROQ_API_KEY")) {
        setApiError("API key not configured")
      }
    },
    onFinish: async (message) => {
      // Save assistant message to Firestore
      if (firebaseUser) {
        try {
          await saveChatMessage(firebaseUser.uid, "assistant", message.content)
        } catch (error) {
          console.error("Error saving assistant message:", error)
        }
      }
    },
  })

  const loadChatHistory = async () => {
    if (!firebaseUser) return

    try {
      const history = await getUserChatHistory(firebaseUser.uid, 20)
      setChatHistory(history)
    } catch (error) {
      console.error("Error loading chat history:", error)
    }
  }

  useEffect(() => {
    loadChatHistory()
  }, [firebaseUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Save user message to Firestore
    if (firebaseUser) {
      try {
        await saveChatMessage(firebaseUser.uid, "user", input)
      } catch (error) {
        console.error("Error saving user message:", error)
      }
    }

    handleSubmit(e)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 mb-2">Mental Health Chatbot</h1>
            <p className="text-lg text-slate-700">
              {user?.name ? `Welcome back, ${user.name}!` : "Welcome!"} A safe space to share your thoughts and feelings
            </p>
            {user?.fears?.length || user?.stressFactors?.length ? (
              <p className="text-sm text-blue-600 mt-2">
                💡 I have your profile information and can provide personalized support
              </p>
            ) : (
              <p className="text-sm text-orange-600 mt-2">
                💡 Complete your{" "}
                <a href="/profile" className="underline">
                  profile
                </a>{" "}
                for more personalized support
              </p>
            )}
          </div>

          {apiError && (
            <div className="mb-8">
              <ApiSetupGuide />
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chat History Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-blue-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-700 flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Chat History</span>
                  </h3>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-fuchsia-600 hover:text-fuchsia-700"
                  >
                    {showHistory ? "Hide" : "Show"}
                  </button>
                </div>

                {showHistory && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {chatHistory.length > 0 ? (
                      chatHistory.slice(-10).map((msg) => (
                        <div key={msg.id} className="p-2 bg-blue-50 rounded text-xs">
                          <div className="flex items-center space-x-1 mb-1">
                            <span className={`font-medium ${msg.role === "user" ? "text-blue-600" : "text-green-600"}`}>
                              {msg.role === "user" ? "You" : "AI"}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-400">{formatDate(msg.createdAt)}</span>
                          </div>
                          <p className="text-slate-600 line-clamp-2">
                            {msg.content.substring(0, 80)}
                            {msg.content.length > 80 ? "..." : ""}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic">No chat history yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 rounded-3xl shadow-lg border-2 border-fuchsia-200 overflow-hidden">
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-8 space-y-6 chat-scroll">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                          message.role === "user" ? "bg-gradient-to-r from-blue-400 to-fuchsia-400" : "bg-gradient-to-r from-green-300 to-blue-300"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-5 py-3 shadow text-base max-w-xl ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-100 to-fuchsia-100 text-blue-900"
                            : "bg-gradient-to-r from-green-100 to-blue-100 text-green-900"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <form onSubmit={onSubmit} className="flex items-center gap-4 border-t border-fuchsia-200 bg-white/90 px-6 py-4">
                  <input
                    className="flex-1 rounded-full border-2 border-fuchsia-200 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-base bg-white"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-fuchsia-700 hover:to-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-semibold text-slate-800 mb-3">💬 How to get the best support</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Be honest about your feelings and experiences</li>
                <li>• Ask specific questions about coping strategies</li>
                <li>• Share what's been on your mind lately</li>
                <li>• Let me know if you need immediate professional help</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-semibold text-slate-800 mb-3">🎯 Personalized Support</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                {user?.fears?.length ? (
                  <li>• I can help with strategies for: {user.fears.slice(0, 2).join(", ")}</li>
                ) : null}
                {user?.stressFactors?.length ? (
                  <li>• I understand your stress around: {user.stressFactors.slice(0, 2).join(", ")}</li>
                ) : null}
                {user?.hobbies?.length ? (
                  <li>• I can suggest wellness activities related to: {user.hobbies.slice(0, 2).join(", ")}</li>
                ) : null}
                {!user?.fears?.length && !user?.stressFactors?.length && !user?.hobbies?.length ? (
                  <li>• Complete your profile for more targeted support</li>
                ) : null}
              </ul>
            </div>
          </div>

          {/* Crisis Support */}
          <div className="mt-6 bg-red-50 rounded-2xl p-6 border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Need Immediate Help?</h3>
            <p className="text-sm text-red-700 mb-3">
              If you're having thoughts of self-harm or suicide, please reach out for immediate professional help:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:988"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors text-center"
              >
                Call 988 (Suicide & Crisis Lifeline)
              </a>
              <a
                href="tel:911"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors text-center"
              >
                Call 911 (Emergency)
              </a>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
