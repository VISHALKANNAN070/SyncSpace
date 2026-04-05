import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = ({ fetchData, darkMode }) => {
  const navigate = useNavigate();
  // Guard against StrictMode double-invocation in development
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");

      if (error) {
        return navigate("/?error=auth_failed");
      }

      // Cookie is already set by the backend redirect — just verify session
      const success = await fetchData();
      if (success) {
        navigate("/home");
      } else {
        navigate("/?error=auth_failed");
      }
    };

    handleCallback();
  }, [navigate, fetchData]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-3 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
      <p
        className={`text-sm tracking-wide ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Authenticating...
      </p>
    </div>
  );
};

export default AuthCallback;
