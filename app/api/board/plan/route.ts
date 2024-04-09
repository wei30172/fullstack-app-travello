import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

import { calculateDays, formatDateTime } from "@/lib/utils"

export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const generateInstructionMessage = (
  location: string,
  startDate: Date,
  endDate: Date
): string => {
  const days = calculateDays(startDate, endDate)
  const formattedStartDate = formatDateTime(startDate).dateOnly
  const formattedEndDate = formatDateTime(endDate).dateOnly

  return `
    You are an expert travel planner. The most important task you have is responding with only about trip and no other text. Like sure or certainly.
    I am planning a trip to ${location} from ${formattedStartDate} to ${formattedEndDate}, lasting ${days} days.
    Please provide a day-by-day itinerary for the trip. For each day, list out specific attractions or activities in ${location}. Present the itinerary in a structured format with each day labeled from Day 1 to Day ${days}, followed by the activities for that day. 
    Ensure the recommendations are practical and consider the travel time between locations. Aim for a mix of cultural, historical, and recreational activities to give a well-rounded experience of ${location}.
    Reply in a list format, starting each day's plan with "Day X:", where X is the day number, followed by a dash and the activities. For example:

    Day 1:
    - Activity 1
    - Activity 2

    Day 2:
    - Activity 1
    - Activity 2
    ...

    The most important task you have is responding with only about trip and no other text. Like sure or certainly.
  `;
}

export async function POST(
  req: Request
) {
  try {
    const { location, startDate, endDate } = await req.json()
    // console.log({ location, startDate, endDate })

    const instructionMessage = generateInstructionMessage(
      location, startDate, endDate
    )

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      stream: true,
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [{ type: "text", text: instructionMessage }]
      }]
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error("[ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}