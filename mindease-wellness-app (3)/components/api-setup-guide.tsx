import { ExternalLink, Key, Zap } from "lucide-react"

export default function ApiSetupGuide() {
  return (
    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">Setup AI Features</h3>
      </div>

      <p className="text-slate-600 mb-4">
        To enable AI-powered chatbot and journal prompts, you need to set up a Groq API key:
      </p>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-blue-600">1</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Visit{" "}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
              >
                Groq Console <ExternalLink className="w-3 h-3 ml-1" />
              </a>{" "}
              and create a free account
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-blue-600">2</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">Generate an API key from your dashboard</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-blue-600">3</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Add <code className="bg-slate-100 px-2 py-1 rounded text-xs">GROQ_API_KEY</code> to your environment
              variables
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-100 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Key className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Environment Variable:</span>
        </div>
        <code className="text-xs text-slate-600">GROQ_API_KEY=gsk_your_api_key_here</code>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        💡 Groq offers fast inference with generous free tier limits - perfect for development!
      </div>
    </div>
  )
}
