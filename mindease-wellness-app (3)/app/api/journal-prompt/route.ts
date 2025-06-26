import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return new Response("GROQ_API_KEY is not set – add it to your environment", { status: 500 })
  }

  try {
    const { userData } = await req.json()

    const systemPrompt = `You are a mental wellness journal assistant. Generate a thoughtful, personalized journal prompt that encourages self-reflection and emotional awareness.

USER PROFILE:
${userData?.name ? `Name: ${userData.name}` : "Name: Not provided"}
${userData?.fears?.length ? `Fears/Anxieties: ${userData.fears.join(", ")}` : "Fears: Not specified"}
${userData?.stressFactors?.length ? `Stress Factors: ${userData.stressFactors.join(", ")}` : "Stress Factors: Not specified"}
${userData?.hobbies?.length ? `Hobbies/Interests: ${userData.hobbies.join(", ")}` : "Hobbies: Not specified"}

Create a single, thoughtful journal prompt (1-2 sentences) that:
- Encourages positive self-reflection
- Is relevant to their profile if available
- Promotes emotional awareness and growth
- Is supportive and non-judgmental

Return only the prompt, nothing else.`

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      system: systemPrompt,
      prompt: "Generate a personalized journal prompt for today.",
      maxTokens: 100,
      temperature: 0.8,
    })

    return Response.json({ prompt: text })
  } catch (error) {
    console.error("Journal prompt API error:", error)
    return new Response("Error generating prompt", { status: 500 })
  }
}
