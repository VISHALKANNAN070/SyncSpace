import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThemeClasses } from "../../theme";
import {
  fetchNotes,
  createNote,
  deleteNote,
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "../../api/projects";
import TaskPanel from "./TaskPanel";
import NotesPanel from "./NotesPanel";
import BrainStorm from "../ai/BrainStorm";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
};

const ProjectView = ({ userData, darkMode }) => {
  const { id } = useParams();
  const t = getThemeClasses(darkMode);

  const project =
    userData?.repos?.find((p) => String(p.id) === id) ?? null;

  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchNotes(id)
      .then(setNotes)
      .catch((err) => console.error(err));
    fetchTasks(id)
      .then(setTasks)
      .catch((err) => console.error(err));
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(project?.clone_url || project?.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNote = async (title, content) => {
    try {
      const note = await createNote(id, title, content);
      setNotes((prev) => [...prev, note]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(id, noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (text) => {
    try {
      const task = await createTask(id, text);
      setTasks((prev) => [...prev, task]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updated = await toggleTask(id, taskId);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updated : t)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(id, taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePushToTask = async (texts) => {
    for (const text of texts) {
      try {
        const task = await createTask(id, text);
        setTasks((prev) => [...prev, task]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePushToNote = async (texts) => {
    for (const text of texts) {
      try {
        const note = await createNote(id, "Brainstorm Item", text);
        setNotes((prev) => [...prev, note]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!userData) return <div>Loading user data...</div>;
  if (!project) return <div>Project not found</div>;

  const details = [
    { label: "Owner", value: project.owner?.login || "Unknown" },
    { label: "Language", value: project.language || "None" },
    { label: "Branch", value: project.default_branch || "main" },
    { label: "Updated", value: formatDate(project.updated_at) },
  ];

  return (
    <div className="px-4 md:px-8 py-4 md:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 md:mb-10 flex items-start justify-between">
          <div className="flex flex-col gap-2 md:gap-4">
            <h1 className={`text-2xl md:text-3xl mt-8 ${t.textCls}`}>
              {project.name}
            </h1>
            <p className={`text-sm max-w-3xl ${t.mutedCls}`}>
              {project.description || "No description provided"}
            </p>
          </div>
        </header>

        <div
          className={`flex flex-wrap items-center justify-between border-y py-3 md:py-4 mb-6 md:mb-10 gap-2 ${t.borderCls}`}
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm">
            <span className={t.textCls}>{project.language || "None"}</span>
            <span className={t.textCls}>
              Stars: {project.stargazers_count}
            </span>
            <span className={t.textCls}>Forks: {project.forks_count}</span>
            <span className={t.textCls}>
              Issues: {project.open_issues_count}
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 sm:flex-none text-center ${t.buttonCls}`}
            >
              Open repository
            </a>
            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-none text-center cursor-pointer ${t.buttonCls}`}
            >
              {copied ? "Copied" : "Copy clone URL"}
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <div className={`border p-4 md:p-6 ${t.borderCls} ${t.panelCls}`}>
            <h2
              className={`text-base md:text-lg font-medium mb-3 md:mb-4 ${t.textCls}`}
            >
              Project details
            </h2>
            <div className="space-y-3">
              {details.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className={t.mutedCls}>{label}</span>
                  <span className={t.textCls}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <TaskPanel
            tasks={tasks}
            darkMode={darkMode}
            onAdd={handleAddTask}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />

          <NotesPanel
            notes={notes}
            darkMode={darkMode}
            onAdd={handleAddNote}
            onDelete={handleDeleteNote}
          />

          <BrainStorm
            repoId={id}
            darkMode={darkMode}
            onPushToTask={handlePushToTask}
            onPushToNote={handlePushToNote}
          />
        </section>
      </div>
    </div>
  );
};

export default ProjectView;
