import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Brain, BookOpen, CheckCircle, Play, Trophy, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import { SkillRecommendationType } from '@/shared/types';

interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'article' | 'video' | 'book' | 'tutorial';
  provider: string;
  duration: string;
  difficulty: string;
  free: boolean;
  url: string;
  description: string;
}

interface LearningPath {
  skillId: number;
  skillName: string;
  totalHours: number;
  completedHours: number;
  modules: {
    id: string;
    title: string;
    description: string;
    estimatedHours: number;
    completed: boolean;
    resources: LearningResource[];
  }[];
}

const generateLearningPath = (skill: SkillRecommendationType): LearningPath => {
  const sampleResources: Record<string, LearningResource[]> = {
    'AI & Machine Learning': [
      {
        id: '1',
        title: 'Machine Learning Crash Course',
        type: 'course',
        provider: 'Google AI',
        duration: '15 hours',
        difficulty: 'Beginner',
        free: true,
        url: 'https://developers.google.com/machine-learning/crash-course',
        description: 'A self-study guide for aspiring machine learning practitioners'
      },
      {
        id: '2',
        title: 'Introduction to TensorFlow',
        type: 'tutorial',
        provider: 'TensorFlow',
        duration: '8 hours',
        difficulty: 'Intermediate',
        free: true,
        url: 'https://www.tensorflow.org/tutorials',
        description: 'Official TensorFlow tutorials for beginners'
      }
    ],
    'Data Science': [
      {
        id: '3',
        title: 'Python for Data Science',
        type: 'course',
        provider: 'Coursera',
        duration: '20 hours',
        difficulty: 'Beginner',
        free: false,
        url: 'https://coursera.org',
        description: 'Complete Python programming for data analysis'
      }
    ],
    'default': [
      {
        id: '4',
        title: 'Fundamentals Course',
        type: 'course',
        provider: 'edX',
        duration: '12 hours',
        difficulty: 'Beginner',
        free: true,
        url: 'https://edx.org',
        description: 'Introduction to the field fundamentals'
      }
    ]
  };

  const resources = sampleResources[skill.skill_name] || sampleResources['default'];

  return {
    skillId: skill.id,
    skillName: skill.skill_name,
    totalHours: 40,
    completedHours: 0,
    modules: [
      {
        id: 'fundamentals',
        title: 'Fundamentals',
        description: 'Learn the basic concepts and terminology',
        estimatedHours: 12,
        completed: false,
        resources: resources.slice(0, 1)
      },
      {
        id: 'practical',
        title: 'Practical Application',
        description: 'Hands-on exercises and real-world examples',
        estimatedHours: 16,
        completed: false,
        resources: resources.slice(1, 2)
      },
      {
        id: 'advanced',
        title: 'Advanced Concepts',
        description: 'Deep dive into advanced topics and techniques',
        estimatedHours: 12,
        completed: false,
        resources: resources
      }
    ]
  };
};

export default function Learning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setRecommendations] = useState<SkillRecommendationType[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        // Generate learning paths for each skill
        const paths = data.recommendations.map(generateLearningPath);
        setLearningPaths(paths);
        
        if (paths.length > 0) {
          setSelectedPath(paths[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (skillId: number, progress: number) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill_id: skillId,
          progress_percentage: progress,
          completed_projects: '',
          notes: 'Learning progress updated'
        }),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleModuleCompletion = (moduleId: string) => {
    if (!selectedPath) return;

    const updatedPath = {
      ...selectedPath,
      modules: selectedPath.modules.map(module => {
        if (module.id === moduleId) {
          const completed = !module.completed;
          return { ...module, completed };
        }
        return module;
      })
    };

    const completedHours = updatedPath.modules
      .filter(m => m.completed)
      .reduce((sum, m) => sum + m.estimatedHours, 0);
    
    updatedPath.completedHours = completedHours;
    
    setSelectedPath(updatedPath);
    setLearningPaths(paths => 
      paths.map(path => path.skillId === selectedPath.skillId ? updatedPath : path)
    );

    // Update progress in backend
    const progressPercentage = (completedHours / updatedPath.totalHours) * 100;
    updateProgress(selectedPath.skillId, progressPercentage);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'article': return <BookOpen className="w-4 h-4" />;
      case 'tutorial': return <Play className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (learningPaths.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No learning paths available
          </h2>
          <p className="text-gray-600 mb-6">
            Please take the quiz first to get personalized learning recommendations.
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillVision AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/results')}
              className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              My Skills
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700"
            >
              Explore Projects
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow personalized learning paths designed to build your future-ready skills 
              with curated resources and hands-on practice.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Learning Paths */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Paths</h2>
              <div className="space-y-4">
                {learningPaths.map((path) => {
                  const progressPercentage = (path.completedHours / path.totalHours) * 100;
                  return (
                    <button
                      key={path.skillId}
                      onClick={() => setSelectedPath(path)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        selectedPath?.skillId === path.skillId
                          ? 'border-purple-500 bg-white shadow-lg'
                          : 'border-gray-200 bg-white/60 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{path.skillName}</h3>
                        {progressPercentage > 0 && (
                          <Trophy className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{path.completedHours}/{path.totalHours} hours</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Learning Path Details */}
            <div className="lg:col-span-2">
              {selectedPath && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedPath.skillName}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{selectedPath.totalHours} hours total</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">
                            {Math.round((selectedPath.completedHours / selectedPath.totalHours) * 100)}% complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h3>
                    <div className="w-full bg-white rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(selectedPath.completedHours / selectedPath.totalHours) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{selectedPath.completedHours} hours completed</span>
                      <span>{selectedPath.totalHours - selectedPath.completedHours} hours remaining</span>
                    </div>
                  </div>

                  {/* Learning Modules */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Learning Modules</h3>
                    
                    {selectedPath.modules.map((module, index) => (
                      <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleModuleCompletion(module.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  module.completed
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {module.completed && <CheckCircle className="w-4 h-4" />}
                              </button>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                  Module {index + 1}: {module.title}
                                </h4>
                                <p className="text-gray-600 mb-2">{module.description}</p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{module.estimatedHours} hours</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Module Resources */}
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Learning Resources</h5>
                            {module.resources.map((resource) => (
                              <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    {getTypeIcon(resource.type)}
                                  </div>
                                  <div>
                                    <h6 className="font-medium text-gray-900 text-sm">{resource.title}</h6>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>{resource.provider}</span>
                                      <span>{resource.duration}</span>
                                      <span className={`px-2 py-1 rounded ${resource.free ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {resource.free ? 'Free' : 'Paid'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => window.open(resource.url, '_blank')}
                                  className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Access
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
