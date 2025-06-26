// This is just for reference - in a real app, you'd set these in your deployment environment
export async function GET() {
  return Response.json({
    message: "Add your OPENAI_API_KEY environment variable to enable AI features",
  })
}
