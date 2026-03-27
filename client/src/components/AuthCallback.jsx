import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = ({fetchData}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error || !token) {
          return navigate("/?error=auth_failed");
        }

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/set-cookie`,
          { token },
          { withCredentials: true },
        );

        window.history.replaceState({}, "", "/auth/callback");
        await fetchData();
        navigate("/home");
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/?error=auth_failed");
      }
    };

    handleCallback();
  }, []);

  return (
         <div className={`min-h-screen flex flex-col items-center justify-center gap-3 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
           <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
           <p className={`text-sm tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
             Loading...
           </p>
         </div>
  );
};

export default AuthCallback;
