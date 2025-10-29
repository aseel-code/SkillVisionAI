import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Brain, Target, Clock, Sparkles, ExternalLink, CheckCircle, Play } from 'lucide-react';
import { SkillRecommendationType } from '@/shared/types';

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  skills: string[];
  vision2030Sector: string;
  tools: string[];
  outcomes: string[];
  steps: string[];
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Smart Home Energy Monitor',
    description: 'Build a device that tracks home energy consumption and suggests ways to reduce it, contributing to Saudi Green Initiative goals.',
    difficulty: 'Intermediate',
    estimatedTime: '2-3 weeks',
    skills: ['IoT Development', 'Data Analysis', 'Mobile App Development'],
    vision2030Sector: 'Renewable Energy',
    tools: ['Arduino', 'React Native', 'Firebase'],
    outcomes: [
      'Functional energy monitoring device',
      'Mobile app for data visualization',
      'Energy saving recommendations system'
    ],
    steps: [
      'Research energy monitoring sensors and components',
      'Design the circuit and assemble hardware',
      'Program the Arduino to collect energy data',
      'Create a mobile app to display real-time data',
      'Implement AI-powered energy saving suggestions',
      'Test and optimize the system'
    ]
  },
  {
    id: '2',
    title: 'Arabic Language AI Chatbot',
    description: 'Develop an AI chatbot that can answer questions about Saudi culture and history in Arabic, supporting digital transformation.',
    difficulty: 'Advanced',
    estimatedTime: '4-6 weeks',
    skills: ['Natural Language Processing', 'Machine Learning', 'Arabic Language Processing'],
    vision2030Sector: 'Technology & AI',
    tools: ['Python', 'OpenAI API', 'Flask', 'React'],
    outcomes: [
      'Arabic language understanding AI model',
      'Web interface for chatbot interaction',
      'Knowledge base about Saudi culture'
    ],
    steps: [
      'Collect and prepare Arabic text datasets',
      'Fine-tune language model for Arabic',
      'Build knowledge base about Saudi culture',
      'Develop chatbot backend with NLP processing',
      'Create user-friendly web interface',
      'Test with native Arabic speakers'
    ]
  },
  {
    id: '3',
    title: 'Virtual Saudi Heritage Tour',
    description: 'Create an immersive VR experience showcasing Saudi historical sites, promoting tourism and cultural preservation.',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 weeks',
    skills: ['3D Modeling', 'Virtual Reality', 'Game Development'],
    vision2030Sector: 'Tourism & Culture',
    tools: ['Unity', 'Blender', 'Oculus SDK'],
    outcomes: [
      '3D models of historical sites',
      'Interactive VR experience',
      'Educational content about Saudi heritage'
    ],
    steps: [
      'Research Saudi historical sites and gather references',
      'Create 3D models of key architectural elements',
      'Design VR interaction mechanics',
      'Implement virtual tour navigation',
      'Add educational content and narration',
      'Test VR experience and optimize performance'
    ]
  },
  {
    id: '4',
    title: 'Sustainable Agriculture Dashboard',
    description: 'Build a data visualization platform for monitoring crop health and water usage in Saudi farms.',
    difficulty: 'Beginner',
    estimatedTime: '2-3 weeks',
    skills: ['Data Visualization', 'Web Development', 'Sustainability'],
    vision2030Sector: 'Agriculture & Environment',
    tools: ['React', 'Chart.js', 'Node.js'],
    outcomes: [
      'Interactive dashboard for farm data',
      'Water usage optimization recommendations',
      'Crop health monitoring system'
    ],
    steps: [
      'Research agricultural data sources and APIs',
      'Design dashboard layout and user interface',
      'Implement data visualization charts',
      'Add water usage tracking features',
      'Create sustainability recommendations engine',
      'Test with sample farm data'
    ]
  }
];

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<SkillRecommendationType[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
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
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredProjects = filter === 'all' 
    ? sampleProjects 
    : sampleProjects.filter(p => p.difficulty.toLowerCase() === filter);

  const matchedSkills = (project: Project) => {
    return project.skills.filter(skill => 
      recommendations.some(rec => 
        rec.skill_name.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(rec.skill_name.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
              onClick={() => navigate('/learning')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700"
            >
              Learning Plan
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hands-On Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apply your skills with real-world projects that contribute to Saudi Vision 2030 goals.
              Each project is designed to build practical experience while making a positive impact.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level as any)}
                className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                  filter === level
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/60 text-gray-700 hover:bg-white'
                }`}
              >
                {level === 'all' ? 'All Projects' : level}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects List */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const matched = matchedSkills(project);
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        selectedProject?.id === project.id
                          ? 'border-purple-500 bg-white shadow-lg'
                          : 'border-gray-200 bg-white/60 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
                        {matched.length > 0 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{project.estimatedTime}</span>
                      </div>
                      {matched.length > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Matches your skills</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Details */}
            <div className="lg:col-span-2">
              {selectedProject ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedProject.title}
                      </h2>
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedProject.difficulty)}`}>
                          {selectedProject.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{selectedProject.estimatedTime}</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {selectedProject.vision2030Sector}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Skills & Tools */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills You'll Practice</h3>
                        <div className="space-y-2">
                          {selectedProject.skills.map((skill, index) => {
                            const isMatched = matchedSkills(selectedProject).includes(skill);
                            return (
                              <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                isMatched ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                              }`}>
                                {isMatched && <CheckCircle className="w-4 h-4" />}
                                <span className="text-sm">{skill}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tools & Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tools.map((tool, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expected Outcomes */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        What You'll Build
                      </h3>
                      <div className="bg-green-50 rounded-xl p-4">
                        <ul className="space-y-2">
                          {selectedProject.outcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Project Steps */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Step-by-Step Guide</h3>
                      <div className="space-y-3">
                        {selectedProject.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
                        <Play className="w-5 h-5" />
                        Start This Project
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                        <ExternalLink className="w-5 h-5" />
                        View Resources
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Project</h3>
                  <p className="text-gray-600">
                    Choose a project from the list to see detailed information and get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
