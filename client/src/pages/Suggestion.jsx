import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Suggestion = () => {
  const navigate = useNavigate();
  const [repos, setrepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/repos`, {
          withCredentials: true,
        });
        setrepos(res.data);
      } catch (err) {
        console.error("Error fetching repos:", err);
        navigate("/");
      }
    };
    fetchRepos();
  }, [navigate]);

  const toggleSelectRepo = (id) => {
    setSelectedRepo((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    try {
      const selected = repos.filter((r) => selectedRepo.includes(r._id));
      await axios.post(
        `${import.meta.env.VITE_API_URL}/repos/select`,
        { selectedrepos: selected.map((r) => r._id) },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error saving selected repos:", error);
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="font-bold mb-4 text-lg">My Repositories</h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {repos.map((repo, count) => (
          <li
            style={{
              backgroundColor:
                selectedRepo && selectedRepo.includes(repo._id)
                  ? "#4B5563"
                  : "transparent",
            }}
            onClick={() => toggleSelectRepo(repo._id)}
            key={repo._id}
            className="border border-gray-700 rounded-lg p-3 hover:bg-base-200 cursor-pointer transition"
          >
            <h3 className="font-medium text-sm sm:text-base">{repo.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Project {count + 1}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center">
        <button
          className="btn bg-gray-700 w-full sm:w-auto px-6 py-2"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
export default Suggestion;
