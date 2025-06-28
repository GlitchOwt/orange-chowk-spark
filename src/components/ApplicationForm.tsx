import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { evaluateOrangeChowkApplication } from '@/utils/orangeChowkEvaluator';

interface ApplicationFormProps {
  onResult: (approved: boolean, data: any) => void;
}

const questions = [
  {
    id: 'motivation',
    label: 'Why do you want to be part of Orange Chowk?',
    placeholder: 'Share your genuine motivation for joining this creative community...',
    hint: 'We\'re looking for alignment with community intent, not just networking goals.'
  },
  {
    id: 'community',
    label: 'What does a creative community mean to you?',
    placeholder: 'Describe your understanding of creative collaboration and connection...',
    hint: 'Tell us about emotional connection, collaboration, vulnerability, and sharing.'
  },
  {
    id: 'collaboration',
    label: 'Describe a moment where community changed something for you.',
    placeholder: 'Share a specific experience where being part of a community made a difference...',
    hint: 'We want to hear a real story with specific details and emotional memory.'
  },
  {
    id: 'growth',
    label: 'What are you currently building, making, or dreaming about?',
    placeholder: 'Tell us about your current creative projects and aspirations...',
    hint: 'Show us your passion and clarity, even if your ideas are raw or early-stage.'
  },
  {
    id: 'values',
    label: 'How do you want to contribute to the community?',
    placeholder: 'Describe how you plan to give back and support fellow creatives...',
    hint: 'We value reciprocity and initiative. How will you help build this community?'
  }
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh', 'Other'
];

const pastEvents = [
  { id: 'creative-minds-mumbai', name: 'Creative Minds Meetup - Mumbai', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&object=cover' },
  { id: 'design-thinking-delhi', name: 'Design Thinking Workshop - Delhi', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&object=cover' },
  { id: 'storytelling-bangalore', name: 'Visual Storytelling Summit - Bangalore', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&object=cover' },
  { id: 'brand-identity-mumbai', name: 'Brand Identity Bootcamp - Mumbai', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&object=cover' },
  { id: 'photography-chennai', name: 'Street Photography Walk - Chennai', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&object=cover' },
  { id: 'ux-research-pune', name: 'UX Research Masterclass - Pune', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&object=cover' }
];

export const ApplicationForm = ({ onResult }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    profession: '',
    pastEvents: [] as string[],
    answers: {} as Record<string, string>
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventToggle = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      pastEvents: prev.pastEvents.includes(eventId)
        ? prev.pastEvents.filter(id => id !== eventId)
        : [...prev.pastEvents, eventId]
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const evaluation = evaluateOrangeChowkApplication({
        motivation: formData.answers.motivation || '',
        community: formData.answers.community || '',
        collaboration: formData.answers.collaboration || '',
        growth: formData.answers.growth || '',
        values: formData.answers.values || ''
      });

      console.log('Evaluation Result:', evaluation);
      
      const resultData = {
        ...formData,
        evaluation
      };

      onResult(evaluation.approved, resultData);
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/50 shadow-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="framer-text bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            orange chowk
          </h1>
          <p className="text-slate-600 text-sm">
            A curated community for Indian creatives who build, share, and grow together
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {questions.length + 1}
            </span>
            <span className="text-sm text-orange-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
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
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Let's get to know you
              </h2>
              <p className="text-slate-600">
                Basic information to get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-700 mb-2 block">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-slate-300"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-slate-700 mb-2 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-slate-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-slate-700 mb-2 block">City</Label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-700"
                >
                  <option value="">Select your city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="profession" className="text-slate-700 mb-2 block">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="border-slate-300"
                  placeholder="Designer, Filmmaker, etc."
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-700 mb-2 block">
                Which Orange Chowk events have you attended in the past?
              </Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-left flex items-center justify-between bg-white hover:bg-slate-50"
                >
                  <span className="text-slate-700">
                    {formData.pastEvents.length === 0 
                      ? "Select events you've attended (optional)" 
                      : `${formData.pastEvents.length} event(s) selected`
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                
                {showEventDropdown && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {pastEvents.map((event) => (
                      <label
                        key={event.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.pastEvents.includes(event.id)}
                          onChange={() => handleEventToggle(event.id)}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-slate-700 text-sm">{event.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {formData.pastEvents.length > 0 && (
                <p className="text-sm text-orange-600 mt-2">
                  Selected: {formData.pastEvents.map(id => 
                    pastEvents.find(e => e.id === id)?.name
                  ).join(', ')}
                </p>
              )}
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Question {currentStep}
              </h2>
              <p className="text-slate-700 text-lg mb-2">
                {questions[currentStep - 1].label}
              </p>
              <p className="text-orange-600 text-sm">
                {questions[currentStep - 1].hint}
              </p>
            </div>

            <Textarea
              value={formData.answers[questions[currentStep - 1].id] || ''}
              onChange={(e) => handleAnswerChange(questions[currentStep - 1].id, e.target.value)}
              placeholder={questions[currentStep - 1].placeholder}
              className="border-slate-300 min-h-[150px] resize-none"
              rows={6}
            />
            
            <p className="text-slate-500 text-sm">
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
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
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
                    Evaluating Application...
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

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-orange-800 text-sm text-center">
            <strong>Note:</strong> Our AI evaluates applications based on depth, sincerity, creative clarity, and community mindset. 
            Please provide authentic, personal responses.
          </p>
        </div>
      </motion.div>
    </div>
  );
};