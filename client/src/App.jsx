import { useTheme } from './hooks/useTheme';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSectionPage from './pages/admin/AdminSectionPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminAskSessionsPage from './pages/admin/AdminAskSessionsPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminTimelinePage from './pages/admin/AdminTimelinePage';
import AdminNotebookPage from './pages/admin/AdminNotebookPage';
import AdminSystemDesignPage from './pages/admin/AdminSystemDesignPage';
import AdminAchievementsPage from './pages/admin/AdminAchievementsPage';
import AdminCodingProfilesPage from './pages/admin/AdminCodingProfilesPage';
import AdminGithubPage from './pages/admin/AdminGithubPage';
import { Routes, Route, Navigate } from 'react-router-dom';

function AppShell() {
  useTheme();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="sections/new" element={<AdminSectionPage />} />
        <Route path="sections/:slug" element={<AdminSectionPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="timeline" element={<AdminTimelinePage />} />
        <Route path="notebook" element={<AdminNotebookPage />} />
        <Route path="system-design" element={<AdminSystemDesignPage />} />
        <Route path="achievements" element={<AdminAchievementsPage />} />
        <Route path="coding-profiles" element={<AdminCodingProfilesPage />} />
        <Route path="github" element={<AdminGithubPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="ask-sessions" element={<AdminAskSessionsPage />} />
      </Route>

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppShell />;
}
