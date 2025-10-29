import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Brain, Target, Rocket, Users, Globe, Lightbulb, Leaf, Star, Zap } from 'lucide-react';

export default function Home() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Arabic and modern fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/onboarding');
    } else {
      redirectToLogin();
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-hero-pattern">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vision-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern">
      {/* Navigation */}
      <nav className="nav-glass px-6 py-4">
        <div className="container-responsive flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vision-gradient rounded-xl flex items-center justify-center shadow-vision">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient-vision">
              SkillVision AI
            </span>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <img 
                src={user.google_user_data.picture || ''} 
                alt="Profile"
                className="w-8 h-8 rounded-full ring-2 ring-vision-200"
              />
              <span className="text-neutral-700 font-medium">
                {user.google_user_data.given_name}
              </span>
            </div>
          ) : (
            <button
              onClick={redirectToLogin}
              className="btn-primary"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="badge-vision mb-8">
            <Target className="w-4 h-4 mr-2" />
            Aligned with Saudi Vision 2030
          </div>
          
          <h1 className="text-hero mb-6 leading-tight">
            Discover your 
            <span className="text-gradient-vision"> future skill</span>
            <br />
            before the future arrives
          </h1>
          
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered platform helping Saudi students discover future-ready skills that match their interests 
            and align with Vision 2030 job sectors for a thriving, sustainable Kingdom.
          </p>
          
          <button
            onClick={handleGetStarted}
            className="btn-primary text-lg px-8 py-4 animate-glow-pulse"
          >
            <Rocket className="w-5 h-5 mr-3" />
            Start Your Journey
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-vision-500" />
              <span>Sustainable Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-desert-500" />
              <span>Saudi Heritage</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-heritage-blue" />
              <span>Future Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding px-6 bg-vision-mesh">
        <div className="container-responsive">
          <h2 className="text-display text-center mb-16 animate-slide-up">
            How SkillVision AI Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-vision-gradient rounded-xl flex items-center justify-center mb-6 shadow-vision">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">AI-Powered Discovery</h3>
              <p className="text-neutral-600 leading-relaxed">
                Take our intelligent quiz that analyzes your interests, aptitudes, and goals to identify 
                the perfect future-ready skills aligned with Saudi Vision 2030.
              </p>
            </div>

            <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-heritage-blue rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Vision 2030 Aligned</h3>
              <p className="text-neutral-600 leading-relaxed">
                Every recommendation is strategically aligned with Saudi Vision 2030 sectors including 
                renewable energy, technology, healthcare, tourism, and sustainable development.
              </p>
            </div>

            <div className="card-elevated p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-desert-gradient rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Practical Projects</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get hands-on with real-world mini-projects and curated learning resources 
                to build your skills step by step, contributing to the Kingdom's growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2030 Pillars Section */}
      <section className="section-padding px-6">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-display mb-6">
              Aligned with Saudi Vision 2030
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our recommendations are strategically aligned with the three pillars of Saudi Vision 2030, 
              ensuring your skills contribute to the Kingdom's ambitious transformation towards sustainability and prosperity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-vision-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-heritage group-hover:shadow-glow transition-all duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Thriving Economy</h3>
              <p className="text-neutral-600 leading-relaxed">
                Skills in renewable energy, technology, sustainable finance, and green innovation that drive economic 
                diversification and environmental stewardship for long-term prosperity.
              </p>
              <div className="flex justify-center mt-4">
                <span className="badge-vision">Economic Diversification</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-heritage-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Ambitious Nation</h3>
              <p className="text-neutral-600 leading-relaxed">
                Leadership, entrepreneurship, and public service skills that enhance government 
                effectiveness, citizen services, and drive the Kingdom's digital transformation.
              </p>
              <div className="flex justify-center mt-4">
                <span className="badge-desert">Digital Leadership</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-desert-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Vibrant Society</h3>
              <p className="text-neutral-600 leading-relaxed">
                Skills in arts, culture, sports, sustainable tourism, and entertainment that enhance quality 
                of life, preserve Saudi heritage, and promote cultural expression.
              </p>
              <div className="flex justify-center mt-4">
                <span className="badge-vision">Cultural Heritage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Green Theme Connection Section */}
      <section className="section-padding px-6 bg-gradient-to-r from-vision-50 to-vision-100">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-vision-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-heritage">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-display mb-6">
              Why Green Represents Our Vision
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Our green theme symbolizes <strong className="text-vision-700">sustainable growth</strong>, 
              <strong className="text-vision-700"> environmental stewardship</strong>, and the 
              <strong className="text-vision-700"> flourishing future</strong> that Saudi Vision 2030 envisions. 
              Just as the Kingdom transforms its landscape with green initiatives like NEOM and the Saudi Green Initiative, 
              SkillVision AI helps you grow skills that will flourish in this sustainable future.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-vision-600 mb-2">🌱</div>
                <h4 className="font-semibold text-neutral-900 mb-2">Growth & Prosperity</h4>
                <p className="text-sm text-neutral-600">Representing the Kingdom's commitment to sustainable development</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vision-600 mb-2">🌍</div>
                <h4 className="font-semibold text-neutral-900 mb-2">Environmental Leadership</h4>
                <p className="text-sm text-neutral-600">Aligning with Saudi Arabia's green transformation initiatives</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-vision-600 mb-2">🚀</div>
                <h4 className="font-semibold text-neutral-900 mb-2">Future Innovation</h4>
                <p className="text-sm text-neutral-600">Building skills for tomorrow's sustainable economy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-neutral-900 text-white">
        <div className="container-responsive text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-vision-gradient rounded-lg flex items-center justify-center shadow-vision">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">SkillVision AI</span>
          </div>
          <p className="text-neutral-400 mb-4">
            Discover your future skill — before the future arrives.
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Aligned with Saudi Vision 2030 • Built for Saudi Students • Powered by Sustainable Innovation
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-vision-400" />
              Sustainable Future
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-desert-400" />
              Saudi Heritage
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-heritage-blue" />
              AI-Powered
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
