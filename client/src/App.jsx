import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Sidebar from "./components/Sidebar";
import ProjectView from "./components/ProjectView";
import AuthCallback from "./components/AuthCallback";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Core state
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Persistent dark/light mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // OAuth login
  const handleGitHubLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/github";
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.get(import.meta.env.VITE_BACKEND_URL + "/auth/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  // Returns true on success, false on failure
  const fetchData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/user-data",
        { withCredentials: true },
      );
      setUserData(res.data);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Skip fetchData on auth callback — AuthCallback handles it
  useEffect(() => {
    if (location.pathname === "/auth/callback") {
      setLoading(false);
      return;
    }
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const loadingScreen = (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-3 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
      <p
        className={`text-sm tracking-wide ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Loading...
      </p>
    </div>
  );

  if (loading) return loadingScreen;

  // Not logged in: expose auth callback + login
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/auth/callback"
          element={<AuthCallback fetchData={fetchData} darkMode={darkMode} />}
        />
        <Route
          path="*"
          element={
            <Login
              handleGitHubLogin={handleGitHubLogin}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />
      </Routes>
    );
  }

  // Logged in: full app layout
  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <Sidebar
        userData={userData}
        darkMode={darkMode}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onSelectProject={(project) => {
          navigate(`/project/${project.id}`);
        }}
        sidebarToggle={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen transition-all duration-200">
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
      </main>
    </div>
  );
};

export default App;
