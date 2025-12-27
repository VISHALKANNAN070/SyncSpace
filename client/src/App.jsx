import { useEffect, useState } from "react";
import axios from "axios";
import { X, FolderGit2, Menu } from "lucide-react";

import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Sidebar from "./components/Sidebar";

const App = () => {
  // Core state
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
          import.meta.env.VITE_BACKEND_URL + "/home",
          { withCredentials: true }
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
  

  if (!isLoggedIn) {
    return <Login handleGitHubLogin={handleGitHubLogin} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <Sidebar
        userData={userData}
        darkMode={darkMode}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main
        className={`min-h-screen transition-all duration-200
    ${sidebarOpen ? "ml-64" : "ml-14"}
  `}
      >
        <div className="w-full px-6 py-8">
          <Homepage userData={userData} darkMode={darkMode} />
        </div>
      </main>
    </div>
  );
  
};

export default App;
