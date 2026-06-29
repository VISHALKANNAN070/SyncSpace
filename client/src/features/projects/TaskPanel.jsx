import { useState } from "react";
import { getThemeClasses } from "../../theme";
import ConfirmModal from "../../components/ConfirmModal";

const TaskPanel = ({ tasks, darkMode, onAdd, onToggle, onDelete }) => {
  const { textCls, borderCls, panelCls, buttonCls } =
    getThemeClasses(darkMode);
  const [taskText, setTaskText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = () => {
    if (!taskText.trim()) return;
    onAdd(taskText.trim());
    setTaskText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={`border p-4 md:p-6 ${borderCls} ${panelCls}`}>
      <h2 className={`text-base md:text-lg font-medium mb-3 md:mb-4 ${textCls}`}>
        Tasks
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add task..."
          className={`flex-1 min-w-0 p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
        />
        <button
          onClick={handleAdd}
          className={`cursor-pointer shrink-0 ${buttonCls}`}
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`flex justify-between items-center border px-3 py-2 text-sm ${borderCls} ${textCls}`}
          >
            <span
              onClick={() => onToggle(task._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle(task._id);
                }
              }}
              tabIndex={0}
              role="button"
              className={`cursor-pointer ${
                task.completed ? "line-through opacity-60" : ""
              }`}
            >
              {task.task}
            </span>
            <button
              onClick={() => setDeleteTarget(task._id)}
              className="text-red-500 text-xs cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        darkMode={darkMode}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default TaskPanel;
