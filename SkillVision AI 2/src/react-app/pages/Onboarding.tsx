import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Brain, User, GraduationCap, Heart, Target, ArrowRight, Leaf, Star, Globe } from 'lucide-react';

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education_level: '',
    current_interests: '',
    vision_2030_preference: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      });

      if (response.ok) {
        navigate('/quiz');
      } else {
        console.error('Failed to create student profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim() !== '';
      case 2: return formData.age !== '' && parseInt(formData.age) >= 13 && parseInt(formData.age) <= 30;
      case 3: return formData.education_level !== '';
      case 4: return formData.current_interests.trim() !== '';
      case 5: return formData.vision_2030_preference !== '';
      default: return false;
    }
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-hero-pattern">
      {/* Header */}
      <div className="nav-glass px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-vision-gradient rounded-lg flex items-center justify-center shadow-vision">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-vision">SkillVision AI</span>
          </div>
          <div className="badge-vision">
            Step {step} of 5
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-vision-mesh">
        <div className="max-w-2xl mx-auto">
          <div className="w-full bg-neutral-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-vision-gradient h-3 rounded-full transition-all duration-500 shadow-vision"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-500">
            <span>Setting up your profile</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="section-padding px-6">
        <div className="max-w-2xl mx-auto">
          <div className="card-elevated p-8 animate-fade-in">
            {step === 1 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-heritage">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-display mb-4">Welcome to SkillVision AI!</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  Let's start by getting to know you better. This helps us provide personalized 
                  skill recommendations aligned with Saudi Vision 2030.
                </p>
                
                <div className="space-y-4">
                  <label className="block text-left">
                    <span className="text-sm font-medium text-neutral-700 mb-2 block">What's your name?</span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="input-field"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-neutral-500">
                  <Leaf className="w-3 h-3 text-vision-500" />
                  <span>Building your sustainable future profile</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-heritage-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-display mb-4">How old are you?</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  This helps us provide age-appropriate skill recommendations and learning paths 
                  that match your current life stage and future aspirations.
                </p>
                
                <div className="space-y-4">
                  <label className="block text-left">
                    <span className="text-sm font-medium text-neutral-700 mb-2 block">Age</span>
                    <input
                      type="number"
                      min="13"
                      max="30"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Enter your age"
                      className="input-field"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-neutral-500">
                  <Star className="w-3 h-3 text-desert-500" />
                  <span>Tailoring recommendations for your journey</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-desert-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-display mb-4">Education Level</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  Understanding your educational background helps us recommend skills and learning paths 
                  that build upon your current knowledge base.
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'High School Student',
                    'High School Graduate',
                    'University Student',
                    'University Graduate',
                    'Other'
                  ].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, education_level: level })}
                      className={`p-4 rounded-xl border text-left transition-all font-medium ${
                        formData.education_level === level
                          ? 'border-vision-500 bg-vision-50 text-vision-800 shadow-vision'
                          : 'border-neutral-200 hover:border-vision-300 hover:bg-vision-50/50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-display mb-4">Your Interests</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  Tell us about your current interests and hobbies. This helps us match you with skills 
                  that align with your natural passions and curiosities.
                </p>
                
                <div className="space-y-4">
                  <label className="block text-left">
                    <span className="text-sm font-medium text-neutral-700 mb-2 block">Current Interests & Hobbies</span>
                    <textarea
                      value={formData.current_interests}
                      onChange={(e) => setFormData({ ...formData, current_interests: e.target.value })}
                      placeholder="e.g., Technology, Gaming, Art, Sports, Science, Music, Environmental conservation, Social media, Photography..."
                      rows={4}
                      className="input-field resize-none"
                    />
                  </label>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-neutral-500">
                  <Heart className="w-3 h-3 text-pink-500" />
                  <span>Matching skills to your passions</span>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-heritage">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-display mb-4">Vision 2030 Focus</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  Which Saudi Vision 2030 pillar resonates most with your aspirations? 
                  This helps us align your skill development with the Kingdom's transformation goals.
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { 
                      id: 'thriving_economy', 
                      name: 'Thriving Economy', 
                      desc: 'Technology, Renewable Energy, Finance, Innovation, Sustainable Development',
                      icon: <Globe className="w-5 h-5" />,
                      color: 'border-vision-200 hover:border-vision-400'
                    },
                    { 
                      id: 'ambitious_nation', 
                      name: 'Ambitious Nation', 
                      desc: 'Leadership, Digital Government, Public Service, Smart Cities',
                      icon: <Target className="w-5 h-5" />,
                      color: 'border-blue-200 hover:border-blue-400'
                    },
                    { 
                      id: 'vibrant_society', 
                      name: 'Vibrant Society', 
                      desc: 'Culture, Arts, Tourism, Entertainment, Sports, Quality of Life',
                      icon: <Heart className="w-5 h-5" />,
                      color: 'border-desert-200 hover:border-desert-400'
                    },
                    { 
                      id: 'all', 
                      name: 'All Areas Interest Me', 
                      desc: 'Show me opportunities across all Vision 2030 pillars',
                      icon: <Star className="w-5 h-5" />,
                      color: 'border-neutral-200 hover:border-neutral-400'
                    }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({ ...formData, vision_2030_preference: option.id })}
                      className={`p-4 rounded-xl border text-left transition-all group ${
                        formData.vision_2030_preference === option.id
                          ? 'border-vision-500 bg-vision-50 text-vision-800 shadow-vision'
                          : option.color
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          formData.vision_2030_preference === option.id 
                            ? 'bg-vision-200 text-vision-700' 
                            : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200'
                        }`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{option.name}</div>
                          <div className="text-sm text-neutral-600">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  step === 1
                    ? 'text-neutral-400 cursor-not-allowed'
                    : 'btn-ghost'
                }`}
              >
                Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isStepValid()
                    ? 'btn-primary'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {step === 5 ? (
                  <>
                    <Leaf className="w-4 h-4" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-500">
              🌱 Setting up your sustainable future skills profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
