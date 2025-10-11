import { useState } from "react";
import { FaSignOutAlt, FaMoon, FaQuestionCircle, FaGift } from "react-icons/fa";

const UserMenu = ({ username, avatar, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
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
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium text-gray-100 truncate">
            {username || "User"}
          </p>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
          {/* Menu items can be made dynamic later */}
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700">
            <FaGift className="size-4 flex-shrink-0" />
            <span className="flex-1 text-left">Credits</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700">
            <FaQuestionCircle className="size-4 flex-shrink-0" />
            <span className="flex-1 text-left">Help</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700">
            <FaMoon className="size-4 flex-shrink-0" />
            <span className="flex-1 text-left">Dark Mode</span>
          </button>
          <div className="border-t border-gray-700"></div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-gray-700"
          >
            <FaSignOutAlt className="size-4 flex-shrink-0" />
            <span className="flex-1 text-left text-sm">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
