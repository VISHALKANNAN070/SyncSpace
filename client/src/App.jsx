import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Sidebar from "./components/Sidebar";
import ProjectView from "./components/ProjectView";

const App = () => {
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
    }
  };

  // Fetch user data on login
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/home", //repos path
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
    if (window.location.pathname === "/auth/callback") {
      window.history.replaceState({}, "", "/");
    }
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
        {selectedProject ? (
          <ProjectView darkMode={darkMode} project={selectedProject} />
        ) : (
          <div className="w-full px-6 py-8">
            <Homepage userData={userData} darkMode={darkMode} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
