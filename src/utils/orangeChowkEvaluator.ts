
// Orange Chowk AI Evaluation System based on the provided rubric

interface EvaluationResult {
  score: number;
  approved: boolean;
  feedback: string;
  aiDetected: boolean;
  breakdown: {
    depth: number;
    sincerity: number;
    creativeClarity: number;
    communityMindset: number;
  };
}

interface FormAnswers {
  motivation: string;
  community: string;
  collaboration: string;
  growth: string;
  values: string;
}

const AI_DETECTION_FLAGS = [
  'leverage', 'optimize', 'synergy', 'holistic', 'paradigm',
  'elevate', 'amplify', 'foster', 'cultivate', 'ecosystem',
  'innovative solutions', 'cutting-edge', 'next level',
  'game-changer', 'thought leader', 'best practices'
];

const POSITIVE_KEYWORDS = [
  'authentic', 'vulnerability', 'collaboration', 'build', 'share',
  'contribute', 'passion', 'journey', 'learn', 'grow',
  'community', 'connect', 'create', 'support', 'meaningful'
];

const PROMOTIONAL_FLAGS = [
  'startup', 'founder', 'ceo', 'brand', 'followers',
  'clients', 'revenue', 'scale', 'market', 'funding'
];

function detectAIGenerated(text: string): boolean {
  const lowerText = text.toLowerCase();
  let aiScore = 0;

  // Check for AI-typical phrases
  AI_DETECTION_FLAGS.forEach(flag => {
    if (lowerText.includes(flag)) aiScore += 2;
  });

  // Check for overly formal tone without depth
  const sentences = text.split('.').filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.length, 0) / sentences.length;
  
  if (avgSentenceLength > 120) aiScore += 1;
  
  // Check for lack of personal details or typos (humans make small errors)
  const hasPersonalPronouns = /\b(i|me|my|myself)\b/gi.test(text);
  const hasTypos = /\b(teh|adn|hte|recieve|seperate)\b/gi.test(text);
  
  if (!hasPersonalPronouns) aiScore += 2;
  if (!hasTypos && text.length > 200) aiScore += 1;

  return aiScore >= 3;
}

function evaluateMotivation(answer: string): number {
  const lowerText = answer.toLowerCase();
  let score = 5; // Start with average

  // Look for alignment with community intent
  if (lowerText.includes('network') && !lowerText.includes('meaningful')) score -= 2;
  if (lowerText.includes('build') || lowerText.includes('contribute')) score += 2;
  if (lowerText.includes('grow together') || lowerText.includes('community')) score += 1;
  
  // Check for promotional content
  PROMOTIONAL_FLAGS.forEach(flag => {
    if (lowerText.includes(flag)) score -= 1;
  });

  // Check for depth and specificity
  if (answer.length < 50) score -= 2;
  if (answer.length > 150 && answer.split('.').length > 2) score += 1;

  return Math.max(0, Math.min(10, score));
}

function evaluateCommunityMeaning(answer: string): number {
  const lowerText = answer.toLowerCase();
  let score = 5;

  // Look for emotional connection and collaboration
  if (lowerText.includes('collaboration') || lowerText.includes('share')) score += 2;
  if (lowerText.includes('vulnerability') || lowerText.includes('authentic')) score += 2;
  if (lowerText.includes('support') || lowerText.includes('help')) score += 1;

  // Check for generic or buzzwordy answers
  if (lowerText.includes('networking') && !lowerText.includes('meaningful')) score -= 2;
  if (lowerText.includes('platform') || lowerText.includes('opportunity')) score -= 1;

  // Check for depth
  if (answer.length < 40) score -= 2;
  if (answer.split('.').length > 2) score += 1;

  return Math.max(0, Math.min(10, score));
}

function evaluateCollaboration(answer: string): number {
  const lowerText = answer.toLowerCase();
  let score = 5;

  // Look for specificity and self-awareness
  const hasSpecificDetails = /\b(project|film|design|event|workshop|collaboration)\b/gi.test(answer);
  if (hasSpecificDetails) score += 2;

  // Check for emotional memory
  if (lowerText.includes('learned') || lowerText.includes('changed')) score += 1;
  if (lowerText.includes('felt') || lowerText.includes('realized')) score += 1;

  // Check for fake/generic stories
  if (answer.length < 60) score -= 2;
  if (lowerText.includes('once upon') || lowerText.includes('there was')) score -= 3;

  return Math.max(0, Math.min(10, score));
}

function evaluateGrowth(answer: string): number {
  const lowerText = answer.toLowerCase();
  let score = 5;

  // Look for passion and clarity
  if (lowerText.includes('passion') || lowerText.includes('excited')) score += 1;
  if (lowerText.includes('learn') || lowerText.includes('improve')) score += 1;
  if (lowerText.includes('skill') || lowerText.includes('craft')) score += 1;

  // Check for blank or exaggerated answers
  if (answer.length < 30) score -= 3;
  if (lowerText.includes('revolutionary') || lowerText.includes('groundbreaking')) score -= 2;

  return Math.max(0, Math.min(10, score));
}

function evaluateContribution(answer: string): number {
  const lowerText = answer.toLowerCase();
  let score = 5;

  // Look for reciprocity and initiative
  if (lowerText.includes('give') || lowerText.includes('contribute')) score += 2;
  if (lowerText.includes('help') || lowerText.includes('support')) score += 1;
  if (lowerText.includes('organize') || lowerText.includes('facilitate')) score += 1;

  // Check for taking-only mentality
  if (lowerText.includes('get') && !lowerText.includes('give')) score -= 1;
  if (lowerText.includes('benefit') && !lowerText.includes('contribute')) score -= 1;

  return Math.max(0, Math.min(10, score));
}

export function evaluateOrangeChowkApplication(answers: FormAnswers): EvaluationResult {
  const scores = {
    motivation: evaluateMotivation(answers.motivation),
    community: evaluateCommunityMeaning(answers.community),
    collaboration: evaluateCollaboration(answers.collaboration),
    growth: evaluateGrowth(answers.growth),
    contribution: evaluateContribution(answers.values)
  };

  // Check for AI generation across all answers
  const allText = Object.values(answers).join(' ');
  const aiDetected = detectAIGenerated(allText);

  // Calculate overall score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / 5;

  // Apply penalties for AI detection
  const finalScore = aiDetected ? Math.max(0, averageScore - 3) : averageScore;

  // Determine approval (threshold: 7.0)
  const approved = finalScore >= 7.0 && !aiDetected;

  // Generate feedback
  let feedback = '';
  if (aiDetected) {
    feedback = 'Application appears to contain AI-generated content. Orange Chowk values authentic, personal responses.';
  } else if (finalScore < 4) {
    feedback = 'Application lacks depth and community alignment. Consider reflecting more on what creative community means to you.';
  } else if (finalScore < 7) {
    feedback = 'Good intent shown, but responses need more specificity and emotional depth to align with Orange Chowk values.';
  } else {
    feedback = 'Strong alignment with Orange Chowk values. Welcome to the community!';
  }

  return {
    score: Math.round(finalScore * 10) / 10,
    approved,
    feedback,
    aiDetected,
    breakdown: {
      depth: Math.round(((scores.collaboration + scores.growth) / 2) * 10) / 10,
      sincerity: Math.round(((scores.motivation + scores.community) / 2) * 10) / 10,
      creativeClarity: scores.growth,
      communityMindset: Math.round(((scores.community + scores.contribution) / 2) * 10) / 10
    }
  };
}
