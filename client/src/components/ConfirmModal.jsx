import { useEffect, useRef } from "react";

const ConfirmModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  darkMode,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className={`p-6 rounded-lg max-w-sm w-full mx-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        )}
        <p
          className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 text-sm rounded border ${
              darkMode
                ? "border-gray-600 text-white hover:bg-gray-700"
                : "border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
