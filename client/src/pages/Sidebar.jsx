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
  const [selected, setSelected] = useState([]);
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

  useEffect(() => {
    const fetchSelectedRepos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/repos/selected`,
          {
            withCredentials: true,
          }
        );
        setSelected(res.data);
      } catch (err) {
        console.error("Error fetching selected repos:", err);
        navigate("/");
      }
    };
    fetchSelectedRepos();
  }, [selected]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-200 flex flex-col justify-between border-r border-gray-700 font-sans relative">
      {/* Top Section */}
      <div className="flex flex-col p-2">
        <GoSidebarExpand className="size-5 self-end m-1 text-gray-400 hover:text-white cursor-pointer" />

        <div className="flex flex-col w-full gap-1 mt-1">
          <button className="flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-gray-800 w-full transition-colors duration-200">
            <GoPlus className="size-4" />
            <p>New Project</p>
          </button>

          <button
            className="flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-gray-800 w-full transition-colors duration-200"
            onClick={() => navigate("/suggestion")}
          >
            <HiOutlineSparkles className="size-4" />
            <p>Suggested Projects</p>
          </button>
        </div>

        <ul className="w-full mt-4 flex flex-col gap-1 flex-1 overflow-y-auto">
          {selected &&
            selected.map((project, index) => (
              <li
                key={index}
                className="w-full p-2 text-sm rounded-md hover:bg-gray-800 cursor-pointer transition-colors duration-200 truncate"
                title={project.name}
              >
                {project.name}
              </li>
            ))}
        </ul>
      </div>

      {/* Bottom User Menu Section */}
      <div className=" relative" ref={menuRef}>
        <div
          className="p-3 flex items-center gap-3 border-t border-gray-700 cursor-pointer hover:bg-gray-800 select-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-700 flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white font-bold text-xs">
                {username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-100 truncate">
              {username || "User"}
            </p>
          </div>
        </div>

        {/* Menu */}
        {menuOpen && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
            <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700 transition-colors">
              <FaGift className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left">Credits</span>
            </button>

            <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700 transition-colors">
              <FaQuestionCircle className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left">Help</span>
            </button>

            <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700 transition-colors">
              <FaMoon className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left">Dark Mode</span>
            </button>

            <div className="border-t border-gray-700"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-gray-700 transition-colors"
            >
              <FaSignOutAlt className="size-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
