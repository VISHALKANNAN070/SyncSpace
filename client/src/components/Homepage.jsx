const Homepage = ({ userData, darkMode, onSelectProject }) => {
  // Check for data
  if (!userData) {
    return (
      <div className={`p-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Loading...
      </div>
    );
  }

  const repos = userData.repos || [];

  //Check for most used language
  const languageCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  const mostUsedLanguage =
    Object.keys(languageCount).length > 0
      ? Object.keys(languageCount).reduce((a, b) =>
          languageCount[a] > languageCount[b] ? a : b,
        )
      : "None";

  return (
    <div className="max-w-full ml-14 md:p-8 sm:p-0">
      <div className="mb-8">
        <h2
          className={`text-2xl font-light mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Overview
        </h2>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Track your project progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total Repositories */}
        <div
          className={`border rounded p-6 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-3xl font-light mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {repos.length}
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Repositories
          </div>
        </div>

        {/* Total Stars */}
        <div
          className={`border rounded p-6 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-3xl font-light mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {repos.reduce((acc, p) => acc + (p.stargazers_count || 0), 0)}
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Stars
          </div>
        </div>

        {/* Most Used Language */}
        <div
          className={`border rounded p-6 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-3xl font-light mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {mostUsedLanguage}
          </div>
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Most Used Language
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h3
          className={`text-lg font-normal mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Projects
        </h3>
        <div className="space-y-3">
          <div
            className={` rounded p-4 transition-colors ${
              darkMode
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {repos.length > 0 ? (
              repos.map((repo, index) => (
                <div
                  onClick={()=>onSelectProject(repo)}
                  key={repo.id || index}
                  className={`border-b p-2 transition-colors mb-3 cursor-pointer ${
                    darkMode
                      ? "border-gray-700 hover:border-gray-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4
                        className={`text-base mb-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {repo.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {repo.description || "No Description"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={darkMode ? "text-gray-500" : "text-gray-400"}>
                No projects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
