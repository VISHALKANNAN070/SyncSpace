import { useEffect, useState, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { fetchHome, logout, getGitHubLoginUrl } from "./api/auth";
import { getThemeClasses } from "./theme";
import Sidebar from "./components/Sidebar";
import Login from "./features/auth/Login";
import Homepage from "./features/projects/Homepage";
import ProjectView from "./features/projects/ProjectView";
import AuthCallback from "./features/auth/AuthCallback";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleGitHubLogin = () => {
    window.location.href = getGitHubLoginUrl();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUserData(null);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchHome();
      setUserData(data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname === "/api/auth/callback") {
      setLoading(false);
      return;
    }
    fetchData();
  }, [fetchData, location.pathname]);

  if (loading) {
    const t = getThemeClasses(darkMode);
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-3 ${t.bg}`}
      >
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        <p className={`text-sm tracking-wide ${t.mutedCls}`}>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <Routes>
        <Route
          path="/api/auth/callback"
          element={<AuthCallback fetchData={fetchData} darkMode={darkMode} />}
        />
        <Route
          path="*"
          element={
            <Login
              handleGitHubLogin={handleGitHubLogin}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
    );
  }

  const { bg } = getThemeClasses(darkMode);

  return (
    <div className={`min-h-screen ${bg}`}>
      <Sidebar
        userData={userData}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        onSelectProject={(project) => {
          navigate(`/project/${project.id}`);
        }}
        sidebarToggle={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen transition-all duration-200">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={
                <Homepage
                  userData={userData}
                  darkMode={darkMode}
                  onSelectProject={(project) => {
                    navigate(`/project/${project.id}`);
                  }}
                />
              }
            />
            <Route
              path="/project/:id"
              element={<ProjectView userData={userData} darkMode={darkMode} />}
            />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
