import {
  Menu,
  Pencil,
  Search,
  Folder,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";

const Sidebar = ({
  userData,
  darkMode,
  open,
  onToggle,
  onLogout,
  onToggleDarkMode,
}) => {
  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen
        border-r z-30
        transition-[width] duration-200 ease-out
        ${open ? "w-64" : "w-14"}
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
      `}
    >
      <div className="h-full flex flex-col py-2">
        {/* TOP BAR */}
        <div className="flex items-center px-2 shrink-0">
          <button
            onClick={onToggle}
            className={`p-2 rounded ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Menu
              className={`w-5 h-5 ${darkMode ? "text-white" : "text-gray-900"}`}
            />
          </button>

          <div
            className={`
              ml-3 w-36 overflow-hidden
              transition-opacity duration-150
              ${open ? "opacity-100" : "opacity-0"}
            `}
          >
            <span className="text-sm font-medium text-gray-400">Projects</span>
          </div>

          <div
            className={`
              ml-auto mr-1
              transition-opacity duration-150
              ${open ? "opacity-100" : "opacity-0"}
            `}
          >
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav className="mt-3 flex flex-col gap-1 px-2 shrink-0">
          <SidebarItem
            icon={Pencil}
            label="New Project"
            open={open}
            darkMode={darkMode}
          />
          <SidebarItem
            icon={Search}
            label="Search"
            open={open}
            darkMode={darkMode}
          />
          <SidebarItem
            icon={Folder}
            label="Projects"
            open={open}
            darkMode={darkMode}
          />
        </nav>

        {/* PROJECT LIST (RESPONSIVE) */}
        <div className="flex-1 min-h-0 px-2">
          <div
            className={`
              h-full overflow-y-auto scrollbar
              transition-opacity duration-150
              ${open ? "opacity-100" : "opacity-0"}
              ${darkMode ? "scrollbar-dark" : "scrollbar-light"}
            `}
          >
            <div className="text-s uppercase text-gray-500 px-2 mt-5 mb-3">
              Projects
            </div>

            <div className="space-y-1">
              {userData?.repos?.map((repo) => (
                <button
                  key={repo.id}
                  className={`
                    w-full flex items-center px-2 py-2 rounded text-left text-sm
                    ${
                      darkMode
                        ? "text-gray-200 hover:bg-gray-800"
                        : "text-gray-800 hover:bg-gray-100"
                    }
                  `}
                >
                  <Folder
                    className={`w-4 h-4 shrink-0 mr-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span className="truncate">{repo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* USER / LOGOUT */}
        <div className="px-2 pb-2 shrink-0">
          <div
            className={`
    w-full flex items-center rounded
    ${open ? "justify-start" : "justify-center"}
    ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}
  `}
          >
            {/*  Avatar */}
            <div
              className={`bg-white rounded-full size-8 p-2 shrink-0 text-center flex items-center justify-center
              ${open ? "ml-0" : "-mr-4"}
              `}
            >
              {userData?.username?.[0]?.toUpperCase() || <User size={8} />}
            </div>

            {/* Name */}
            <div
              className={`
        ml-3 w-36 overflow-hidden
        transition-opacity duration-150
        ${open ? "opacity-100" : "opacity-0"}
      `}
            >
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {userData?.username || "User"}
              </span>
            </div>

            {/* Spacer pushes logout to right */}
            <div className="flex-1" />

            {/* L — Logout icon */}
            <button
              onClick={onLogout}
              className="p-1 rounded hover:bg-red-500/10"
              aria-label="Logout"
            >
              {open && <LogOut className="w-4 h-4 text-red-500" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon: Icon, label, open, darkMode }) => {
  return (
    <button
      className={`
        flex items-center p-2 rounded
        ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}
      `}
    >
      <Icon
        className={`w-5 h-5 shrink-0 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      />
      <span
        className={`
          ml-3 overflow-hidden whitespace-nowrap text-sm
          ${darkMode ? "text-white" : "text-gray-900"}
          transition-opacity duration-150
          ${open ? "opacity-100" : "opacity-0"}
        `}
      >
        {label}
      </span>
    </button>
  );
};

export default Sidebar;
