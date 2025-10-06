import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaSignOutAlt } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { HiOutlineSparkles } from "react-icons/hi2";
import { GoSidebarExpand } from "react-icons/go";
import { FaMoon, FaQuestionCircle, FaGift } from "react-icons/fa";
import axios from "axios";

const Sidebar = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
          withCredentials: true,
        });
        setUsername(res.data.username);
        setAvatar(res.data.avatarURL);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="h-screen w-64 bg-base-200 flex flex-col justify-between border-r border-gray-400 font-sans relative">
      <div className="border-b border-base-300 flex flex-col items-end">
        <GoSidebarExpand className="size-5 mx-4 mt-4" />
        <div className="flex flex-col w-full mt-4">
          <button className=" flex items-center gap-2 py-3 px-3 hover:bg-gray-700 w-[90%] m-auto rounded-lg ">
            <GoPlus className="size-6 " />
            <p>New Project</p>
          </button>
          <button className=" flex items-center gap-2 py-3 px-3 hover:bg-gray-700 w-[90%] m-auto rounded-lg" onClick={() => navigate('/suggestion')}>
            <HiOutlineSparkles className="size-5 " />
            <p> Suggested Projects</p>
          </button>
        </div>
      </div>
      {/* User Menu */}
      <div
        className="p-4 flex items-center gap-3 border-t border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-800 select-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-gray-400 dark:ring-gray-600 flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 dark:bg-gray-700 flex items-center justify-center text-white font-bold">
              {username?.charAt(0) || "U"}
            </div>
          )}
        </div>
        {/* Username */}
        <div className="flex-1">
          <p className="text-md font-medium text-gray-800 dark:text-gray-100 truncate">
            {username || "User"}
          </p>
        </div>
      </div>
      {/* Logout button */}
      {menuOpen && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
          {/* Credits */}
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FaGift className="text-lg flex-shrink-0" />
            <span className="flex-1 text-left">Credits</span>
          </button>

          {/* Help */}
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FaQuestionCircle className="text-lg flex-shrink-0" />
            <span className="flex-1 text-left">Help</span>
          </button>

          {/* Dark Mode Toggle */}
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FaMoon className="text-lg flex-shrink-0" />
            <span className="flex-1 text-left">Dark Mode</span>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
