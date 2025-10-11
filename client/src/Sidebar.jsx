import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { HiOutlineSparkles } from "react-icons/hi2";
import { GoSidebarExpand } from "react-icons/go";
import axios from "axios";

// Import the new components
import ProjectList from "./components/ProjectList";
import UserMenu from "./components/UserMenu";

// A simple spinner for loading states
const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-100 mx-auto my-4"></div>
);

const Sidebar = () => {
  const navigate = useNavigate();

  // State for data
  const [user, setUser] = useState({ username: "", avatarURL: "" });
  const [projects, setProjects] = useState([]);

  // State for UI
  const [loading, setLoading] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(null); // For the project options menu

  // ✨ Optimized Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user and projects in parallel
        const [userResponse, reposResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/repos/selected`, {
            withCredentials: true,
          }),
        ]);

        // Update state with fetched data
        setUser(userResponse.data);
        setProjects(reposResponse.data);
      } catch (error) {
        console.error("Error fetching initial sidebar data:", error);
        navigate("/"); // Navigate away on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [navigate]); // navigate is stable, so this runs once

  // Event Handlers
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      navigate("/"); // Use navigate for a smoother transition
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleEdit = (id) => console.log("Editing project:", id);
  const handleDelete = (id) => console.log("Deleting project:", id);

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-200 flex flex-col border-r border-gray-700 font-sans">
      {/* Top Section */}
      <div className="flex flex-col p-2">
        <GoSidebarExpand className="size-5 self-end m-1 text-gray-400 hover:text-white cursor-pointer" />
        <div className="flex flex-col w-full gap-1 mt-1">
          <button className="flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-gray-800 w-full">
            <GoPlus className="size-4" />
            <p>New Project</p>
          </button>
          <button
            className="flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-gray-800 w-full"
            onClick={() => navigate("/suggestion")}
          >
            <HiOutlineSparkles className="size-4" />
            <p>Suggested Projects</p>
          </button>
        </div>
      </div>

      {/* Conditionally render based on loading state */}
      {loading ? (
        <Spinner />
      ) : (
        <ProjectList
          projects={projects}
          optionsOpen={optionsOpen}
          setOptionsOpen={setOptionsOpen}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {/* Render UserMenu and pass down props */}
      <UserMenu
        username={user.username}
        avatar={user.avatarURL}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Sidebar;
