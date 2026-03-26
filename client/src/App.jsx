import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Sidebar from "./components/Sidebar";
import ProjectView from "./components/ProjectView";

const App = () => {
  const navigate = useNavigate();
  // Core state
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  //persistant dark/light mode
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

  // Fetch user data on login
  useEffect(() => {
    if (window.location.pathname === "/auth/callback") {
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/user-data", //repos path
          { withCredentials: true },
        );

        setUserData(res.data);
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Login
        handleGitHubLogin={handleGitHubLogin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  const sidebarToggle = () => {
    setSidebarOpen(false);
  };
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
        sidebarToggle={sidebarToggle}
      />

      <main className={`min-h-screen transition-all duration-200`}>
        <Routes>
          <Route
            path="/"
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
