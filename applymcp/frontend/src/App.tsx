import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProfileEditPage from './pages/ProfileEditPage';
import WorkExperiencesPage from './pages/WorkExperiencesPage';
import EducationsPage from './pages/EducationsPage';
import ProjectsPage from './pages/ProjectsPage';
import { useState } from 'react';

// Main layout component
function MainLayout() {
  const profileId = '6a285a87006716e3ea543875'; // You can make this dynamic
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/" className="hover:text-blue-600">ApplyMCP</a>
          </h1>
          <div className="flex gap-4">
            <a href="/" className="px-4 py-2 hover:bg-gray-100 rounded transition">Dashboard</a>
            <a href="/profile" className="px-4 py-2 hover:bg-gray-100 rounded transition">Profil</a>
            <a href="/experiences" className="px-4 py-2 hover:bg-gray-100 rounded transition">Expériences</a>
            <a href="/educations" className="px-4 py-2 hover:bg-gray-100 rounded transition">Diplômes</a>
            <a href="/projects" className="px-4 py-2 hover:bg-gray-100 rounded transition">Projets</a>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes key={refreshKey}>
        <Route path="/" element={<DashboardPage profileId={profileId} />} />
        <Route
          path="/profile"
          element={<ProfileEditPage profileId={profileId} onProfileUpdate={handleRefresh} />}
        />
        <Route
          path="/experiences"
          element={<WorkExperiencesPage profileId={profileId} onExperienceUpdate={handleRefresh} />}
        />
        <Route
          path="/educations"
          element={<EducationsPage profileId={profileId} onEducationUpdate={handleRefresh} />}
        />
        <Route
          path="/projects"
          element={<ProjectsPage profileId={profileId} onProjectUpdate={handleRefresh} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App
