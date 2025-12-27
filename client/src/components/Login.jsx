import {Moon,FolderGit2,Github} from "lucide-react"
const Login = ({ handleGitHubLogin, darkMode, setDarkMode }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="max-w-md w-full">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded transition-colors ${
              darkMode
                ? "hover:bg-gray-800 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="text-center mb-8">
          <FolderGit2
            className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          />
          <h1
            className={`text-2xl font-light mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Project Manager
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Organize your work efficiently
          </p>
        </div>

        <button
          onClick={handleGitHubLogin}
          className={`w-full font-normal py-3 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-3 ${
            darkMode
              ? "bg-white hover:bg-gray-100 text-gray-900"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          }`}
        >
          <Github className="w-5 h-5" />
          Connect with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login