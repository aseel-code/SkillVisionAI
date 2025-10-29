import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { 
  Target, Calendar, Lightbulb, Rocket, CheckCircle, 
  ArrowRight, Sparkles, Leaf, Book, Trophy, ChevronRight 
} from 'lucide-react';
import { SkillRecommendationType } from '@/shared/types';

interface DayPlan {
  day: number;
  title: string;
  focus: string;
  tasks: string[];
  resources: string[];
  timeEstimate: string;
}

export default function ProjectGuide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<SkillRecommendationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchRecommendation();
  }, [user, navigate]);

  const fetchRecommendation = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (response.ok) {
        const data = await response.json();
        if (data.recommendations.length > 0) {
          const rec = data.recommendations[0];
          setRecommendation(rec);
          generateDayPlans(rec);
        }
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDayPlans = (rec: SkillRecommendationType) => {
    // Generate a 3-day action plan
    const plans: DayPlan[] = [
      {
        day: 1,
        title: 'Learn & Explore',
        focus: 'Build foundational knowledge and gather resources',
        tasks: [
          'Watch 2-3 introductory videos about ' + rec.skill_name,
          'Read through the free learning resources provided',
          'Set up your development environment or tools',
          'Take notes on key concepts and terminology',
          'Join an online community or forum related to this skill'
        ],
        resources: ['YouTube tutorials', 'Free online courses', 'Community forums'],
        timeEstimate: '2-3 hours'
      },
      {
        day: 2,
        title: 'Hands-On Practice',
        focus: 'Start building and experimenting',
        tasks: [
          'Follow a step-by-step tutorial for beginners',
          'Create a simple version of your mini-project',
          'Experiment with different features and options',
          'Document what works and what challenges you face',
          'Ask questions in online communities if you get stuck'
        ],
        resources: ['Practice exercises', 'Code examples', 'Tutorial guides'],
        timeEstimate: '3-4 hours'
      },
      {
        day: 3,
        title: 'Build & Share',
        focus: 'Complete your first mini-project milestone',
        tasks: [
          'Finish the basic version of your mini-project',
          'Test your work and fix any issues',
          'Add Saudi-inspired elements or local context',
          'Share your project with friends or online community',
          'Reflect on what you learned and plan next steps'
        ],
        resources: ['GitHub for sharing', 'Social media', 'Portfolio platforms'],
        timeEstimate: '3-4 hours'
      }
    ];

    setDayPlans(plans);
  };

  const toggleDayComplete = (day: number) => {
    const newCompleted = new Set(completedDays);
    if (newCompleted.has(day)) {
      newCompleted.delete(day);
    } else {
      newCompleted.add(day);
    }
    setCompletedDays(newCompleted);
  };

  const getPillarIcon = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case 'thriving economy':
        return '💰';
      case 'ambitious nation':
        return '🎯';
      case 'vibrant society':
        return '🌟';
      default:
        return '✨';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow-pulse shadow-heritage">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Preparing Your Project Guide...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vision-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
        <div className="text-center card p-8">
          <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            No project found
          </h2>
          <p className="text-neutral-600 mb-6">
            Please complete the quiz first to get your personalized mini-project.
          </p>
          <button onClick={() => navigate('/quiz')} className="btn-primary">
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  // Parse project details
  const projectLines = recommendation.projects.split('\n').filter(line => line.trim());
  const projectTitle = projectLines.find(line => line.includes('MINI-PROJECT:'))?.replace('MINI-PROJECT:', '').trim() || 'Your Mini-Project';
  const projectDescription = projectLines.slice(2, projectLines.findIndex(line => line.includes('Estimated Time:'))).join(' ').trim();
  const estimatedTime = projectLines.find(line => line.includes('Estimated Time:'))?.replace('Estimated Time:', '').trim() || '2-3 weeks';
  const difficulty = projectLines.find(line => line.includes('Difficulty Level:'))?.replace('Difficulty Level:', '').trim() || 'Beginner';

  const progress = Math.round((completedDays.size / dayPlans.length) * 100);

  return (
    <div className="min-h-screen bg-hero-pattern">
      {/* Header */}
      <div className="nav-glass px-6 py-4">
        <div className="container-responsive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://mocha-cdn.com/019a2a57-8dd4-7b8a-ae52-defd48a7208c/public-logo-icon.png" 
              alt="SkillVision AI" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-display font-bold text-gradient-vision">SkillVision AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/results')} className="btn-ghost">
              Back to Results
            </button>
            <button onClick={() => navigate('/learning')} className="btn-primary">
              Learning Plan
            </button>
          </div>
        </div>
      </div>

      <div className="section-padding px-6">
        <div className="container-responsive max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-vision-gradient rounded-xl flex items-center justify-center shadow-heritage animate-glow-pulse">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="badge-vision">Your 3-Day Action Plan</span>
            </div>
            <h1 className="text-hero mb-4">
              Start Your Journey:
              <span className="text-gradient-vision block mt-2">{projectTitle}</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {projectDescription}
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-vision-600" />
                <span className="text-neutral-700">{estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-desert-600" />
                <span className="text-neutral-700">{difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getPillarIcon(recommendation.vision_2030_pillar)}</span>
                <span className="text-neutral-700">{recommendation.vision_2030_pillar}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="card p-6 mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-desert-500" />
                Your Progress
              </h3>
              <span className="text-2xl font-bold text-vision-600">{progress}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-vision-gradient transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              {completedDays.size} of {dayPlans.length} days completed
            </p>
          </div>

          {/* Introduction */}
          <div className="card-elevated p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-desert-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-desert-600" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                  What You'll Build
                </h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  This mini-project will help you start learning <strong>{recommendation.skill_name}</strong>. 
                  By the end of these 3 days, you'll have hands-on experience and a real project to showcase.
                </p>
                <div className="bg-vision-50 rounded-xl p-4 border border-vision-100">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    <strong className="text-vision-700">Why this matters:</strong> {recommendation.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Day Plan */}
          <div className="space-y-6 mb-8">
            {dayPlans.map((day, index) => (
              <div 
                key={day.day}
                className="card-elevated p-8 animate-slide-up"
                style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      completedDays.has(day.day) 
                        ? 'bg-vision-gradient shadow-vision' 
                        : 'bg-neutral-200'
                    }`}>
                      {completedDays.has(day.day) ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <span className="text-2xl font-bold text-neutral-700">Day {day.day}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                        {day.title}
                      </h3>
                      <p className="text-neutral-600 mb-4">{day.focus}</p>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Calendar className="w-4 h-4" />
                        <span>{day.timeEstimate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDayComplete(day.day)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      completedDays.has(day.day)
                        ? 'bg-vision-100 text-vision-700 hover:bg-vision-200'
                        : 'btn-primary'
                    }`}
                  >
                    {completedDays.has(day.day) ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Tasks */}
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-vision-600" />
                      Tasks for Day {day.day}
                    </h4>
                    <div className="space-y-2">
                      {day.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                          <ChevronRight className="w-5 h-5 text-vision-600 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <Book className="w-5 h-5 text-heritage-blue" />
                      Helpful Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {day.resources.map((resource, resIndex) => (
                        <span key={resIndex} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Motivational Section */}
          <div className="card-elevated p-8 mb-8 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-16 bg-desert-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-heritage">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4">
              You've Got This! 🚀
            </h3>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto mb-6">
              Every expert was once a beginner. Starting this project is the first step toward mastering <strong>{recommendation.skill_name}</strong>. 
              Take it one day at a time, ask for help when needed, and celebrate small wins along the way.
            </p>
            <div className="bg-vision-50 rounded-xl p-6 border border-vision-100 max-w-2xl mx-auto">
              <p className="text-neutral-700 leading-relaxed">
                <strong className="text-vision-700">Pro Tip:</strong> Don't aim for perfection on your first try. 
                Focus on learning, experimenting, and having fun. Your first project doesn't need to be perfect—it just needs to exist!
              </p>
            </div>
          </div>

          {/* Vision 2030 Connection */}
          <div className="card-elevated p-6 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-6 h-6 text-vision-600" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Supporting {recommendation.vision_2030_pillar}
              </h3>
            </div>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              By learning {recommendation.skill_name}, you're contributing to Saudi Arabia's Vision 2030 transformation. 
              This skill is in high demand across the Kingdom's growing sectors and will help you build a successful career 
              aligned with Saudi Arabia's ambitious future.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <button
              onClick={() => navigate('/learning')}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Book className="w-5 h-5" />
              View Full Learning Resources
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Explore More Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
