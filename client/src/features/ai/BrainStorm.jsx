import { useState } from "react";
import { getThemeClasses } from "../../theme";
import { brainstormAPI } from "../../api/ai";

const SECTIONS = [
  { key: "summary", label: "Summary", type: "text" },
  { key: "features", label: "Features", type: "list" },
  { key: "notes", label: "Implementation Notes", type: "list" },
  { key: "risks", label: "Risks", type: "list" },
  { key: "futureIdeas", label: "Future Ideas", type: "list" },
];

const BrainStorm = ({ repoId, darkMode, onPushToTask, onPushToNote }) => {
  const { textCls, mutedCls, borderCls, panelCls, buttonCls } =
    getThemeClasses(darkMode);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setSelected(new Set());
    try {
      const data = await brainstormAPI(repoId, input.trim());
      setResults(data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Brainstorm failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleItem = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSection = (key, items) => {
    if (!items || !Array.isArray(items)) return;
    const allSelected = items.every((_, i) => selected.has(`${key}-${i}`));
    setSelected((prev) => {
      const next = new Set(prev);
      items.forEach((_, i) => {
        const id = `${key}-${i}`;
        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });
      return next;
    });
  };

  const getSelectedTexts = () => {
    const texts = [];
    if (!results) return texts;
    for (const { key } of SECTIONS) {
      const items = results[key];
      if (!Array.isArray(items)) continue;
      items.forEach((item, i) => {
        if (selected.has(`${key}-${i}`)) {
          texts.push(item);
        }
      });
    }
    return texts;
  };

  const handlePushToTask = () => {
    const texts = getSelectedTexts();
    if (texts.length === 0) return;
    onPushToTask(texts);
    setSelected(new Set());
  };

  const handlePushToNote = () => {
    const texts = getSelectedTexts();
    if (texts.length === 0) return;
    onPushToNote(texts);
    setSelected(new Set());
  };

  return (
    <div className={`border p-4 md:p-6 lg:col-span-2 ${borderCls} ${panelCls}`}>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className={`text-base md:text-lg font-medium ${textCls}`}>
          Get new ideas for your project.
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className={`cursor-pointer ${buttonCls}`}
        >
          {open ? "Close" : "Brainstorm"}
        </button>
      </div>

      {open && (
        <>
          <div className="mb-4 space-y-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your project idea, feature, or concept..."
              rows={3}
              className={`w-full p-2 text-sm border ${borderCls} ${panelCls} ${textCls}`}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className={`cursor-pointer ${buttonCls} disabled:opacity-50`}
            >
              {loading ? "Thinking..." : "Generate"}
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-500 border border-red-500/30 rounded">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 py-4">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
              <span className={`text-sm ${mutedCls}`}>
                Generating ideas...
              </span>
            </div>
          )}

          {results && !loading && (
            <>
              {SECTIONS.map(({ key, label, type }) => {
                const items = results[key];
                if (type === "text") {
                  return (
                    <div key={key} className="mb-4">
                      <h3 className={`text-sm font-medium mb-1 ${textCls}`}>
                        {label}
                      </h3>
                      <p className={`text-sm ${mutedCls}`}>{items}</p>
                    </div>
                  );
                }
                if (!Array.isArray(items) || items.length === 0) return null;
                const allSelected = items.every((_, i) =>
                  selected.has(`${key}-${i}`),
                );
                const sectionCheckId = `section-${key}`;
                return (
                  <div key={key} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={sectionCheckId}
                        checked={allSelected}
                        onChange={() => toggleSection(key, items)}
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor={sectionCheckId}
                        className={`text-sm font-medium cursor-pointer ${textCls}`}
                      >
                        {label} ({items.length})
                      </label>
                    </div>
                    <div className="space-y-1 ml-5">
                      {items.map((item, i) => {
                        const itemId = `${key}-${i}`;
                        return (
                          <div key={itemId} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id={itemId}
                              checked={selected.has(itemId)}
                              onChange={() => toggleItem(itemId)}
                              className="mt-0.5 cursor-pointer shrink-0"
                            />
                            <label
                              htmlFor={itemId}
                              className={`text-sm cursor-pointer ${
                                selected.has(itemId) ? textCls : mutedCls
                              }`}
                            >
                              {item}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {selected.size > 0 && (
                <div
                  className={`flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t ${borderCls}`}
                >
                  <button
                    onClick={handlePushToTask}
                    className={`cursor-pointer ${buttonCls}`}
                  >
                    Push to Tasks ({selected.size})
                  </button>
                  <button
                    onClick={handlePushToNote}
                    className={`cursor-pointer ${buttonCls}`}
                  >
                    Push to Notes ({selected.size})
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BrainStorm;
