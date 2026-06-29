import { useMemo } from "react";
import { getThemeClasses } from "../../theme";

const getMostUsedLanguage = (repos) => {
  const counts = {};
  repos.forEach((repo) => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  });
  return Object.keys(counts).length > 0
    ? Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))
    : "None";
};

const Homepage = ({ userData, darkMode, onSelectProject }) => {
  const { textCls, mutedCls, borderCls } = getThemeClasses(darkMode);

  const repos = useMemo(() => userData?.repos || [], [userData?.repos]);
  const totalStars = useMemo(
    () => repos.reduce((acc, p) => acc + (p.stargazers_count || 0), 0),
    [repos],
  );
  const mostUsedLanguage = useMemo(() => getMostUsedLanguage(repos), [repos]);

  if (!userData) {
    return <div className={`p-6 ${textCls}`}>Loading...</div>;
  }

  return (
    <div className="max-w-full p-4 md:p-8">
      <div className="mb-8">
        <h2 className={`text-2xl font-light mb-2 ${textCls}`}>Overview</h2>
        <p className={mutedCls}>Track your project progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className={`border rounded p-4 md:p-6 ${borderCls}`}>
          <div className={`text-2xl md:text-3xl font-light mb-1 ${textCls}`}>
            {repos.length}
          </div>
          <div className={`text-xs md:text-sm ${mutedCls}`}>
            Total Repositories
          </div>
        </div>
        <div className={`border rounded p-4 md:p-6 ${borderCls}`}>
          <div className={`text-2xl md:text-3xl font-light mb-1 ${textCls}`}>
            {totalStars}
          </div>
          <div className={`text-xs md:text-sm ${mutedCls}`}>Total Stars</div>
        </div>
        <div className={`border rounded p-4 md:p-6 ${borderCls}`}>
          <div className={`text-2xl md:text-3xl font-light mb-1 ${textCls}`}>
            {mostUsedLanguage}
          </div>
          <div className={`text-xs md:text-sm ${mutedCls}`}>
            Most Used Language
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-normal mb-4 ${textCls}`}>Projects</h3>
        <div className="space-y-3">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => onSelectProject(repo)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProject(repo);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`border-b p-2 transition-colors mb-3 cursor-pointer ${borderCls}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`text-base mb-1 ${textCls}`}>
                      {repo.name}
                    </h4>
                    <p className={`text-sm ${mutedCls}`}>
                      {repo.description || "No Description"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={mutedCls}>No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
