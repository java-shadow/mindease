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
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Mental Health Chatbot</h1>
            <p className="text-slate-600">
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

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chat History Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Chat History</span>
                  </h3>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showHistory ? "Hide" : "Show"}
                  </button>
                </div>

                {showHistory && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {chatHistory.length > 0 ? (
                      chatHistory.slice(-10).map((msg) => (
                        <div key={msg.id} className="p-2 bg-slate-50 rounded text-xs">
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4 chat-scroll">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === "user" ? "bg-blue-100" : "bg-green-100"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Bot className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-green-100 text-slate-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                        <Bot className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="bg-green-100 text-slate-800 px-4 py-2 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">
                        Sorry, I'm having trouble responding right now. Please try again.
                      </p>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 p-4">
                  <form onSubmit={onSubmit} className="flex space-x-3">
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          onSubmit(e as any)
                        }
                      }}
                      placeholder="Type your message here... I'm here to listen and support you."
                      className="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
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
