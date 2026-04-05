import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProjectView = ({ userData, darkMode }) => {
  const { id } = useParams();

  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const d = darkMode;

  const project = useMemo(
    () => userData?.repos?.find((p) => String(p.id) === id) ?? null,
    [id, userData],
  );

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/api/note/${id}`,
          { withCredentials: true },
        );
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, [id]);

  useEffect(() => {
    const fetchtasks = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/api/task/${id}`,
          { withCredentials: true },
        );
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchtasks();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(project.clone_url || project.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNote = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/api/note/${id}`,
        {
          title: noteTitle,
          content: noteContent,
        },
        { withCredentials: true },
      );

      setNotes((prev) => [...prev, res.data]);
      setNoteTitle("");
      setNoteContent("");
      setShowNoteInput(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/api/note/${noteId}`,
        { withCredentials: true },
      );

      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddtask = async () => {
    if (!taskText.trim()) return;

    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/api/task/${id}`,
        { text: taskText },
        { withCredentials: true },
      );

      setTasks((prev) => [...prev, res.data]);
      setTaskText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggletask = async (taskId) => {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BACKEND_URL + `/api/task/${taskId}`,
        {},
        { withCredentials: true },
      );

      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletetask = async (taskId) => {
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/api/task/${taskId}`,
        { withCredentials: true },
      );

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const textCls = d ? "text-white" : "text-gray-900";
  const mutedCls = d ? "text-gray-400" : "text-gray-500";
  const borderCls = d ? "border-gray-700" : "border-gray-200";
  const panelCls = d ? "bg-[#111827]" : "bg-white";

  const buttonCls = d
    ? "border border-gray-600 px-4 py-2 text-sm text-white hover:border-gray-400"
    : "border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:border-gray-500";

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
          <div className="flex flex-col gap-4">
            <p className={`text-sm ${mutedCls}`}>
              https://github.com/{project.owner?.login ?? "unknown"}/
            </p>

            <h1 className={`mt-1 text-3xl ${textCls}`}>{project.name}</h1>

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

            <button
              onClick={handleCopy}
              className={`cursor-pointer ${buttonCls}`}
            >
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
          {/* Task */}
          <div className={`border p-6 ${borderCls} ${panelCls}`}>
            <h2 className={`text-lg font-medium mb-4 ${textCls}`}>Tasks</h2>

            {/* Input */}
            <div className="flex gap-2 mb-4">
              <input
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add task..."
                className={`flex-1 p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
              />
              <button
                onClick={handleAddtask}
                className={`cursor-pointer ${buttonCls}`}
              >
                Add
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex justify-between items-center border px-3 py-2 text-sm ${borderCls} ${textCls}`}
                >
                  <span
                    onClick={() => handleToggletask(task._id)}
                    className={`cursor-pointer ${
                      task.completed ? "line-through opacity-60" : ""
                    }`}
                  >
                    {task.text}
                  </span>

                  <button
                    onClick={() => {
                      if (window.confirm("Delete this task?")) {
                        handleDeletetask(task._id);
                      }
                    }}
                    className="text-red-500 text-xs cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className={`border p-6 lg:col-span-2 ${borderCls} ${panelCls}`}>
            <h2 className={`text-lg font-medium mb-4 ${textCls}`}>Notes</h2>

            {/* Toggle Button */}
            {!showNoteInput && (
              <button
                onClick={() => setShowNoteInput(true)}
                className={`cursor-pointer ${buttonCls}`}
              >
                Add Note
              </button>
            )}

            {/* Input Section */}
            {showNoteInput && (
              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className={`w-full p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
                />

                <textarea
                  placeholder="Content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className={`w-full p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleAddNote}
                    className={`cursor-pointer ${buttonCls}`}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setShowNoteInput(false)}
                    className={`border border-red-500 cursor-pointer ${buttonCls}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-3 mt-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className={`border p-3 text-sm flex justify-between ${borderCls} ${textCls}`}
                >
                  <div>
                    <h4 className="font-medium">{note.title}</h4>
                    <p className={mutedCls}>{note.content}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm("Delete this note?")) {
                        handleDeleteNote(note._id);
                      }
                    }}
                    className=" text-red-500 text-xs cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectView;
