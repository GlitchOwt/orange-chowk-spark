
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApplicationFormProps {
  onResult: (approved: boolean, data: any) => void;
}

const questions = [
  {
    id: 'motivation',
    label: 'What drives your creative work, and how do you see it evolving?',
    placeholder: 'Share your creative journey and aspirations...'
  },
  {
    id: 'community',
    label: 'How do you typically engage with and contribute to creative communities?',
    placeholder: 'Describe your approach to community building...'
  },
  {
    id: 'collaboration',
    label: 'Tell us about a meaningful collaboration or creative project you\'ve been involved in.',
    placeholder: 'Share your collaborative experiences...'
  },
  {
    id: 'growth',
    label: 'What specific skills or perspectives are you looking to develop in your creative practice?',
    placeholder: 'Discuss your learning goals...'
  },
  {
    id: 'values',
    label: 'How do you balance commercial success with creative authenticity in your work?',
    placeholder: 'Share your thoughts on this balance...'
  }
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh', 'Other'
];

export const ApplicationForm = ({ onResult }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    profession: '',
    portfolio: '',
    answers: {} as Record<string, string>
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  const evaluateApplication = async (responses: Record<string, string>) => {
    // Simulate AI evaluation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple scoring based on response length and keywords
    let score = 0;
    const positiveKeywords = ['passion', 'authentic', 'collaborate', 'growth', 'community', 'meaningful', 'purpose', 'creative', 'innovative', 'balance'];
    
    Object.values(responses).forEach(response => {
      // Length score
      if (response.length > 100) score += 20;
      if (response.length > 200) score += 10;
      
      // Keyword score
      positiveKeywords.forEach(keyword => {
        if (response.toLowerCase().includes(keyword)) score += 5;
      });
      
      // Avoid generic responses
      if (response.toLowerCase().includes('ai') || response.length < 50) score -= 15;
    });
    
    return score > 80; // Threshold for approval
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const approved = await evaluateApplication(formData.answers);
      onResult(approved, formData);
    } catch (error) {
      console.error('Application evaluation failed:', error);
      onResult(false, null);
    }
    
    setIsSubmitting(false);
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.name && formData.email && formData.city && formData.profession;
    }
    return questions.slice(0, currentStep).every(q => 
      formData.answers[q.id] && formData.answers[q.id].length > 30
    );
  };

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {questions.length + 1}
            </span>
            <span className="text-sm text-orange-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step 0: Basic Information */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Let's get to know you
              </h2>
              <p className="text-slate-400">
                Basic information to get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-white mb-2 block">City</Label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Select your city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="profession" className="text-white mb-2 block">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Designer, Filmmaker, etc."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="portfolio" className="text-white mb-2 block">Portfolio/Website (Optional)</Label>
              <Input
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://your-portfolio.com"
              />
            </div>
          </motion.div>
        )}

        {/* Questions */}
        {currentStep > 0 && currentStep <= questions.length && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Question {currentStep}
              </h2>
              <p className="text-orange-400 text-lg">
                {questions[currentStep - 1].label}
              </p>
            </div>

            <Textarea
              value={formData.answers[questions[currentStep - 1].id] || ''}
              onChange={(e) => handleAnswerChange(questions[currentStep - 1].id, e.target.value)}
              placeholder={questions[currentStep - 1].placeholder}
              className="bg-slate-700 border-slate-600 text-white min-h-[150px] resize-none"
              rows={6}
            />
            
            <p className="text-slate-400 text-sm">
              Minimum 30 characters required. Be authentic and thoughtful.
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(prev => prev - 1)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="ml-auto">
            {currentStep < questions.length ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Evaluating...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
