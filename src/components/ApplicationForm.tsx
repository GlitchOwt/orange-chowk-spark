import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { evaluateWithGemini, convertGeminiToApplicationResult } from '@/utils/geminiEvaluator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

const progressVariants = {
  hidden: { width: 0 },
  visible: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.8
    }
  })
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98
  }
};

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
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const { toast } = useToast();

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

  const saveApplicationToDatabase = async (applicationData: any, evaluation: any) => {
    try {
      const { error } = await supabase
        .from('application_responses')
        .insert([{
          name: applicationData.name,
          email: applicationData.email,
          city: applicationData.city,
          profession: applicationData.profession,
          past_events: applicationData.pastEvents,
          motivation: applicationData.answers.motivation,
          community_meaning: applicationData.answers.community,
          collaboration_story: applicationData.answers.collaboration,
          current_projects: applicationData.answers.growth,
          contribution_plans: applicationData.answers.values,
          evaluation_score: evaluation.score,
          evaluation_feedback: evaluation.feedback,
          evaluation_breakdown: evaluation.breakdown,
          ai_detected: evaluation.aiDetected,
          status: evaluation.approved ? 'approved' : 'rejected'
        }]);

      if (error) {
        console.error('Error saving application:', error);
        toast({
          title: "Warning",
          description: "Application processed but not saved to database. Please contact support.",
          variant: "destructive"
        });
      } else {
        console.log('Application saved successfully to database');
      }
    } catch (error) {
      console.error('Error saving application to database:', error);
      toast({
        title: "Warning",
        description: "Application processed but not saved to database. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Evaluate with Gemini AI
      const geminiResult = await evaluateWithGemini({
        motivation: formData.answers.motivation || '',
        community: formData.answers.community || '',
        collaboration: formData.answers.collaboration || '',
        growth: formData.answers.growth || '',
        values: formData.answers.values || ''
      });

      // Convert to application format
      const evaluation = convertGeminiToApplicationResult(geminiResult);

      console.log('Gemini AI Evaluation Result:', evaluation);
      
      const resultData = {
        ...formData,
        evaluation
      };

      // Save to database
      await saveApplicationToDatabase(formData, evaluation);

      onResult(evaluation.approved, resultData);
    } catch (error) {
      console.error('Application evaluation failed:', error);
      toast({
        title: "Error",
        description: "Failed to process application. Please try again.",
        variant: "destructive"
      });
      onResult(false, null);
    }
    
    setIsSubmitting(false);
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
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
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/50 shadow-sm"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-2xl font-bold text-slate-800 mb-2" 
            style={{ fontFamily: 'Youth Medium, sans-serif' }}
            variants={itemVariants}
          >
            orange <span className="text-orange-500">chowk</span>
          </motion.h1>
          <motion.p 
            className="text-slate-600 text-sm"
            variants={itemVariants}
          >
            A curated community for Indian creatives who build, share, and grow together
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {questions.length + 1}
            </span>
            <span className="text-sm text-orange-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-orange-500 h-2 rounded-full"
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              custom={progress}
            />
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              {/* Step 0: Basic Information */}
              {currentStep === 0 && (
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="text-center mb-8" variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">
                      Let's get to know you
                    </h2>
                    <p className="text-slate-600">
                      Basic information to get started
                    </p>
                  </motion.div>

                  <motion.div className="grid md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                      <Label htmlFor="name" className="text-slate-700 mb-2 block">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-slate-300 transition-all duration-200 focus:scale-[1.02]"
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
                        className="border-slate-300 transition-all duration-200 focus:scale-[1.02]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </motion.div>

                  <motion.div className="grid md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div>
                      <Label htmlFor="city" className="text-slate-700 mb-2 block">City</Label>
                      <select
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-700 transition-all duration-200 focus:scale-[1.02] focus:border-orange-500"
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
                        className="border-slate-300 transition-all duration-200 focus:scale-[1.02]"
                        placeholder="Designer, Filmmaker, etc."
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label className="text-slate-700 mb-2 block">
                      Which Orange Chowk events have you attended in the past?
                    </Label>
                    <div className="relative">
                      <motion.button
                        type="button"
                        onClick={() => setShowEventDropdown(!showEventDropdown)}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="text-slate-700">
                          {formData.pastEvents.length === 0 
                            ? "Select events you've attended (optional)" 
                            : `${formData.pastEvents.length} event(s) selected`
                          }
                        </span>
                        <motion.div
                          animate={{ rotate: showEventDropdown ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {showEventDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
                          >
                            {pastEvents.map((event, index) => (
                              <motion.label
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.pastEvents.includes(event.id)}
                                  onChange={() => handleEventToggle(event.id)}
                                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-slate-700 text-sm">{event.name}</span>
                              </motion.label>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {formData.pastEvents.length > 0 && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-orange-600 mt-2"
                        >
                          Selected: {formData.pastEvents.map(id => 
                            pastEvents.find(e => e.id === id)?.name
                          ).join(', ')}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              {/* Questions */}
              {currentStep > 0 && currentStep <= questions.length && (
                <motion.div
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="mb-6" variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-slate-800 mb-3">
                      Question {currentStep}
                    </h2>
                    <p className="text-slate-700 text-lg mb-2">
                      {questions[currentStep - 1].label}
                    </p>
                    <p className="text-orange-600 text-sm">
                      {questions[currentStep - 1].hint}
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Textarea
                      value={formData.answers[questions[currentStep - 1].id] || ''}
                      onChange={(e) => handleAnswerChange(questions[currentStep - 1].id, e.target.value)}
                      placeholder={questions[currentStep - 1].placeholder}
                      className="border-slate-300 min-h-[150px] resize-none transition-all duration-200 focus:scale-[1.01]"
                      rows={6}
                    />
                    
                    <motion.p 
                      className="text-slate-500 text-sm mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Minimum 30 characters required. Be authentic and thoughtful.
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {currentStep > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="ml-auto">
            {currentStep < questions.length ? (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                >
                  Continue
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Evaluating with AI...
                    </motion.div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-orange-800 text-sm text-center">
            <strong>Note:</strong> Your application will be evaluated by Gemini AI based on emotional depth, authenticity, creative clarity, and community mindset. 
            Please provide genuine, personal responses.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};