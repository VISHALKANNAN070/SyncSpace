import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/");
          return;
        }
        const data = await res.json();
        setUsername(data.name);
        setAvatar(data.avatarURL);
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
    <div className="h-screen w-64 bg-base-200 flex flex-col justify-between border-r border-gray-400">
      {/* Projects List will be added in the future */}
      <div></div>
      <div className="p-4 flex items-center gap-3 border-t border-base-300 relative">
        <div className="avatar">
          <div className="size-10 rounded-full ring ring-offset-2">
            {avatar && <img src={avatar} alt="User Avatar" />}
          </div>
        </div>

        <div className="flex-1">
          <p className="text-lg font-medium">{username || "User"}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost btn-circle"
          >
            <FaEllipsisV />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-14 bg-base-100 border border-base-300 rounded-lg shadow-lg w-40 z-10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-base-200 text-error"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
