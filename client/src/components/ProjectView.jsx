import { useEffect, useState } from "react";
import axios from "axios";

const ProjectView = ({ project, darkMode }) => {
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const d = darkMode;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/api/note/${project.id}`,
          { withCredentials: true },
        );
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [project]);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(project.clone_url || project.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!project) {
    return (
      <div
        className={`ml-16 px-8 py-8 text-sm ${d ? "text-gray-500" : "text-gray-400"}`}
      >
        Loading...
      </div>
    );
  }

  const textCls = d ? "text-white" : "text-gray-900";
  const mutedCls = d ? "text-gray-400" : "text-gray-500";
  const borderCls = d ? "border-gray-700" : "border-gray-200";
  const panelCls = d ? "bg-[#111827]" : "bg-white";

  const buttonCls = d
    ? "border border-gray-600 px-4 py-2 text-sm text-white hover:border-gray-400"
    : "border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:border-gray-500";

  const toggleCls = d
    ? "border border-gray-600 px-3 py-2 text-sm text-white hover:border-gray-400"
    : "border border-gray-300 px-3 py-2 text-sm text-gray-900 hover:border-gray-500";

  const details = [
    { label: "Owner", value: project.owner?.login || "Unknown" },
    { label: "Language", value: project.language || "None" },
    { label: "Branch", value: project.default_branch || "main" },
    { label: "Updated", value: formatDate(project.updated_at) },
  ];

  return (
    <div className="ml-16 px-8 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 flex items-start justify-between">
          <div>
            <p className={`text-sm ${mutedCls}`}>
              https://github.com/{project.owner?.login ?? "unknown"}/
            </p>

            <h1 className={`mt-1 text-3xl font-semibold ${textCls}`}>
              {project.name}
            </h1>

            <p className={`mt-2 max-w-3xl ${mutedCls}`}>
              {project.description || "No description provided"}
            </p>
          </div>
        </header>

        {/* Repo Info Bar */}
        <div
          className={`flex flex-wrap items-center justify-between border-y py-4 mb-10 ${borderCls}`}
        >
          <div className="flex flex-wrap gap-6 text-sm">
            <span className={textCls}>
              Language: {project.language || "None"}
            </span>
            <span className={textCls}>Stars: {project.stargazers_count}</span>
            <span className={textCls}>Forks: {project.forks_count}</span>
            <span className={textCls}>Issues: {project.open_issues_count}</span>
          </div>

          <div className="flex gap-3 mt-3 sm:mt-0">
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonCls}
            >
              Open repository
            </a>

            <button onClick={handleCopy} className={buttonCls}>
              {copied ? "Copied" : "Copy clone URL"}
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Project Details */}
          <div className={`border p-6 ${borderCls} ${panelCls}`}>
            <h2 className={`text-lg font-medium mb-4 ${textCls}`}>
              Project details
            </h2>

            <div className="space-y-3">
              {details.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className={mutedCls}>{label}</span>
                  <span className={textCls}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Todo */}
          <div className={`border p-6 ${borderCls} ${panelCls}`}>
            <h2 className={`text-lg font-medium mb-4 ${textCls}`}>Todo</h2>

            <div className="space-y-3">
              {[
                "Plan next feature",
                "Fix open bugs",
                "Improve documentation",
              ].map((item) => (
                <div
                  key={item}
                  className={`border px-3 py-2 text-sm ${borderCls} ${textCls}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className={`border p-6 lg:col-span-2 ${borderCls} ${panelCls}`}>
            <h2 className={`text-lg font-medium mb-4 ${textCls}`}>Notes</h2>

            <p className={`text-sm leading-6 ${mutedCls}`}>
              Keep architecture ideas, quick reminders, and planning notes
              related to this repository.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectView;
