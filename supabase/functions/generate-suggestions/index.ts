
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('AIzaSyDC3rNt_ub03qOxxkwNBk7JR7d0JCu4e-Q')
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()

    console.log('Received content:', content)

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Given this note content: "${content}", provide 3 specific suggestions to improve or expand the note. Format your response as a JSON array of strings. Each suggestion should be concise and actionable.`
          }]
        }]
      })
    })

    const data = await response.json()
    console.log('Gemini API response:', data)

    const suggestions = data.candidates[0].content.parts[0].text
    let parsedSuggestions

    try {
      parsedSuggestions = JSON.parse(suggestions)
    } catch (e) {
      // If the response isn't valid JSON, try to extract suggestions from the text
      parsedSuggestions = suggestions
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3)
    }

    return new Response(
      JSON.stringify({ suggestions: parsedSuggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-suggestions:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
