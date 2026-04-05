import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  onSelectProject,
  sidebarToggle,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleRepoClick = async (repo) => {
    onSelectProject(repo);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/repo",
        {
          repoId: repo.id,
          name: repo.name,
          url: repo.html_url,
        },
        { withCredentials: true },
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const border = darkMode ? "border-gray-800" : "border-gray-200";
  const bg = darkMode ? "bg-gray-900" : "bg-white";
  const hoverBg = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const iconCls = darkMode ? "text-white" : "text-gray-900";
  const textCls = darkMode ? "text-gray-200" : "text-gray-800";
  const mutedCls = "text-gray-500";

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-30
        border-r overflow-hidden
        transition-[width] duration-200 ease-out
        ${open ? "w-64" : "w-14"}
        ${bg} ${border}
      `}
    >
      <div className="h-full flex flex-col py-2">
        {/* ── TOP BAR ── */}
        <div
          className={`flex items-center px-2 mb-1 shrink-0 ${open ? "" : "justify-center"}`}
        >
          {/* Hamburger — always visible */}
          <button
            onClick={onToggle}
            className={`p-2 rounded shrink-0 ${hoverBg}`}
            aria-label="Toggle sidebar"
          >
            <Menu className={`w-5 h-5 ${iconCls}`} />
          </button>

          {/* Dark-mode toggle — removed from flow when collapsed so it can't shift hamburger */}
          {open && (
            <div className="ml-auto mr-1 shrink-0">
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded ${hoverBg}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-white" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-900" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── NAV ── */}
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

        {/* ── PROJECT LIST ── */}
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
                          className={`w-4 h-4 shrink-0 ${
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

        {/* ── USER / LOGOUT ── */}
        <div className="px-2 pt-2 mt-auto shrink-0">
          {open ? (
            /* Expanded: avatar + name + logout */
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded ${hoverBg}`}
            >
              <Avatar username={userData?.username} darkMode={darkMode} />
              <span className={`text-sm truncate flex-1 ${textCls}`}>
                {userData?.username || "User"}
              </span>
              <button
                onClick={onLogout}
                className="p-1 rounded hover:bg-red-500/10 shrink-0"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ) : (
            /* Collapsed: avatar only, centered */
            <div className="flex justify-center py-1">
              <Avatar username={userData?.username} darkMode={darkMode} />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

/* ── Avatar ── */
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

/* ── SidebarItem ── */
const SidebarItem = ({ icon: Icon, label, open, darkMode, onClick }) => (
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

export default Sidebar;
