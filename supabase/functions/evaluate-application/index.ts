import { GoogleGenerativeAI } from 'npm:@google/generative-ai@^0.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface FormAnswers {
  motivation: string;
  community: string;
  collaboration: string;
  growth: string;
  values: string;
}

const EVALUATION_PROMPT = `You are an expert AI evaluator for Orange Chowk, a curated, emotionally intelligent creative community for Indian designers, filmmakers, writers, and founders.

🔑 CONTEXT:
Orange Chowk values emotional depth, creative authenticity, intentional contribution, and vulnerability. It is not a place for shallow promotion, growth-hacking, or generic networking. Your goal is to help build a genuine, meaningful creative network by scoring and filtering applicants.

🎯 OBJECTIVE:
For each application answer, provide:

1. A score from 0 to 10, evaluating:
  - Emotional honesty and depth
  - Specificity and groundedness (not vague or generic)
  - Genuine intent to contribute to the community
  - Creativity and natural human texture (not AI-overprocessed)

2. A boolean flag \`flagged_as_ai\` to indicate likely AI-generated content, based on:
  - Overly polished grammar or tone
  - Use of em dashes (—)
  - Repetitive sentence structures or unnatural transitions
  - Lack of typos, slang, or natural human imperfections
  - Absence of personal anecdotes or culturally grounded references

📊 SCORING SCALE:
0–3: Generic, self-promotional, or AI-like  
4–6: Some merit, but lacking sincerity or true community fit  
7–8: Good alignment, honest and with intent to contribute  
9–10: Exceptional fit — emotionally rich, creative, and grounded

🔐 ADDITIONAL GUIDANCE:
- Flag if 2 or more AI indicators appear  
- Reward honesty even if responses are imperfect  
- Reject overly polished, generic, or promotional language

📦 OUTPUT FORMAT (JSON):
{
  "score": <integer 0–10>,
  "flagged_as_ai": true|false,
  "comments": "Short reasoning for the score and AI flag"
}

---

Sample input:  
"I want to be part of Orange Chowk because it's a safe, creative space where I can grow with others."  
Expected output:  
{ "score": 8, "flagged_as_ai": false, "comments": "Genuine, heartfelt, aligned with community values." }`;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers }: { answers: FormAnswers } = await req.json();

    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.1, // Low temperature for consistent evaluation
      }
    });

    // Combine all answers into a single text for evaluation
    const fullText = `
Question 1 - Why do you want to be part of Orange Chowk?
${answers.motivation}

Question 2 - What does a creative community mean to you?
${answers.community}

Question 3 - Describe a moment where community changed something for you.
${answers.collaboration}

Question 4 - What are you currently building, making, or dreaming about?
${answers.growth}

Question 5 - How do you want to contribute to the community?
${answers.values}
    `.trim();

    const prompt = `${EVALUATION_PROMPT}

Please evaluate the following application responses:

${fullText}

Provide your evaluation as a JSON object with score, flagged_as_ai, and comments fields.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (typeof evaluation.score !== 'number' || 
        typeof evaluation.flagged_as_ai !== 'boolean' || 
        typeof evaluation.comments !== 'string') {
      throw new Error('Invalid evaluation structure from Gemini');
    }

    // Ensure score is within valid range
    evaluation.score = Math.max(0, Math.min(10, Math.round(evaluation.score)));

    return new Response(
      JSON.stringify(evaluation),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in evaluate-application function:', error);
    
    // Return fallback evaluation
    const fallbackEvaluation = {
      score: 5,
      flagged_as_ai: false,
      comments: 'Unable to evaluate with AI. Manual review required.'
    };

    return new Response(
      JSON.stringify(fallbackEvaluation),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 // Return 200 with fallback instead of error
      }
    );
  }
});