import { useNavigate, useParams } from "react-router-dom";
import { Menu, Folder, Sun, Moon, LogOut, User } from "lucide-react";
import { getThemeClasses } from "../theme";
import { saveRepo } from "../api/projects";

const Sidebar = ({
  userData,
  darkMode,
  toggleDarkMode,
  open,
  onToggle,
  onLogout,
  onSelectProject,
  sidebarToggle,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bg, hoverBg, iconCls, textCls, mutedCls } =
    getThemeClasses(darkMode);
  const sbBorder = darkMode ? "border-gray-800" : "border-gray-200";

  const handleRepoClick = async (repo) => {
    onSelectProject(repo);
    try {
      await saveRepo(repo);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-40 p-1.5 rounded"
        aria-label="Toggle sidebar"
      >
        <Menu className={`w-5 h-5 ${iconCls}`} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50"
          onClick={sidebarToggle}
        />
      )}

      <aside
        className={`
          fixed right-0 top-0 h-screen z-30
          border-l overflow-hidden
          transition-[width] duration-200 ease-out
          ${open ? "w-64" : "w-0"}
          ${bg} ${sbBorder}
        `}
      >
        <div className="h-full flex flex-col py-2">
          {open && (
            <div className="flex items-center justify-between px-2 mb-2 shrink-0">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded mt-2 ${hoverBg}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-900" />
                )}
              </button>
            </div>
          )}

          <nav className="flex flex-col gap-0.5 px-2 shrink-0">
            <SidebarItem
              icon={Folder}
              label="Home"
              open={open}
              darkMode={darkMode}
              onClick={() => {
                sidebarToggle();
                navigate("/home");
              }}
            />
          </nav>

          <div className="flex-1 min-h-0 mt-4 px-2">
            {open && (
              <>
                <div
                  className={`px-2 mb-2 text-xs uppercase tracking-wide ${mutedCls}`}
                >
                  Projects
                </div>
                <div className="h-[calc(100%-28px)] overflow-y-auto">
                  <div className="space-y-0.5">
                    {userData?.repos?.map((repo) => {
                      const isActive = String(repo.id) === id;
                      return (
                        <button
                          key={repo.id}
                          onClick={() => {
                            handleRepoClick(repo);
                            sidebarToggle();
                          }}
                          className={`
                            w-full flex items-center px-2 py-2 rounded text-left text-sm
                            transition-colors duration-100
                            ${
                              isActive
                                ? darkMode
                                  ? "bg-gray-700 text-white"
                                  : "bg-gray-200 text-gray-900"
                                : darkMode
                                  ? `${textCls} hover:bg-gray-800`
                                  : `${textCls} hover:bg-gray-100`
                            }
                          `}
                        >
                          <Folder
                            className={`w-5 h-5 shrink-0 ${
                              isActive
                                ? darkMode
                                  ? "text-white"
                                  : "text-gray-900"
                                : mutedCls
                            }`}
                          />
                          <span className="ml-2 truncate text-sm">
                            {repo.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {open && (
            <div className="px-2 pt-2 mt-auto shrink-0">
              <div className={`flex items-center gap-2 px-2 py-1.5 rounded ${hoverBg}`}>
                <Avatar username={userData?.username} darkMode={darkMode} />
                <span className={`text-sm truncate flex-1 ${textCls}`}>
                  {userData?.username || "User"}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 rounded hover:bg-red-500/10 shrink-0"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const Avatar = ({ username, darkMode }) => (
  <div
    className={`
      size-7 rounded-full shrink-0
      flex items-center justify-center
      text-xs font-medium select-none
      ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}
    `}
  >
    {username?.[0]?.toUpperCase() ?? <User className="w-3.5 h-3.5" />}
  </div>
);

const SidebarItem = ({ icon, label, open, darkMode, onClick }) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center p-2 rounded
        transition-colors duration-100
        ${open ? "" : "justify-center"}
        ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}
      `}
    >
      <Icon
        className={`w-5 h-5 shrink-0 ${darkMode ? "text-white" : "text-gray-900"}`}
      />
      <span
        className={`
          ml-3 text-sm whitespace-nowrap overflow-hidden
          transition-opacity duration-150
          ${darkMode ? "text-white" : "text-gray-900"}
          ${open ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 ml-0"}
        `}
      >
        {label}
      </span>
    </button>
  );
};

export default Sidebar;
