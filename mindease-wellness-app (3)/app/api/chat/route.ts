import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return new Response("GROQ_API_KEY is not set – add it to your environment", { status: 500 })
  }

  try {
    const { messages, userData } = await req.json()

    // Create a personalized system prompt based on user data
    const systemPrompt = `You are MindEase, a compassionate AI mental health companion. You provide supportive, empathetic, and helpful responses to users seeking mental wellness guidance.

IMPORTANT GUIDELINES:
- Always be empathetic, non-judgmental, and supportive
- Provide practical coping strategies and wellness tips
- Encourage professional help when appropriate
- Never provide medical diagnoses or replace professional therapy
- Keep responses conversational and warm
- Use the user's profile information to personalize your responses

USER PROFILE:
${userData?.name ? `Name: ${userData.name}` : "Name: Not provided"}
${userData?.age ? `Age: ${userData.age}` : "Age: Not provided"}
${userData?.fears?.length ? `Fears/Anxieties: ${userData.fears.join(", ")}` : "Fears: Not specified"}
${userData?.stressFactors?.length ? `Stress Factors: ${userData.stressFactors.join(", ")}` : "Stress Factors: Not specified"}
${userData?.hobbies?.length ? `Hobbies/Interests: ${userData.hobbies.join(", ")}` : "Hobbies: Not specified"}

Use this information to provide more personalized and relevant support. If the user mentions something related to their profile, acknowledge it and provide targeted advice.

Remember: You are here to listen, support, and guide - not to diagnose or replace professional mental health care.`

    const result = await streamText({
      model: groq("llama3-70b-8192"),
      system: systemPrompt,
      messages,
      maxTokens: 500,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Error processing chat request", { status: 500 })
  }
}
