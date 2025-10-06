import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Suggestion = () => {
  const navigate = useNavigate();
    const [repos, setrepos] = useState([]);
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
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="font-bold mb-2">My Repositories</h2>
        <ul className="flex flex-col gap-1">
          {repos.map((repo) => (
            <li
              key={repo._id}
              className="hover:bg-base-300 px-2 py-1 rounded text-sm"
            >
              {repo.name}
            </li>
          ))}
        </ul>
      </div>
    );
 }
export default Suggestion;