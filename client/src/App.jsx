import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Sidebar from "./components/Sidebar";
import ProjectView from "./components/ProjectView";

// Interceptor to add authorization token if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const navigate = useNavigate();
  // Core state
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //persistant dark/light mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  //Selected Project
  const [selectedProject, setSelectedProject] = useState(null);

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
      localStorage.removeItem("token");
    }
  };

  // Fetch user data on login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
    }
    
    if (window.location.pathname === "/auth/callback") {
      navigate("/",{replace : true})
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
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
        onSelectProject={setSelectedProject}
        sidebarToggle={sidebarToggle}
      />

      <main className={`min-h-screen transition-all duration-200`}>
        <Routes>
          <Route
            path="/"
            element={
              selectedProject ? (
                <ProjectView darkMode={darkMode} project={selectedProject} />
              ) : (
                <Homepage userData={userData} darkMode={darkMode} />
              )
            }
          />

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
