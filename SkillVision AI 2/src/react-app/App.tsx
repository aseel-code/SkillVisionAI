import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import OnboardingPage from "@/react-app/pages/Onboarding";
import QuizPage from "@/react-app/pages/Quiz";
import ResultsPage from "@/react-app/pages/Results";
import ProjectsPage from "@/react-app/pages/Projects";
import LearningPage from "@/react-app/pages/Learning";
import ProjectGuidePage from "@/react-app/pages/ProjectGuide";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project-guide" element={<ProjectGuidePage />} />
          <Route path="/learning" element={<LearningPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
