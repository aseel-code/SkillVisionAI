import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Brain, CheckCircle, Circle, ArrowRight, Clock, Leaf, Target } from 'lucide-react';

const quizQuestions = [
  {
    id: 'problem_solving',
    question: 'When faced with a complex problem, what is your preferred approach?',
    options: [
      'Break it down into smaller parts and tackle each systematically',
      'Research extensively before taking any action',
      'Brainstorm creative solutions with others',
      'Use tried-and-tested methods that have worked before',
      'Experiment with different approaches until one works'
    ]
  },
  {
    id: 'technology_comfort',
    question: 'How comfortable are you with learning new technologies?',
    options: [
      'Very comfortable - I love exploring new tech',
      'Somewhat comfortable - I can adapt when needed',
      'Neutral - depends on the technology',
      'Prefer to stick with what I know well',
      'I find technology challenging but I try'
    ]
  },
  {
    id: 'work_environment',
    question: 'What type of work environment energizes you most?',
    options: [
      'Collaborative team settings with lots of interaction',
      'Independent work with minimal supervision',
      'Fast-paced environments with constant change',
      'Structured environments with clear processes',
      'Creative spaces that encourage innovation'
    ]
  },
  {
    id: 'communication_style',
    question: 'How do you prefer to communicate ideas?',
    options: [
      'Visual presentations and infographics',
      'Written reports and documentation',
      'Verbal discussions and meetings',
      'Hands-on demonstrations',
      'Digital platforms and social media'
    ]
  },
  {
    id: 'learning_preference',
    question: 'What is your preferred way of learning new skills?',
    options: [
      'Online courses and tutorials',
      'Hands-on practice and experimentation',
      'Reading books and articles',
      'Learning from mentors and experts',
      'Group workshops and seminars'
    ]
  },
  {
    id: 'future_impact',
    question: 'What kind of impact do you want to make in the future?',
    options: [
      'Solve environmental and sustainability challenges',
      'Improve healthcare and quality of life',
      'Advance technology and innovation',
      'Enhance education and knowledge sharing',
      'Strengthen communities and social connections'
    ]
  },
  {
    id: 'saudi_vision_interest',
    question: 'Which Saudi Vision 2030 initiative excites you most?',
    options: [
      'NEOM and smart city development',
      'Saudi Green Initiative and environmental projects',
      'Digital transformation and AI initiatives',
      'Cultural and entertainment sector growth',
      'Healthcare system modernization'
    ]
  },
  {
    id: 'skill_development',
    question: 'When developing a new skill, you prefer:',
    options: [
      'Step-by-step structured learning paths',
      'Project-based learning with real outcomes',
      'Theoretical understanding first, then practice',
      'Learning alongside peers in groups',
      'Self-directed exploration and discovery'
    ]
  },
  {
    id: 'career_motivation',
    question: 'What motivates you most in your career aspirations?',
    options: [
      'Making a positive impact on society',
      'Financial success and stability',
      'Recognition and professional achievement',
      'Continuous learning and growth',
      'Work-life balance and personal fulfillment'
    ]
  },
  {
    id: 'global_challenges',
    question: 'Which global challenge would you most like to contribute to solving?',
    options: [
      'Climate change and environmental protection',
      'Healthcare accessibility and medical breakthroughs',
      'Education inequality and access to knowledge',
      'Economic development and poverty reduction',
      'Technology ethics and digital rights'
    ]
  }
];

export default function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    const questionId = quizQuestions[currentQuestion].id;
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const formattedResponses = Object.entries(responses).map(([question_id, response]) => ({
        question_id,
        response
      }));

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: formattedResponses
        }),
      });

      if (response.ok) {
        navigate('/results');
      } else {
        console.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQuestionData = quizQuestions[currentQuestion];
  const currentResponse = responses[currentQuestionData.id];
  const isAnswered = !!currentResponse;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow-pulse shadow-heritage">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Analyzing Your Responses...
          </h2>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            Our AI is processing your answers to generate personalized skill recommendations 
            aligned with Saudi Vision 2030.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vision-600"></div>
            <span className="text-sm text-neutral-500">This may take a moment...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern">
      {/* Header */}
      <div className="nav-glass px-6 py-4">
        <div className="container-responsive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-vision-gradient rounded-lg flex items-center justify-center shadow-vision">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-vision">SkillVision AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="w-4 h-4 text-vision-500" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="badge-vision">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-vision-mesh">
        <div className="container-responsive">
          <div className="w-full bg-neutral-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-vision-gradient h-3 rounded-full transition-all duration-500 shadow-vision"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-500">
            <span>Getting to know you</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="section-padding px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-elevated p-8 animate-fade-in">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-vision-gradient rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="badge-vision">Saudi Vision 2030 Skills Discovery</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4 leading-tight">
                {currentQuestionData.question}
              </h2>
              <p className="text-neutral-600">
                Choose the option that best describes you or your preferences. This helps us understand 
                your natural inclinations and match you with skills that align with your strengths.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 group ${
                    currentResponse === option
                      ? 'border-vision-500 bg-vision-50 text-vision-800 shadow-vision'
                      : 'border-neutral-200 hover:border-vision-300 hover:bg-vision-50/50'
                  }`}
                >
                  {currentResponse === option ? (
                    <CheckCircle className="w-5 h-5 text-vision-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-400 group-hover:text-vision-400 flex-shrink-0 transition-colors" />
                  )}
                  <span className="flex-1 font-medium">{option}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentQuestion === 0
                    ? 'text-neutral-400 cursor-not-allowed'
                    : 'btn-ghost'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {quizQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentQuestion
                        ? 'bg-vision-600'
                        : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isAnswered
                    ? 'btn-primary animate-glow-pulse'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion === quizQuestions.length - 1 ? (
                  <>
                    <Leaf className="w-4 h-4" />
                    Get My Results
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

          {/* Encouragement Message */}
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-500">
              🌱 Building your future skills profile for Saudi Vision 2030
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
