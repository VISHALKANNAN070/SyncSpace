import { useState } from "react";
import { getThemeClasses } from "../../theme";
import ConfirmModal from "../../components/ConfirmModal";

const NotesPanel = ({ notes, darkMode, onAdd, onDelete }) => {
  const { textCls, mutedCls, borderCls, panelCls, buttonCls } =
    getThemeClasses(darkMode);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onAdd(title.trim(), content.trim());
    setTitle("");
    setContent("");
    setShowInput(false);
  };

  return (
    <div className={`border p-4 md:p-6 lg:col-span-2 ${borderCls} ${panelCls}`}>
      <h2 className={`text-base md:text-lg font-medium mb-3 md:mb-4 ${textCls}`}>
        Notes
      </h2>

      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className={`cursor-pointer ${buttonCls}`}
        >
          Add Note
        </button>
      )}

      {showInput && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
          />
          <div className="flex gap-2 flex-col sm:flex-row">
            <button
              onClick={handleSave}
              className={`cursor-pointer ${buttonCls}`}
            >
              Save
            </button>
            <button
              onClick={() => setShowInput(false)}
              className={`border border-red-500 cursor-pointer ${buttonCls}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              onClick={() => setDeleteTarget(note._id)}
              className="text-red-500 text-xs cursor-pointer shrink-0"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
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

export default NotesPanel;
