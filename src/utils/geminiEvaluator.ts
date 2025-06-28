import { supabase } from '@/integrations/supabase/client';

interface GeminiEvaluationResult {
  score: number;
  flagged_as_ai: boolean;
  comments: string;
}

interface FormAnswers {
  motivation: string;
  community: string;
  collaboration: string;
  growth: string;
  values: string;
}

export async function evaluateWithGemini(answers: FormAnswers): Promise<GeminiEvaluationResult> {
  try {
    // Call the Supabase Edge Function instead of directly calling Gemini
    const { data, error } = await supabase.functions.invoke('evaluate-application', {
      body: {
        answers: answers
      }
    });

    if (error) {
      console.error('Error calling edge function:', error);
      throw error;
    }

    if (!data || typeof data.score !== 'number' || 
        typeof data.flagged_as_ai !== 'boolean' || 
        typeof data.comments !== 'string') {
      throw new Error('Invalid evaluation structure from edge function');
    }

    // Ensure score is within valid range
    data.score = Math.max(0, Math.min(10, Math.round(data.score)));

    return data;

  } catch (error) {
    console.error('Error evaluating application:', error);
    
    // Fallback evaluation in case of API failure
    return {
      score: 5,
      flagged_as_ai: false,
      comments: 'Unable to evaluate with AI. Manual review required.'
    };
  }
}

// Convert Gemini result to the format expected by the application
export function convertGeminiToApplicationResult(geminiResult: GeminiEvaluationResult) {
  return {
    score: geminiResult.score,
    approved: geminiResult.score >= 7 && !geminiResult.flagged_as_ai,
    feedback: geminiResult.comments,
    aiDetected: geminiResult.flagged_as_ai,
    breakdown: {
      depth: geminiResult.score,
      sincerity: geminiResult.flagged_as_ai ? 2 : geminiResult.score,
      creativeClarity: geminiResult.score,
      communityMindset: geminiResult.score
    }
  };
}