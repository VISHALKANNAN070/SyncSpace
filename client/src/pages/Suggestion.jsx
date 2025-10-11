import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";

const Spinner = () => <div className="spinner" />;

const Suggestion = () => {
  const navigate = useNavigate();

  //loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Data State
  const [repos, setRepos] = useState([]);

  const [selectedRepoIds, setSelectedRepoIds] = useState(new Set());
  const [alreadySelectedIds, setAlreadySelectedIds] = useState(new Set());

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);

        const [allReposRes, prevSelectedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/repos`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/repos/selected`, {
            withCredentials: true,
          }),
        ]);

        const allRepos = allReposRes.data;
        const prevSelectedIds = new Set(prevSelectedRes.data.map((r) => r._id));
        setAlreadySelectedIds(prevSelectedIds);

        // Reorder list: unselected first, then previously selected
        const unselectedRepos = allRepos.filter(
          (r) => !prevSelectedIds.has(r._id)
        );
        const selectedRepos = allRepos.filter((r) =>
          prevSelectedIds.has(r._id)
        );

        setRepos([...unselectedRepos, ...selectedRepos]);
      } catch (err) {
        console.error("Error fetching repos:", err);
        setError("Failed to load repositories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const toggleSelectRepo = (id) => {
    if (alreadySelectedIds.has(id)) return;
    setSelectedRepoIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/repos/select`,
        { selectedrepos: Array.from(selectedRepoIds) },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error saving selected repos:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="flex-1 p-4 text-red-400">{error}</div>;
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="font-bold mb-4 text-lg">My Repositories</h2>

      {/* empty state */}
      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {repos.map((repo, index) => {
            const isAlreadySelected = alreadySelectedIds.has(repo._id);
            const isSelected = selectedRepoIds.has(repo._id);

            return (
              <li
                key={repo._id}
                onClick={() => toggleSelectRepo(repo._id)}
                className={clsx(
                  "border border-gray-700 rounded-lg p-3 transition",
                  {
                    "cursor-pointer": !isAlreadySelected,
                    "bg-gray-600 text-gray-400 cursor-not-allowed":
                      isAlreadySelected,
                    "bg-gray-700 text-white ring-2 ring-blue-500":
                      !isAlreadySelected && isSelected,
                    "hover:bg-gray-800": !isAlreadySelected && !isSelected,
                  }
                )}
              >
                <h3 className="font-medium text-sm sm:text-base">
                  {repo.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Project {index + 1}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex justify-center">
        <button
          className="btn bg-gray-700 w-full sm:w-auto px-6 py-2 flex items-center justify-center disabled:opacity-50"
          onClick={handleConfirm}
          // UX: Disable button when confirming or if no new repos are selected
          disabled={isConfirming || selectedRepoIds.size === 0}
        >
          {isConfirming ? <Spinner /> : `Confirm (${selectedRepoIds.size})`}
        </button>
      </div>
    </div>
  );
};

export default Suggestion;
