import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Brain, Star, Target, BookOpen, Lightbulb, ArrowRight, TrendingUp, Users, Leaf, Zap, Rocket } from 'lucide-react';
import { SkillRecommendationType } from '@/shared/types';

export default function Results() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<SkillRecommendationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillRecommendationType | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchRecommendations();
  }, [user, navigate]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        if (data.recommendations.length > 0) {
          setSelectedSkill(data.recommendations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPillarIcon = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case 'thriving economy':
        return <TrendingUp className="w-5 h-5" />;
      case 'ambitious nation':
        return <Target className="w-5 h-5" />;
      case 'vibrant society':
        return <Users className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getPillarColor = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case 'thriving economy':
        return 'bg-vision-gradient';
      case 'ambitious nation':
        return 'bg-heritage-blue';
      case 'vibrant society':
        return 'bg-desert-gradient';
      default:
        return 'bg-neutral-500';
    }
  };

  const getPillarBadgeColor = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case 'thriving economy':
        return 'badge-vision';
      case 'ambitious nation':
        return 'bg-blue-100 text-blue-800';
      case 'vibrant society':
        return 'badge-desert';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.7) return 'Great Match';
    if (score >= 0.6) return 'Good Match';
    return 'Potential Match';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-vision-700 bg-vision-100';
    if (score >= 0.7) return 'text-heritage-blue bg-blue-100';
    if (score >= 0.6) return 'text-desert-600 bg-desert-100';
    return 'text-neutral-600 bg-neutral-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow-pulse shadow-heritage">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Preparing Your Future Skills Profile...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vision-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
        <div className="text-center card p-8">
          <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            No recommendations found
          </h2>
          <p className="text-neutral-600 mb-6">
            Please take the quiz first to get your personalized skill recommendations 
            aligned with Saudi Vision 2030.
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-primary"
          >
            Take Discovery Quiz
          </button>
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
            <img 
              src="https://mocha-cdn.com/019a2a57-8dd4-7b8a-ae52-defd48a7208c/public-logo-icon.png" 
              alt="SkillVision AI" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-display font-bold text-gradient-vision">SkillVision AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="btn-ghost"
            >
              Explore Projects
            </button>
            <button
              onClick={() => navigate('/learning')}
              className="btn-primary"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>

      <div className="section-padding px-6">
        <div className="container-responsive">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-vision-gradient rounded-xl flex items-center justify-center shadow-heritage">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="badge-vision">Saudi Vision 2030 Aligned</span>
            </div>
            <h1 className="text-hero mb-4">
              Your Future Skill 
              <span className="text-gradient-vision"> Recommendations</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Based on your responses, we've identified skills that perfectly match your interests 
              and align with Saudi Vision 2030's sustainable transformation goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Skills List */}
            <div className="lg:col-span-1 animate-slide-up">
              <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">Your Future Skills</h2>
              <div className="space-y-3">
                {recommendations.map((skill, index) => (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`card w-full p-4 text-left transition-all hover:shadow-vision ${
                      selectedSkill?.id === skill.id
                        ? 'border-vision-500 shadow-vision ring-2 ring-vision-200'
                        : 'hover:border-vision-300'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-neutral-900 leading-tight">{skill.skill_name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(skill.confidence_score)}`}>
                        {Math.round(skill.confidence_score * 100)}%
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{skill.skill_category}</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 ${getPillarColor(skill.vision_2030_pillar)} rounded-lg flex items-center justify-center shadow-sm`}>
                        {getPillarIcon(skill.vision_2030_pillar)}
                      </div>
                      <span className="text-xs text-neutral-500">{skill.vision_2030_pillar}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Quick Stats */}
              <div className="card p-4 mt-6">
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-vision-500" />
                  Your Profile
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Skills Matched:</span>
                    <span className="font-medium text-neutral-900">{recommendations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Avg. Confidence:</span>
                    <span className="font-medium text-vision-600">
                      {Math.round(recommendations.reduce((acc, r) => acc + r.confidence_score, 0) / recommendations.length * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Vision 2030 Alignment:</span>
                    <span className="font-medium text-vision-600">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Details */}
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {selectedSkill && (
                <div className="card-elevated p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
                        {selectedSkill.skill_name}
                      </h2>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPillarBadgeColor(selectedSkill.vision_2030_pillar)}`}>
                          {selectedSkill.skill_category}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 ${getPillarColor(selectedSkill.vision_2030_pillar)} rounded-lg flex items-center justify-center shadow-sm`}>
                            {getPillarIcon(selectedSkill.vision_2030_pillar)}
                          </div>
                          <span className="text-sm text-neutral-600">{selectedSkill.vision_2030_pillar}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-medium ${getConfidenceColor(selectedSkill.confidence_score)}`}>
                      {getConfidenceLevel(selectedSkill.confidence_score)}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-desert-500" />
                        Why This Skill Matches You
                      </h3>
                      <div className="bg-desert-50 rounded-xl p-4 border border-desert-100">
                        <p className="text-neutral-700 leading-relaxed">
                          {selectedSkill.description}
                        </p>
                      </div>
                    </div>

                    {/* Learning Path */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-heritage-blue" />
                        Your Learning Journey
                      </h3>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                          {selectedSkill.learning_path}
                        </p>
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-vision-600" />
                        Real-World Projects
                      </h3>
                      <div className="bg-vision-50 rounded-xl p-4 border border-vision-100">
                        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                          {selectedSkill.projects}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
                      <button
                        onClick={() => navigate('/project-guide')}
                        className="btn-primary flex-1"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Start 3-Day Project Guide
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                      <button
                        onClick={() => navigate('/learning')}
                        className="btn-secondary flex-1"
                      >
                        <BookOpen className="w-5 h-5 mr-2" />
                        View Learning Resources
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vision 2030 Connection */}
          <div className="card-elevated p-6 mt-12 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-6 h-6 text-vision-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Aligned with Saudi Vision 2030</h3>
            </div>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Your recommended skills directly contribute to the Kingdom's sustainable transformation goals, 
              ensuring your career growth aligns with Saudi Arabia's ambitious future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
